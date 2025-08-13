import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Client } from 'pg';
import { withCors, createDbClient, sendJSON, handleError } from './utils';

const dbTablesHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'GET') {
    return sendJSON(405, { error: 'Method not allowed' });
  }

  const client = createDbClient();

  try {
    await client.connect();
    
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    const tables = result.rows.map(row => row.table_name);
    
    return sendJSON(200, tables);
  } catch (error) {
    console.error('Failed to get tables:', error);
    return sendJSON(500, {
      error: error instanceof Error ? error.message : 'Unknown database error'
    });
  } finally {
    await client.end();
  }
};

export const handler = withCors(dbTablesHandler); 