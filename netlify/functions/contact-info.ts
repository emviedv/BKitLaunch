import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Client } from 'pg';
import { withCors, createDbClient, sendJSON, handleError, isAuthorized } from './utils';

const initializeTables = async (client: Client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS contact_info (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      twitter VARCHAR(100),
      github VARCHAR(100),
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

const contactInfoHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only require auth for write operations
  if (['POST', 'PUT', 'DELETE'].includes(event.httpMethod) && !isAuthorized(event)) {
    return sendJSON(401, { error: 'Unauthorized' });
  }

  const client = createDbClient();

  try {
    await client.connect();
    await initializeTables(client);

    switch (event.httpMethod) {
      case 'GET':
        return await handleGet(client);

      case 'POST':
        return await handlePost(client, event.body);

      case 'PUT':
        return await handlePut(client, event.body);

      case 'DELETE':
        return await handleDelete(client);

      default:
        return sendJSON(405, { error: 'Method not allowed' });
    }
  } catch (error) {
    return handleError(error, 'Contact info');
  } finally {
    await client.end();
  }
};

const handleGet = async (client: Client) => {
  const result = await client.query(
    'SELECT * FROM contact_info ORDER BY id DESC LIMIT 1'
  );

  return sendJSON(200, {
    success: true,
    data: result.rows[0] || null
  });
};

const handlePost = async (client: Client, body: string | null) => {
  if (!body) {
    return sendJSON(400, { error: 'Request body required' });
  }

  const { email, twitter, github } = JSON.parse(body);

  if (!email) {
    return sendJSON(400, { error: 'Email is required' });
  }

  // Delete existing contact info (we only keep one record)
  await client.query('DELETE FROM contact_info');

  const result = await client.query(
    `INSERT INTO contact_info (email, twitter, github)
     VALUES ($1, $2, $3) RETURNING *`,
    [email, twitter, github]
  );

  return sendJSON(201, {
    success: true,
    data: result.rows[0]
  });
};

const handlePut = async (client: Client, body: string | null) => {
  if (!body) {
    return sendJSON(400, { error: 'Request body required' });
  }

  const { email, twitter, github } = JSON.parse(body);

  // Get the existing contact info
  const existing = await client.query('SELECT id FROM contact_info ORDER BY id DESC LIMIT 1');

  if (existing.rows.length === 0) {
    // No existing contact info, create new
    return await handlePost(client, body);
  }

  const updates: string[] = [];
  const values: any[] = [];
  let valueIndex = 1;

  if (email !== undefined) {
    updates.push(`email = $${valueIndex++}`);
    values.push(email);
  }

  if (twitter !== undefined) {
    updates.push(`twitter = $${valueIndex++}`);
    values.push(twitter);
  }

  if (github !== undefined) {
    updates.push(`github = $${valueIndex++}`);
    values.push(github);
  }

  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(existing.rows[0].id);

  const result = await client.query(
    `UPDATE contact_info SET ${updates.join(', ')} WHERE id = $${valueIndex} RETURNING *`,
    values
  );

  return sendJSON(200, {
    success: true,
    data: result.rows[0]
  });
};

const handleDelete = async (client: Client) => {
  const result = await client.query(
    'DELETE FROM contact_info RETURNING *'
  );

  return sendJSON(200, {
    success: true,
    message: 'Contact info deleted successfully',
    data: result.rows
  });
};

export const handler = withCors(contactInfoHandler);