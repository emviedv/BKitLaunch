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

const verifyToken = (authHeader: string | undefined): boolean => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  return token.length > 10;
};

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

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
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Features error:', error);
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

const handleGet = async (client: Client, featureId: string) => {
  if (featureId && featureId !== 'features') {
    const result = await client.query(
      'SELECT * FROM features WHERE id = $1',
      [featureId]
    );

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Feature not found' }),
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
  } else {
    const result = await client.query(
      'SELECT * FROM features ORDER BY sort_order ASC'
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

const handlePost = async (client: Client, body: string | null) => {
  if (!body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Request body required' }),
    };
  }

  const { section_id, icon, title, description, badge, badge_color, sort_order = 0 } = JSON.parse(body);

  if (!section_id || !icon || !title || !description) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'section_id, icon, title, and description are required' }),
    };
  }

  const result = await client.query(
    `INSERT INTO features (section_id, icon, title, description, badge, badge_color, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [section_id, icon, title, description, badge, badge_color, sort_order]
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

const handlePut = async (client: Client, body: string | null, featureId: string) => {
  if (!body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Request body required' }),
    };
  }

  const id = parseInt(featureId);
  if (isNaN(id)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid feature ID' }),
    };
  }

  const { icon, title, description, badge, badge_color, sort_order } = JSON.parse(body);
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

  if (sort_order !== undefined) {
    updates.push(`sort_order = $${valueIndex++}`);
    values.push(sort_order);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const result = await client.query(
    `UPDATE features SET ${updates.join(', ')} WHERE id = $${valueIndex} RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Feature not found' }),
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

const handleDelete = async (client: Client, featureId: string) => {
  const id = parseInt(featureId);
  if (isNaN(id)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid feature ID' }),
    };
  }

  const result = await client.query(
    'DELETE FROM features WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Feature not found' }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Feature deleted successfully'
    }),
  };
};

export { handler };