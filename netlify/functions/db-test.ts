import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Client } from 'pg';
import { withCors, createDbClient, sendJSON, handleError } from './utils';

const dbTestHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Use shared CORS via withCors wrapper; only set content-type here
  const headers = {
    'Content-Type': 'application/json',
  };

  // Handle preflight OPTIONS request via standard helper
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    
    // Test query
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        connected: true,
        timestamp: result.rows[0].current_time,
        version: result.rows[0].version,
        message: 'Database connection successful'
      }),
    };
  } catch (error) {
    console.error('Database connection failed:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown database error'
      }),
    };
  } finally {
    await client.end();
  }
};

export const handler = withCors(dbTestHandler); 