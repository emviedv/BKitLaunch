import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Client } from 'pg';
import { withCors, createDbClient, sendJSON, handleError, isAuthorized } from './utils';

const llmContentHandler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  // Protect mutating routes – allow GET for public consumption
  if (['POST', 'PUT', 'DELETE'].includes(event.httpMethod)) {
    if (!isAuthorized(event)) {
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
        if (!event.body) return sendJSON(400, { error: 'Body required' });
        const payload = JSON.parse(event.body);

        // Extract and validate fields (accept camelCase input for convenience)
        const title: unknown = payload.title;
        const answerBox: unknown = payload.answerBox ?? payload.answer_box ?? null;
        const expertQuote: unknown = payload.expertQuote ?? payload.expert_quote ?? null;
        const statistic: unknown = payload.statistic ?? null;
        const faqs: unknown = payload.faqs ?? null;
        const content: unknown = payload.content ?? null;
        const lastUpdated: unknown = payload.lastUpdated ?? payload.last_updated ?? null;
        const citationCount: unknown = payload.citationCount ?? payload.citation_count ?? 0;
        const tokenCount: unknown = payload.tokenCount ?? payload.token_count ?? null;

        if (typeof title !== 'string' || title.trim().length === 0) {
          return sendJSON(400, { error: 'Title required' });
        }

        // Basic type checks
        if (citationCount !== null && citationCount !== undefined && Number.isNaN(Number(citationCount))) {
          return sendJSON(400, { error: 'citationCount must be a number' });
        }
        if (tokenCount !== null && tokenCount !== undefined && Number.isNaN(Number(tokenCount))) {
          return sendJSON(400, { error: 'tokenCount must be a number' });
        }
        if (lastUpdated && typeof lastUpdated === 'string') {
          const d = new Date(lastUpdated);
          if (Number.isNaN(d.getTime())) {
            return sendJSON(400, { error: 'lastUpdated must be an ISO date string' });
          }
        }

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
            citationCount ?? 0,
            tokenCount,
          ],
        );
        return sendJSON(201, insert.rows[0]);
      }

      // ────────────────────────────── UPDATE ─────────────────────────────────────
      case 'PUT': {
        const id = event.path.split('/').pop(); // Expecting /.netlify/functions/llm-content/{id}
        if (!id) return sendJSON(400, { error: 'ID path param required' });
        if (!event.body) return sendJSON(400, { error: 'Body required' });
        const updatePayload = JSON.parse(event.body);

        // Whitelist allowed fields and accept camelCase input, mapping to DB columns
        const allowedMap: Record<string, { column: string; transform?: (v: any) => any; validate?: (v: any) => string | null }> = {
          title: { column: 'title', validate: (v) => (typeof v === 'string' ? null : 'title must be a string') },
          answerBox: { column: 'answer_box' },
          answer_box: { column: 'answer_box' },
          expertQuote: { column: 'expert_quote', transform: (v) => (v ? JSON.stringify(v) : null) },
          expert_quote: { column: 'expert_quote', transform: (v) => (v ? JSON.stringify(v) : null) },
          statistic: { column: 'statistic', transform: (v) => (v ? JSON.stringify(v) : null) },
          faqs: { column: 'faqs', transform: (v) => (v ? JSON.stringify(v) : null) },
          content: { column: 'content' },
          lastUpdated: {
            column: 'last_updated',
            validate: (v) => {
              if (v == null) return null;
              if (typeof v !== 'string') return 'lastUpdated must be an ISO date string';
              const d = new Date(v);
              return Number.isNaN(d.getTime()) ? 'lastUpdated must be an ISO date string' : null;
            },
          },
          last_updated: {
            column: 'last_updated',
            validate: (v) => {
              if (v == null) return null;
              if (typeof v !== 'string') return 'last_updated must be an ISO date string';
              const d = new Date(v);
              return Number.isNaN(d.getTime()) ? 'last_updated must be an ISO date string' : null;
            },
          },
          citationCount: {
            column: 'citation_count',
            validate: (v) => (v == null || !Number.isNaN(Number(v)) ? null : 'citationCount must be a number'),
          },
          citation_count: {
            column: 'citation_count',
            validate: (v) => (v == null || !Number.isNaN(Number(v)) ? null : 'citation_count must be a number'),
          },
          tokenCount: {
            column: 'token_count',
            validate: (v) => (v == null || !Number.isNaN(Number(v)) ? null : 'tokenCount must be a number'),
          },
          token_count: {
            column: 'token_count',
            validate: (v) => (v == null || !Number.isNaN(Number(v)) ? null : 'token_count must be a number'),
          },
        };

        const setFragments: string[] = [];
        const values: any[] = [];
        let idx = 1;
        const errors: string[] = [];

        for (const [key, rawValue] of Object.entries(updatePayload)) {
          const spec = allowedMap[key];
          if (!spec) continue; // silently ignore unknown keys
          if (spec.validate) {
            const err = spec.validate(rawValue);
            if (err) errors.push(err);
          }
          const value = spec.transform ? spec.transform(rawValue) : rawValue;
          setFragments.push(`${spec.column} = $${idx++}`);
          values.push(value);
        }

        if (errors.length > 0) {
          return sendJSON(400, { error: 'Validation failed', details: errors });
        }
        if (setFragments.length === 0) {
          return sendJSON(400, { error: 'No updatable fields provided' });
        }

        // Always bump updated_at
        setFragments.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);

        const updateSql = `UPDATE llm_content SET ${setFragments.join(', ')} WHERE id = $${idx} RETURNING *`;
        const updated = await client.query(updateSql, values);
        if (updated.rows.length === 0) return sendJSON(404, { error: 'Record not found' });
        return sendJSON(200, updated.rows[0]);
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
