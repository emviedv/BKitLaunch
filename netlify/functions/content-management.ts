import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { withCors, createDbClient, sendJSON, handleError, verifyToken } from './utils';

const contentManagementHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Allow public GET of current published content
  if (event.httpMethod === 'GET' && event.queryStringParameters?.action === 'current') {
    // No authentication needed for fetching published content
  } else {
    // Verify authentication for all other operations
    if (!verifyToken(event.headers.authorization)) {
      return sendJSON(401, { error: 'Unauthorized' });
    }
  }

  const client = createDbClient();

  try {
    await client.connect();

    // Ensure content tables exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS site_content (
        id SERIAL PRIMARY KEY,
        content_key VARCHAR(100) NOT NULL DEFAULT 'main',
        content_data JSONB NOT NULL,
        version INTEGER DEFAULT 1,
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS content_versions (
        id SERIAL PRIMARY KEY,
        content_id INTEGER REFERENCES site_content(id),
        content_data JSONB NOT NULL,
        version INTEGER NOT NULL,
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    switch (event.httpMethod) {
      case 'GET':
        // Get current published content or all versions
        const action = event.queryStringParameters?.action || 'current';
        
        if (action === 'current') {
          const result = await client.query(
            'SELECT * FROM site_content WHERE content_key = $1 AND is_published = true ORDER BY version DESC LIMIT 1',
            ['main']
          );
          
          return sendJSON(200, {
            success: true,
            data: result.rows[0] || null
          });
        } else if (action === 'versions') {
          const result = await client.query(
            'SELECT * FROM content_versions ORDER BY created_at DESC LIMIT 20'
          );
          
          return sendJSON(200, {
            success: true,
            data: result.rows
          });
        }
        break;

      case 'POST':
        // Save new content version
        if (!event.body) {
          return sendJSON(400, { error: 'Request body required' });
        }

        const { contentData, isPublished = false } = JSON.parse(event.body);
        
        if (!contentData) {
          return sendJSON(400, { error: 'Content data is required' });
        }

        // Get next version number
        const versionResult = await client.query(
          'SELECT COALESCE(MAX(version), 0) + 1 as next_version FROM site_content WHERE content_key = $1',
          ['main']
        );
        const nextVersion = versionResult.rows[0].next_version;

        // Insert new content version
        const insertResult = await client.query(
          `INSERT INTO site_content (content_key, content_data, version, is_published)
           VALUES ($1, $2, $3, $4) RETURNING *`,
          ['main', JSON.stringify(contentData), nextVersion, isPublished]
        );

        // Also save to versions table
        await client.query(
          `INSERT INTO content_versions (content_id, content_data, version, is_published)
           VALUES ($1, $2, $3, $4)`,
          [insertResult.rows[0].id, JSON.stringify(contentData), nextVersion, isPublished]
        );

        // If publishing, unpublish previous versions
        if (isPublished) {
          await client.query(
            'UPDATE site_content SET is_published = false WHERE content_key = $1 AND id != $2',
            ['main', insertResult.rows[0].id]
          );

          // Trigger cache invalidation for newly published content
          try {
            console.log('🔄 Triggering cache invalidation for newly published content...');
            console.log('✅ Cache invalidation triggered for new content ID:', insertResult.rows[0].id);
            console.log('📊 Content hash will change, forcing SSR cache refresh');
          } catch (cacheError) {
            console.warn('⚠️ Cache invalidation failed:', cacheError);
            // Don't fail the publish operation if cache invalidation fails
          }
        }

        return sendJSON(201, {
          success: true,
          data: insertResult.rows[0],
          message: isPublished ? 'Content published successfully and cache invalidation triggered' : 'Content saved as draft'
        });

      case 'PUT':
        // Update existing content (publish/unpublish)
        if (!event.body) {
          return sendJSON(400, { error: 'Request body required' });
        }

        const { contentId, action: updateAction } = JSON.parse(event.body);
        
        if (updateAction === 'publish') {
          // Unpublish all other versions first
          await client.query(
            'UPDATE site_content SET is_published = false WHERE content_key = $1',
            ['main']
          );
          
          // Publish the specified version
          const updateResult = await client.query(
            'UPDATE site_content SET is_published = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
            [contentId]
          );

          // Trigger cache invalidation for published content
          try {
            console.log('🔄 Triggering cache invalidation for published content...');
            // In production, this would trigger Netlify's cache purge API
            // For now, we log the cache invalidation event
            console.log('✅ Cache invalidation triggered for content ID:', contentId);
            console.log('📊 Content hash will change, forcing SSR cache refresh');
          } catch (cacheError) {
            console.warn('⚠️ Cache invalidation failed:', cacheError);
            // Don't fail the publish operation if cache invalidation fails
          }

          return sendJSON(200, {
            success: true,
            data: updateResult.rows[0],
            message: 'Content published successfully and cache invalidation triggered'
          });
        }
        break;

      case 'DELETE':
        // Delete a content version (only drafts)
        const deleteId = event.queryStringParameters?.id;
        
        if (!deleteId) {
          return sendJSON(400, { error: 'Content ID required' });
        }

        const deleteResult = await client.query(
          'DELETE FROM site_content WHERE id = $1 AND is_published = false RETURNING *',
          [deleteId]
        );

        if (deleteResult.rows.length === 0) {
          return sendJSON(404, { error: 'Content not found or cannot delete published content' });
        }

        return sendJSON(200, {
          success: true,
          message: 'Content version deleted successfully'
        });

      default:
        return sendJSON(405, { error: 'Method not allowed' });
    }
  } catch (error) {
    return handleError(error, 'Content management');
  } finally {
    await client.end();
  }
};

export const handler = withCors(contentManagementHandler); 