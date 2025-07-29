import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Client } from 'pg';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
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

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  const client = createDbClient();

  try {
    await client.connect();

    // Ensure users table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    switch (event.httpMethod) {
      case 'GET':
        // Get all users
        const result = await client.query('SELECT * FROM users ORDER BY created_at DESC');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result.rows),
        };

      case 'POST':
        // Create new user
        if (!event.body) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Request body required' }),
          };
        }

        const { email, name } = JSON.parse(event.body);
        
        if (!email || !name) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Email and name are required' }),
          };
        }

        const insertResult = await client.query(
          'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *',
          [email, name]
        );

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(insertResult.rows[0]),
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Database operation failed:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown database error'
      }),
    };
  } finally {
    await client.end();
  }
};

export { handler }; 