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
    const planId = pathParts[pathParts.length - 1];

    switch (event.httpMethod) {
      case 'GET':
        return await handleGet(client, planId);

      case 'POST':
        return await handlePost(client, event.body);

      case 'PUT':
        return await handlePut(client, event.body, planId);

      case 'DELETE':
        return await handleDelete(client, planId);

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Pricing plans error:', error);
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

const handleGet = async (client: Client, planId: string) => {
  if (planId && planId !== 'pricing-plans') {
    const result = await client.query(
      'SELECT * FROM pricing_plans WHERE id = $1',
      [planId]
    );

    if (result.rows.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Pricing plan not found' }),
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
      'SELECT * FROM pricing_plans ORDER BY sort_order ASC'
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

  const { 
    section_id, 
    name, 
    price, 
    period, 
    description, 
    features, 
    button_text, 
    is_popular = false, 
    sort_order = 0 
  } = JSON.parse(body);

  if (!section_id || !name || !price || !button_text || !features) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ 
        error: 'section_id, name, price, button_text, and features are required' 
      }),
    };
  }

  const result = await client.query(
    `INSERT INTO pricing_plans (section_id, name, price, period, description, features, button_text, is_popular, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [section_id, name, price, period, description, JSON.stringify(features), button_text, is_popular, sort_order]
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

const handlePut = async (client: Client, body: string | null, planId: string) => {
  if (!body) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Request body required' }),
    };
  }

  const id = parseInt(planId);
  if (isNaN(id)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid pricing plan ID' }),
    };
  }

  const { name, price, period, description, features, button_text, is_popular, sort_order } = JSON.parse(body);
  const updates: string[] = [];
  const values: any[] = [];
  let valueIndex = 1;

  if (name !== undefined) {
    updates.push(`name = $${valueIndex++}`);
    values.push(name);
  }

  if (price !== undefined) {
    updates.push(`price = $${valueIndex++}`);
    values.push(price);
  }

  if (period !== undefined) {
    updates.push(`period = $${valueIndex++}`);
    values.push(period);
  }

  if (description !== undefined) {
    updates.push(`description = $${valueIndex++}`);
    values.push(description);
  }

  if (features !== undefined) {
    updates.push(`features = $${valueIndex++}`);
    values.push(JSON.stringify(features));
  }

  if (button_text !== undefined) {
    updates.push(`button_text = $${valueIndex++}`);
    values.push(button_text);
  }

  if (is_popular !== undefined) {
    updates.push(`is_popular = $${valueIndex++}`);
    values.push(is_popular);
  }

  if (sort_order !== undefined) {
    updates.push(`sort_order = $${valueIndex++}`);
    values.push(sort_order);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const result = await client.query(
    `UPDATE pricing_plans SET ${updates.join(', ')} WHERE id = $${valueIndex} RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Pricing plan not found' }),
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

const handleDelete = async (client: Client, planId: string) => {
  const id = parseInt(planId);
  if (isNaN(id)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid pricing plan ID' }),
    };
  }

  const result = await client.query(
    'DELETE FROM pricing_plans WHERE id = $1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Pricing plan not found' }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: 'Pricing plan deleted successfully'
    }),
  };
};

export { handler };