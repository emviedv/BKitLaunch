import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Client } from 'pg';
import { withCors, createDbClient, sendJSON, handleError, isAuthorized } from './utils';

// Initialize database tables
const initializeTables = async (client: Client) => {
  // Content sections table
  await client.query(`
    CREATE TABLE IF NOT EXISTS content_sections (
      id SERIAL PRIMARY KEY,
      section_type VARCHAR(50) NOT NULL,
      section_data JSONB NOT NULL,
      is_visible BOOLEAN DEFAULT true,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Features table (for features section items)
  await client.query(`
    CREATE TABLE IF NOT EXISTS features (
      id SERIAL PRIMARY KEY,
      section_id INTEGER REFERENCES content_sections(id) ON DELETE CASCADE,
      icon VARCHAR(10) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      badge VARCHAR(100),
      badge_color VARCHAR(50),
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Pricing plans table
  await client.query(`
    CREATE TABLE IF NOT EXISTS pricing_plans (
      id SERIAL PRIMARY KEY,
      section_id INTEGER REFERENCES content_sections(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      price VARCHAR(50) NOT NULL,
      period VARCHAR(50),
      description TEXT,
      features JSONB NOT NULL DEFAULT '[]',
      button_text VARCHAR(100) NOT NULL,
      button_link VARCHAR(255),
      is_popular BOOLEAN DEFAULT false,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add button_link column if it doesn't exist (migration for existing tables)
  await client.query(`
    ALTER TABLE pricing_plans 
    ADD COLUMN IF NOT EXISTS button_link VARCHAR(255);
  `);

  // Navigation items table
  await client.query(`
    CREATE TABLE IF NOT EXISTS navigation_items (
      id SERIAL PRIMARY KEY,
      section_id INTEGER REFERENCES content_sections(id) ON DELETE CASCADE,
      label VARCHAR(100) NOT NULL,
      href VARCHAR(255) NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Footer link groups table
  await client.query(`
    CREATE TABLE IF NOT EXISTS footer_link_groups (
      id SERIAL PRIMARY KEY,
      section_id INTEGER REFERENCES content_sections(id) ON DELETE CASCADE,
      title VARCHAR(100) NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Footer links table
  await client.query(`
    CREATE TABLE IF NOT EXISTS footer_links (
      id SERIAL PRIMARY KEY,
      group_id INTEGER REFERENCES footer_link_groups(id) ON DELETE CASCADE,
      label VARCHAR(100) NOT NULL,
      href VARCHAR(255) NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Contact info table
  await client.query(`
    CREATE TABLE IF NOT EXISTS contact_info (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      twitter VARCHAR(100),
      github VARCHAR(100),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create indexes for better performance
  await client.query('CREATE INDEX IF NOT EXISTS idx_content_sections_type ON content_sections(section_type);');
  await client.query('CREATE INDEX IF NOT EXISTS idx_features_section_id ON features(section_id);');
  await client.query('CREATE INDEX IF NOT EXISTS idx_pricing_plans_section_id ON pricing_plans(section_id);');
};

const contentSectionsHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Require authentication only for write operations; allow public GET
  if (
    ['POST', 'PUT', 'DELETE'].includes(event.httpMethod) &&
    !isAuthorized(event)
  ) {
    return sendJSON(401, { error: 'Unauthorized' });
  }

  const client = createDbClient();

  try {
    await client.connect();
    await initializeTables(client);

    const pathParts = event.path.split('/').filter(part => part);
    const resource = pathParts[pathParts.length - 1]; // content-sections or section-type/id
    
    // For routes like /.netlify/functions/content-sections/{type}
    // we want to extract the type from the last segment
    let sectionTypeOrId = resource;
    
    // If this is a sub-route (more than just the function name), 
    // check if we have a section type in the path
    if (pathParts.length > 3) {
      // Path like /.netlify/functions/content-sections/features
      sectionTypeOrId = pathParts[pathParts.length - 1];
    }

    switch (event.httpMethod) {
      case 'GET':
        return await handleGet(client, sectionTypeOrId, event.queryStringParameters);

      case 'POST':
        return await handlePost(client, event.body, sectionTypeOrId);

      case 'PUT':
        return await handlePut(client, event.body, sectionTypeOrId);

      case 'DELETE':
        return await handleDelete(client, sectionTypeOrId);

      default:
        return sendJSON(405, { error: 'Method not allowed' });
    }
  } catch (error) {
    return handleError(error, 'Content sections');
  } finally {
    await client.end();
  }
};

// GET handler
const handleGet = async (client: Client, sectionTypeOrId: string, queryParams: any) => {
  if (sectionTypeOrId && sectionTypeOrId !== 'content-sections') {
    // Get specific section by type
    const result = await client.query(
      'SELECT * FROM content_sections WHERE section_type = $1 ORDER BY sort_order ASC',
      [sectionTypeOrId]
    );

    if (result.rows.length === 0) {
      return sendJSON(404, { error: 'Section not found' });
    }

    const section = result.rows[0];

    // Load related data based on section type
    if (section.section_type === 'features') {
      const features = await client.query(
        'SELECT * FROM features WHERE section_id = $1 ORDER BY sort_order ASC',
        [section.id]
      );
      section.features = features.rows;
    } else if (section.section_type === 'pricing') {
      const plans = await client.query(
        'SELECT * FROM pricing_plans WHERE section_id = $1 ORDER BY sort_order ASC',
        [section.id]
      );
      section.plans = plans.rows;
    } else if (section.section_type === 'header') {
      const navItems = await client.query(
        'SELECT * FROM navigation_items WHERE section_id = $1 ORDER BY sort_order ASC',
        [section.id]
      );
      section.navigation_items = navItems.rows;
    } else if (section.section_type === 'footer') {
      const groups = await client.query(
        'SELECT * FROM footer_link_groups WHERE section_id = $1 ORDER BY sort_order ASC',
        [section.id]
      );
      
      for (const group of groups.rows) {
        const links = await client.query(
          'SELECT * FROM footer_links WHERE group_id = $1 ORDER BY sort_order ASC',
          [group.id]
        );
        group.links = links.rows;
      }
      section.footer_links = groups.rows;
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: section
      }),
    };
  } else {
    // Get all sections with nested data - FIXED: now includes related data for all sections
    const result = await client.query(
      'SELECT * FROM content_sections ORDER BY section_type, sort_order ASC'
    );

    // Load related data for each section
    for (const section of result.rows) {
      if (section.section_type === 'features') {
        const features = await client.query(
          'SELECT * FROM features WHERE section_id = $1 ORDER BY sort_order ASC',
          [section.id]
        );
        section.features = features.rows;
      } else if (section.section_type === 'pricing') {
        const plans = await client.query(
          'SELECT * FROM pricing_plans WHERE section_id = $1 ORDER BY sort_order ASC',
          [section.id]
        );
        section.plans = plans.rows;
      } else if (section.section_type === 'header') {
        const navItems = await client.query(
          'SELECT * FROM navigation_items WHERE section_id = $1 ORDER BY sort_order ASC',
          [section.id]
        );
        section.navigation_items = navItems.rows;
      } else if (section.section_type === 'footer') {
        const groups = await client.query(
          'SELECT * FROM footer_link_groups WHERE section_id = $1 ORDER BY sort_order ASC',
          [section.id]
        );
        
        for (const group of groups.rows) {
          const links = await client.query(
            'SELECT * FROM footer_links WHERE group_id = $1 ORDER BY sort_order ASC',
            [group.id]
          );
          group.links = links.rows;
        }
        section.footer_links = groups.rows;
      }
    }

    return sendJSON(200, {
      success: true,
      data: result.rows
    });
  }
};

// POST handler
const handlePost = async (client: Client, body: string | null, parentId?: string) => {
  if (!body) {
    return sendJSON(400, { error: 'Request body required' });
  }

  const data = JSON.parse(body);

  // Handle creating sub-items for sections
  if (parentId && parentId !== 'content-sections') {
    if (data.feature) {
      // Create feature item
      const result = await client.query(
        `INSERT INTO features (section_id, icon, title, description, badge, badge_color, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [parentId, data.feature.icon, data.feature.title, data.feature.description, 
         data.feature.badge, data.feature.badge_color, data.feature.sort_order || 0]
      );

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          data: result.rows[0]
        }),
      };
    } else if (data.plan) {
      // Create pricing plan
      const result = await client.query(
        `INSERT INTO pricing_plans (section_id, name, price, period, description, features, button_text, button_link, is_popular, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [parentId, data.plan.name, data.plan.price, data.plan.period, data.plan.description,
         JSON.stringify(data.plan.features), data.plan.button_text, data.plan.button_link, data.plan.is_popular, data.plan.sort_order || 0]
      );

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          data: result.rows[0]
        }),
      };
    }
  }

  // Create main section
  const { section_type, section_data, is_visible = true, sort_order = 0 } = data;

  if (!section_type || !section_data) {
    return sendJSON(400, { error: 'Section type and data are required' });
  }

  const result = await client.query(
    `INSERT INTO content_sections (section_type, section_data, is_visible, sort_order)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [section_type, JSON.stringify(section_data), is_visible, sort_order]
  );

  return sendJSON(201, {
    success: true,
    data: result.rows[0]
  });
};

// PUT handler
const handlePut = async (client: Client, body: string | null, idOrType: string) => {
  if (!body) {
    return sendJSON(400, { error: 'Request body required' });
  }

  const data = JSON.parse(body);
  const id = parseInt(idOrType);

  if (isNaN(id)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid section ID' }),
    };
  }

  const { section_data, is_visible, sort_order } = data;
  const updates: string[] = [];
  const values: any[] = [];
  let valueIndex = 1;

  if (section_data !== undefined) {
    updates.push(`section_data = $${valueIndex++}`);
    values.push(JSON.stringify(section_data));
  }

  if (is_visible !== undefined) {
    updates.push(`is_visible = $${valueIndex++}`);
    values.push(is_visible);
  }

  if (sort_order !== undefined) {
    updates.push(`sort_order = $${valueIndex++}`);
    values.push(sort_order);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const result = await client.query(
    `UPDATE content_sections SET ${updates.join(', ')} WHERE id = $${valueIndex} RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
      return sendJSON(404, { error: 'Section not found' });
  }

  return sendJSON(200, {
    success: true,
    data: result.rows[0]
  });
};

// DELETE handler
const handleDelete = async (client: Client, idOrType: string) => {
  const id = parseInt(idOrType);

  if (isNaN(id)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid section ID' }),
    };
  }

  const result = await client.query(
    'DELETE FROM content_sections WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
      return sendJSON(404, { error: 'Section not found' });
  }

  return sendJSON(200, {
    success: true,
    message: 'Section deleted successfully'
  });
};

export const handler = withCors(contentSectionsHandler);