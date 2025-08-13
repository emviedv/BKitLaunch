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
      badges JSONB,
      sort_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add new feature columns if they don't exist (migration for existing tables)
  await client.query(`
    ALTER TABLE features 
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
  `);
  await client.query(`
    ALTER TABLE features 
    ADD COLUMN IF NOT EXISTS button_text VARCHAR(100);
  `);
  await client.query(`
    ALTER TABLE features 
    ADD COLUMN IF NOT EXISTS button_link VARCHAR(255);
  `);
  await client.query(`
    ALTER TABLE features 
    ADD COLUMN IF NOT EXISTS badges JSONB;
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
      is_coming_soon BOOLEAN DEFAULT true,
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

  // Add is_coming_soon column if it doesn't exist (migration for existing tables)
  await client.query(`
    ALTER TABLE pricing_plans 
    ADD COLUMN IF NOT EXISTS is_coming_soon BOOLEAN DEFAULT true;
  `);

  // Navigation items table
  await client.query(`
    CREATE TABLE IF NOT EXISTS navigation_items (
      id SERIAL PRIMARY KEY,
      section_id INTEGER REFERENCES content_sections(id) ON DELETE CASCADE,
      label VARCHAR(100) NOT NULL,
      href VARCHAR(255) NOT NULL,
      sort_order INTEGER DEFAULT 0,
      type VARCHAR(20),
      is_external BOOLEAN,
      nofollow BOOLEAN,
      is_button BOOLEAN,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Add new navigation item columns if they don't exist (migration for existing tables)
  await client.query(`
    ALTER TABLE navigation_items
    ADD COLUMN IF NOT EXISTS type VARCHAR(20);
  `);
  await client.query(`
    ALTER TABLE navigation_items
    ADD COLUMN IF NOT EXISTS is_external BOOLEAN;
  `);
  await client.query(`
    ALTER TABLE navigation_items
    ADD COLUMN IF NOT EXISTS nofollow BOOLEAN;
  `);
  await client.query(`
    ALTER TABLE navigation_items
    ADD COLUMN IF NOT EXISTS is_button BOOLEAN;
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
    const lastPart = pathParts[pathParts.length - 1];
    const prevPart = pathParts[pathParts.length - 2];

    // Identify sub-resources for nested CRUD
    const subResources = ['footer-link-groups', 'footer-links', 'navigation-items'];
    const isSubResource = subResources.includes(lastPart) || subResources.includes(prevPart);

    // Default resource is content-sections flow
    let resource = lastPart; // content-sections or section-type or id
    let subResource: string | null = null;
    let subResourceId: number | null = null;

    if (isSubResource) {
      // Two patterns supported:
      // 1) /.netlify/functions/content-sections/{subResource}
      // 2) /.netlify/functions/content-sections/{subResource}/{id}
      if (subResources.includes(lastPart)) {
        subResource = lastPart;
      } else if (subResources.includes(prevPart)) {
        subResource = prevPart;
        const maybeId = parseInt(lastPart, 10);
        subResourceId = isNaN(maybeId) ? null : maybeId;
      }
    }

    // For legacy section type routes, keep the last segment as section type or id
    let sectionTypeOrId = resource;

    // Handle sub-resource CRUD if requested
    if (subResource) {
      switch (event.httpMethod) {
        case 'POST':
          return await handleSubResourcePost(client, subResource, event.body);
        case 'PUT':
          return await handleSubResourcePut(client, subResource, subResourceId, event.body);
        case 'DELETE':
          return await handleSubResourceDelete(client, subResource, subResourceId);
        default:
          return sendJSON(405, { error: 'Method not allowed for sub-resource' });
      }
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

// Sub-resource handlers for footer groups/links and navigation items
const handleSubResourcePost = async (client: Client, subResource: string, body: string | null) => {
  if (!body) return sendJSON(400, { error: 'Request body required' });
  const data = JSON.parse(body);

  if (subResource === 'footer-link-groups') {
    const { section_id, title, sort_order = 0 } = data;
    if (!section_id || !title) return sendJSON(400, { error: 'section_id and title are required' });
    const result = await client.query(
      `INSERT INTO footer_link_groups (section_id, title, sort_order)
       VALUES ($1, $2, $3) RETURNING *`,
      [section_id, title, sort_order]
    );
    return sendJSON(201, { success: true, data: result.rows[0] });
  }

  if (subResource === 'footer-links') {
    const { group_id, label, href, sort_order = 0 } = data;
    if (!group_id || !label || !href) return sendJSON(400, { error: 'group_id, label and href are required' });
    const result = await client.query(
      `INSERT INTO footer_links (group_id, label, href, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [group_id, label, href, sort_order]
    );
    return sendJSON(201, { success: true, data: result.rows[0] });
  }

  if (subResource === 'navigation-items') {
    const { section_id, label, href, sort_order = 0, type, is_external, nofollow, is_button } = data;
    if (!section_id || !label || !href) return sendJSON(400, { error: 'section_id, label and href are required' });
    const result = await client.query(
      `INSERT INTO navigation_items (section_id, label, href, sort_order, type, is_external, nofollow, is_button)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [section_id, label, href, sort_order, type || null, is_external ?? null, nofollow ?? null, is_button ?? null]
    );
    return sendJSON(201, { success: true, data: result.rows[0] });
  }

  return sendJSON(400, { error: 'Unknown sub-resource' });
};

const handleSubResourcePut = async (client: Client, subResource: string, id: number | null, body: string | null) => {
  if (!id) return sendJSON(400, { error: 'ID required' });
  if (!body) return sendJSON(400, { error: 'Request body required' });
  const data = JSON.parse(body);

  if (subResource === 'footer-link-groups') {
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;
    if (data.title !== undefined) { updates.push(`title = $${idx++}`); values.push(data.title); }
    if (data.sort_order !== undefined) { updates.push(`sort_order = $${idx++}`); values.push(data.sort_order); }
    if (updates.length === 0) return sendJSON(400, { error: 'No fields to update' });
    values.push(id);
    const result = await client.query(`UPDATE footer_link_groups SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    return sendJSON(200, { success: true, data: result.rows[0] });
  }

  if (subResource === 'footer-links') {
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;
    if (data.label !== undefined) { updates.push(`label = $${idx++}`); values.push(data.label); }
    if (data.href !== undefined) { updates.push(`href = $${idx++}`); values.push(data.href); }
    if (data.sort_order !== undefined) { updates.push(`sort_order = $${idx++}`); values.push(data.sort_order); }
    if (updates.length === 0) return sendJSON(400, { error: 'No fields to update' });
    values.push(id);
    const result = await client.query(`UPDATE footer_links SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    return sendJSON(200, { success: true, data: result.rows[0] });
  }

  if (subResource === 'navigation-items') {
    const updates: string[] = [];
    const values: any[] = [];
    let idx = 1;
    if (data.label !== undefined) { updates.push(`label = $${idx++}`); values.push(data.label); }
    if (data.href !== undefined) { updates.push(`href = $${idx++}`); values.push(data.href); }
    if (data.sort_order !== undefined) { updates.push(`sort_order = $${idx++}`); values.push(data.sort_order); }
    if (data.type !== undefined) { updates.push(`type = $${idx++}`); values.push(data.type); }
    if (data.is_external !== undefined) { updates.push(`is_external = $${idx++}`); values.push(data.is_external); }
    if (data.nofollow !== undefined) { updates.push(`nofollow = $${idx++}`); values.push(data.nofollow); }
    if (data.is_button !== undefined) { updates.push(`is_button = $${idx++}`); values.push(data.is_button); }
    if (updates.length === 0) return sendJSON(400, { error: 'No fields to update' });
    values.push(id);
    const result = await client.query(`UPDATE navigation_items SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`, values);
    return sendJSON(200, { success: true, data: result.rows[0] });
  }

  return sendJSON(400, { error: 'Unknown sub-resource' });
};

const handleSubResourceDelete = async (client: Client, subResource: string, id: number | null) => {
  if (!id) return sendJSON(400, { error: 'ID required' });
  const table = subResource === 'footer-link-groups' ? 'footer_link_groups'
               : subResource === 'footer-links' ? 'footer_links'
               : subResource === 'navigation-items' ? 'navigation_items'
               : null;
  if (!table) return sendJSON(400, { error: 'Unknown sub-resource' });
  const result = await client.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
  if (result.rows.length === 0) return sendJSON(404, { error: 'Not found' });
  return sendJSON(200, { success: true, message: 'Deleted successfully' });
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
      section.features = features.rows.map((row: any) => ({
        ...row,
        badges: Array.isArray(row.badges) ? row.badges : (row.badges ? row.badges : [])
      }));
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

    return sendJSON(200, {
      success: true,
      data: section
    }, {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
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
        section.features = features.rows.map((row: any) => ({
          ...row,
          badges: Array.isArray(row.badges) ? row.badges : (row.badges ? row.badges : [])
        }));
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
        `INSERT INTO features (section_id, icon, title, description, badge, badge_color, badges, sort_order, is_featured, button_text, button_link)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [parentId, data.feature.icon, data.feature.title, data.feature.description,
         data.feature.badge, data.feature.badge_color, data.feature.badges ? JSON.stringify(data.feature.badges) : null,
         data.feature.sort_order || 0,
         data.feature.is_featured || false, data.feature.button_text || null, data.feature.button_link || null]
      );

    return sendJSON(201, {
      success: true,
      data: result.rows[0]
    });
    } else if (data.plan) {
      // Create pricing plan
      const result = await client.query(
        `INSERT INTO pricing_plans (section_id, name, price, period, description, features, button_text, button_link, is_popular, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [parentId, data.plan.name, data.plan.price, data.plan.period, data.plan.description,
         JSON.stringify(data.plan.features), data.plan.button_text, data.plan.button_link, data.plan.is_popular, data.plan.sort_order || 0]
      );

    return sendJSON(201, {
      success: true,
      data: result.rows[0]
    });
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
    return sendJSON(400, { error: 'Invalid section ID' });
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
    return sendJSON(400, { error: 'Invalid section ID' });
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