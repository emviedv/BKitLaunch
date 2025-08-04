import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Client } from 'pg';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

const createDbClient = () => {
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
};

// Simple token verification (enhance this for production)
const verifyToken = (authHeader: string | undefined): boolean => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  // In a simple implementation, we just check if token exists
  // In production, verify JWT or use proper token validation
  return token.length > 10;
};

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Allow public GET of current published content
  if (event.httpMethod === 'GET' && event.queryStringParameters?.action === 'current') {
    // No authentication needed for fetching published content
  } else {
    // Verify authentication for all other operations
    if (!verifyToken(event.headers.authorization)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' }),
      };
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
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: result.rows[0] || null
            }),
          };
        } else if (action === 'versions') {
          const result = await client.query(
            'SELECT * FROM content_versions ORDER BY created_at DESC LIMIT 20'
          );
          
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: result.rows
            }),
          };
        }
        break;

      case 'POST':
        // Save new content version
        if (!event.body) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Request body required' }),
          };
        }

        const { contentData, isPublished = false } = JSON.parse(event.body);
        
        if (!contentData) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Content data is required' }),
          };
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
        }

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            data: insertResult.rows[0],
            message: isPublished ? 'Content published successfully' : 'Content saved as draft'
          }),
        };

      case 'PUT':
        // Update existing content (publish/unpublish)
        if (!event.body) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Request body required' }),
          };
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

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              data: updateResult.rows[0],
              message: 'Content published successfully'
            }),
          };
        }
        break;

      case 'DELETE':
        // Delete a content version (only drafts)
        const deleteId = event.queryStringParameters?.id;
        
        if (!deleteId) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Content ID required' }),
          };
        }

        const deleteResult = await client.query(
          'DELETE FROM site_content WHERE id = $1 AND is_published = false RETURNING *',
          [deleteId]
        );

        if (deleteResult.rows.length === 0) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ error: 'Content not found or cannot delete published content' }),
          };
        }

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            message: 'Content version deleted successfully'
          }),
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Content management error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Internal server error'
      }),
    };
  } finally {
    await client.end();
  }
};

export { handler }; 