import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Client } from 'pg';
import { withCors, createDbClient, sendJSON, handleError, isAuthorized } from './utils';

const initializeTables = async (client: Client) => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS pages (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(150) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      content JSONB NOT NULL DEFAULT '{}',
      is_published BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await client.query('CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);');
};

const pagesHandler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const client = createDbClient();

  try {
    await client.connect();
    await initializeTables(client);

    const pathParts = event.path.split('/').filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1];
    const maybeId = parseInt(lastPart, 10);
    const id = isNaN(maybeId) ? null : maybeId;
    const slug = isNaN(maybeId) ? lastPart : null;

    if (event.httpMethod === 'OPTIONS') return sendJSON(200, '');

    switch (event.httpMethod) {
      case 'GET':
        return await handleGet(client, id, slug, event.queryStringParameters);
      case 'POST':
        if (!isAuthorized(event)) return sendJSON(401, { error: 'Unauthorized' });
        return await handlePost(client, event.body);
      case 'PUT':
        if (!isAuthorized(event)) return sendJSON(401, { error: 'Unauthorized' });
        return await handlePut(client, id, event.body);
      case 'DELETE':
        if (!isAuthorized(event)) return sendJSON(401, { error: 'Unauthorized' });
        return await handleDelete(client, id);
      default:
        return sendJSON(405, { error: 'Method not allowed' });
    }
  } catch (error) {
    return handleError(error, 'Pages');
  } finally {
    await client.end();
  }
};

const handleGet = async (client: Client, id: number | null, slug: string | null, qs: any | null) => {
  if (id || slug) {
    const field = id ? 'id' : 'slug';
    const value = id ?? slug;
    const result = await client.query(`SELECT * FROM pages WHERE ${field} = $1`, [value]);
    if (result.rows.length === 0) return sendJSON(404, { error: 'Page not found' });
    return sendJSON(200, { success: true, data: result.rows[0] });
  }

  const onlyPublished = (qs?.published ?? '').toString() === 'true';
  const result = await client.query(
    onlyPublished ? 'SELECT * FROM pages WHERE is_published = true ORDER BY updated_at DESC' : 'SELECT * FROM pages ORDER BY updated_at DESC'
  );
  return sendJSON(200, { success: true, data: result.rows });
};

const handlePost = async (client: Client, body: string | null) => {
  if (!body) return sendJSON(400, { error: 'Request body required' });
  const data = JSON.parse(body);
  const { slug, title, content = {}, is_published = false } = data;
  if (!slug || !title) return sendJSON(400, { error: 'slug and title are required' });
  const result = await client.query(
    `INSERT INTO pages (slug, title, content, is_published)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [slug, title, JSON.stringify(content), is_published]
  );
  return sendJSON(201, { success: true, data: result.rows[0] });
};

const handlePut = async (client: Client, id: number | null, body: string | null) => {
  if (!id) return sendJSON(400, { error: 'ID required' });
  if (!body) return sendJSON(400, { error: 'Request body required' });
  const data = JSON.parse(body);

  const updates: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (data.slug !== undefined) { updates.push(`slug = $${idx++}`); values.push(data.slug); }
  if (data.title !== undefined) { updates.push(`title = $${idx++}`); values.push(data.title); }
  if (data.content !== undefined) { updates.push(`content = $${idx++}`); values.push(JSON.stringify(data.content)); }
  if (data.is_published !== undefined) { updates.push(`is_published = $${idx++}`); values.push(data.is_published); }
  updates.push('updated_at = CURRENT_TIMESTAMP');

  values.push(id);
  const result = await client.query(
    `UPDATE pages SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
    values
  );
  if (result.rows.length === 0) return sendJSON(404, { error: 'Page not found' });
  return sendJSON(200, { success: true, data: result.rows[0] });
};

const handleDelete = async (client: Client, id: number | null) => {
  if (!id) return sendJSON(400, { error: 'ID required' });
  const result = await client.query('DELETE FROM pages WHERE id = $1 RETURNING *', [id]);
  if (result.rows.length === 0) return sendJSON(404, { error: 'Page not found' });
  return sendJSON(200, { success: true, message: 'Deleted successfully' });
};

export const handler = withCors(pagesHandler);


