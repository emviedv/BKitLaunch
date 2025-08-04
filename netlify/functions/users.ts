import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { withCors, createDbClient, sendJSON, handleError } from './utils';

const usersHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
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
        return sendJSON(200, result.rows);

      case 'POST':
        // Create new user
        if (!event.body) {
          return sendJSON(400, { error: 'Request body required' });
        }

        const { email, name } = JSON.parse(event.body);
        
        if (!email || !name) {
          return sendJSON(400, { error: 'Email and name are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return sendJSON(400, { error: 'Invalid email format' });
        }

        try {
          const insertResult = await client.query(
            'INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *',
            [email, name]
          );

          return sendJSON(201, insertResult.rows[0]);
        } catch (dbError: any) {
          // Handle duplicate email error gracefully
          if (dbError.code === '23505' && dbError.constraint === 'users_email_key') {
            return sendJSON(409, { error: 'Email already registered' });
          }
          throw dbError;
        }

      default:
        return sendJSON(405, { error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database operation failed:', error);
    
    return sendJSON(500, {
      error: error instanceof Error ? error.message : 'Unknown database error'
    });
  } finally {
    await client.end();
  }
};

export const handler = withCors(usersHandler); 