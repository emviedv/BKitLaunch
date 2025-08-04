import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Client } from 'pg';
import { withCors, createDbClient, sendJSON, handleError, verifyToken } from './utils';

const llmContentHandler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  // Protect mutating routes – allow GET for public consumption
  if (['POST', 'PUT', 'DELETE'].includes(event.httpMethod)) {
    if (!verifyToken(event.headers.authorization)) {
      return sendJSON(401, { error: 'Unauthorized' });
    }
  }

  const client = createDbClient();

  try {
    await client.connect();

    // Ensure storage table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS llm_content (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        answer_box TEXT,
        expert_quote JSONB,
        statistic JSONB,
        faqs JSONB,
        content TEXT,
        last_updated DATE,
        citation_count INTEGER DEFAULT 0,
        token_count INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    switch (event.httpMethod) {
      // ────────────────────────────── GET ALL / SINGLE ───────────────────────────
      case 'GET': {
        const id = event.queryStringParameters?.id;
        if (id) {
          const res = await client.query('SELECT * FROM llm_content WHERE id = $1', [id]);
          return sendJSON(200, res.rows[0] || null);
        }
        const res = await client.query('SELECT * FROM llm_content ORDER BY created_at DESC');
        return sendJSON(200, res.rows);
      }

      // ────────────────────────────── CREATE ─────────────────────────────────────
      case 'POST': {
        if (!event.body) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Body required' }) };
        const {
          title,
          answerBox,
          expertQuote,
          statistic,
          faqs,
          content,
          lastUpdated,
          citationCount = 0,
          tokenCount,
        } = JSON.parse(event.body);

        if (!title) return sendJSON(400, { error: 'Title required' });

        const insert = await client.query(
          `INSERT INTO llm_content (title, answer_box, expert_quote, statistic, faqs, content, last_updated, citation_count, token_count)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
          [
            title,
            answerBox,
            expertQuote ? JSON.stringify(expertQuote) : null,
            statistic ? JSON.stringify(statistic) : null,
            faqs ? JSON.stringify(faqs) : null,
            content,
            lastUpdated,
            citationCount,
            tokenCount,
          ],
        );
        return sendJSON(201, insert.rows[0]);
      }

      // ────────────────────────────── UPDATE ─────────────────────────────────────
      case 'PUT': {
        const id = event.path.split('/').pop(); // Expecting /.netlify/functions/llm-content/{id}
        if (!id) return sendJSON(400, { error: 'ID path param required' });
        if (!event.body) return { statusCode: 400, headers, body: JSON.stringify({ error: 'Body required' }) };
        const updatePayload = JSON.parse(event.body);

        // Build dynamic set clause
        const keys = Object.keys(updatePayload);
        if (keys.length === 0) return { statusCode: 400, headers, body: JSON.stringify({ error: 'No fields provided' }) };
        const setFragments = keys.map((k, idx) => `${k} = $${idx + 1}`);
        const values = keys.map((k) => {
          const v = updatePayload[k];
          if (typeof v === 'object') return JSON.stringify(v);
          return v;
        });
        values.push(id);
        await client.query(`UPDATE llm_content SET ${setFragments.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length}`, values);
        const res = await client.query('SELECT * FROM llm_content WHERE id = $1', [id]);
        return { statusCode: 200, headers, body: JSON.stringify(res.rows[0]) };
      }

      default:
        return sendJSON(405, { error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('LLM content function error', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }) };
  } finally {
    await client.end();
  }
};

export const handler = withCors(llmContentHandler);
