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

// Simple token verification
const verifyToken = (authHeader: string | undefined): boolean => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  return token.length > 10;
};

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
      is_popular BOOLEAN DEFAULT false,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
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

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Verify authentication for all operations
  if (!verifyToken(event.headers.authorization)) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  const client = createDbClient();

  try {
    await client.connect();
    await initializeTables(client);

    const pathParts = event.path.split('/').filter(part => part);
    const resource = pathParts[pathParts.length - 1]; // content-sections
    const sectionTypeOrId = pathParts[pathParts.length - 2];

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
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Content sections error:', error);
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

// GET handler
const handleGet = async (client: Client, sectionTypeOrId: string, queryParams: any) => {
  if (sectionTypeOrId && sectionTypeOrId !== 'content-sections') {
    // Get specific section by type
    const result = await client.query(
      'SELECT * FROM content_sections WHERE section_type = $1 ORDER BY sort_order ASC',
      [sectionTypeOrId]
    );

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Section not found' }),
      };
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
    // Get all sections
    const result = await client.query(
      'SELECT * FROM content_sections ORDER BY section_type, sort_order ASC'
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
};

// POST handler
const handlePost = async (client: Client, body: string | null, parentId?: string) => {
  if (!body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Request body required' }),
    };
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
        `INSERT INTO pricing_plans (section_id, name, price, period, description, features, button_text, is_popular, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [parentId, data.plan.name, data.plan.price, data.plan.period, data.plan.description,
         JSON.stringify(data.plan.features), data.plan.button_text, data.plan.is_popular, data.plan.sort_order || 0]
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
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Section type and data are required' }),
    };
  }

  const result = await client.query(
    `INSERT INTO content_sections (section_type, section_data, is_visible, sort_order)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [section_type, JSON.stringify(section_data), is_visible, sort_order]
  );

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      success: true,
      data: result.rows[0]
    }),
  };
};

// PUT handler
const handlePut = async (client: Client, body: string | null, idOrType: string) => {
  if (!body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Request body required' }),
    };
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
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Section not found' }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      data: result.rows[0]
    }),
  };
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
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Section not found' }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Section deleted successfully'
    }),
  };
};

export { handler };