import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Client } from 'pg';
import { withCors, createDbClient, sendJSON, handleError, isAuthorized } from './utils';

const ensureFeaturesTable = async (client: Client) => {
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
};

const featuresHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
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
    await ensureFeaturesTable(client);

    const pathParts = event.path.split('/').filter(part => part);
    const featureId = pathParts[pathParts.length - 1];

    switch (event.httpMethod) {
      case 'GET':
        return await handleGet(client, featureId);

      case 'POST':
        return await handlePost(client, event.body);

      case 'PUT':
        return await handlePut(client, event.body, featureId);

      case 'DELETE':
        return await handleDelete(client, featureId);

      default:
        return sendJSON(405, { error: 'Method not allowed' });
    }
  } catch (error) {
    return handleError(error, 'Features');
  } finally {
    await client.end();
  }
};

const handleGet = async (client: Client, featureId: string) => {
  if (featureId && featureId !== 'features') {
    const result = await client.query(
      'SELECT * FROM features WHERE id = $1',
      [featureId]
    );

    if (result.rows.length === 0) {
      return sendJSON(404, { error: 'Feature not found' });
    }

    return sendJSON(200, {
      success: true,
      data: result.rows[0]
    });
  } else {
    const result = await client.query(
      'SELECT * FROM features ORDER BY sort_order ASC'
    );

    return sendJSON(200, {
      success: true,
      data: result.rows
    });
  }
};

const handlePost = async (client: Client, body: string | null) => {
  if (!body) {
    return sendJSON(400, { error: 'Request body required' });
  }

  const { section_id, icon, title, description, badge, badge_color, badges, sort_order = 0, is_featured = false, button_text, button_link } = JSON.parse(body);

  if (!section_id || !icon || !title || !description) {
    return sendJSON(400, { error: 'section_id, icon, title, and description are required' });
  }

  const result = await client.query(
    `INSERT INTO features (section_id, icon, title, description, badge, badge_color, badges, sort_order, is_featured, button_text, button_link)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [section_id, icon, title, description, badge, badge_color, badges ? JSON.stringify(badges) : null, sort_order, is_featured, button_text, button_link]
  );

  return sendJSON(201, {
    success: true,
    data: result.rows[0]
  });
};

const handlePut = async (client: Client, body: string | null, featureId: string) => {
  if (!body) {
    return sendJSON(400, { error: 'Request body required' });
  }

  const id = parseInt(featureId);
  if (isNaN(id)) {
    return sendJSON(400, { error: 'Invalid feature ID' });
  }

  const { icon, title, description, badge, badge_color, badges, sort_order, is_featured, button_text, button_link } = JSON.parse(body);
  const updates: string[] = [];
  const values: any[] = [];
  let valueIndex = 1;

  if (icon !== undefined) {
    updates.push(`icon = $${valueIndex++}`);
    values.push(icon);
  }

  if (title !== undefined) {
    updates.push(`title = $${valueIndex++}`);
    values.push(title);
  }

  if (description !== undefined) {
    updates.push(`description = $${valueIndex++}`);
    values.push(description);
  }

  if (badge !== undefined) {
    updates.push(`badge = $${valueIndex++}`);
    values.push(badge);
  }

  if (badge_color !== undefined) {
    updates.push(`badge_color = $${valueIndex++}`);
    values.push(badge_color);
  }

  if (badges !== undefined) {
    updates.push(`badges = $${valueIndex++}`);
    values.push(badges ? JSON.stringify(badges) : null);
  }

  if (sort_order !== undefined) {
    updates.push(`sort_order = $${valueIndex++}`);
    values.push(sort_order);
  }

  if (is_featured !== undefined) {
    updates.push(`is_featured = $${valueIndex++}`);
    values.push(is_featured);
  }

  if (button_text !== undefined) {
    updates.push(`button_text = $${valueIndex++}`);
    values.push(button_text);
  }

  if (button_link !== undefined) {
    updates.push(`button_link = $${valueIndex++}`);
    values.push(button_link);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const result = await client.query(
    `UPDATE features SET ${updates.join(', ')} WHERE id = $${valueIndex} RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
      return sendJSON(404, { error: 'Feature not found' });
  }

      return sendJSON(200, {
      success: true,
      data: result.rows[0]
    });
};

const handleDelete = async (client: Client, featureId: string) => {
  const id = parseInt(featureId);
  if (isNaN(id)) {
    return sendJSON(400, { error: 'Invalid feature ID' });
  }

  const result = await client.query(
    'DELETE FROM features WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
      return sendJSON(404, { error: 'Feature not found' });
  }

  return sendJSON(200, {
    success: true,
    message: 'Feature deleted successfully'
  });
};

export const handler = withCors(featuresHandler);