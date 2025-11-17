import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { withCors, createDbClient, sendJSON, handleError } from './utils';
import crypto from 'crypto';

/**
 * Public waitlist signup endpoint
 * - Accepts unauthenticated POSTs from the site UI
 * - Validates email and applies simple rate limiting by IP hash
 * - Stores signups in a dedicated table `waitlist_signups`
 * - Returns success even for duplicate emails to avoid leaking user presence
 */
const waitlistHandler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const client = createDbClient();

  try {
    await client.connect();

    // Ensure table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS waitlist_signups (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        source VARCHAR(100),
        ip_hash VARCHAR(128),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    if (event.httpMethod === 'OPTIONS') {
      return sendJSON(200, '');
    }

    if (event.httpMethod !== 'POST') {
      return sendJSON(405, { error: 'Method not allowed' });
    }

    if (!event.body) {
      return sendJSON(400, { error: 'Request body required' });
    }

    const { email, name, source } = JSON.parse(event.body || '{}') as { email?: string; name?: string; source?: string };
    if (!email) {
      return sendJSON(400, { error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendJSON(400, { error: 'Invalid email format' });
    }

    // Basic rate limit by IP hash: max 3 signups per hour per IP
    const ipRaw = (event.headers['x-forwarded-for'] || event.headers['X-Forwarded-For'] || '').toString().split(',')[0].trim();
    const ua = (event.headers['user-agent'] || event.headers['User-Agent'] || '').toString();
    const ipSecret = process.env.IP_HASH_SECRET;
    if (!ipSecret) {
      // Fail fast if secret is not configured (only for POST to avoid leaking info)
      return sendJSON(500, { error: 'Server configuration error' });
    }
    const ipHash = ipRaw ? crypto.createHmac('sha256', ipSecret).update(ipRaw).digest('hex') : undefined;

    if (ipHash) {
      const rateResult = await client.query(
        `SELECT COUNT(*)::int AS cnt FROM waitlist_signups WHERE ip_hash = $1 AND created_at > NOW() - INTERVAL '1 hour'`,
        [ipHash]
      );
      const recentCount = rateResult.rows[0]?.cnt ?? 0;
      if (recentCount >= 3) {
        return sendJSON(429, { error: 'Too many requests. Please try again later.' });
      }
    }

    // Try insert; if duplicate, respond success to avoid enumeration
    try {
      await client.query(
        `INSERT INTO waitlist_signups (email, name, source, ip_hash, user_agent) VALUES ($1, $2, $3, $4, $5)`,
        [email.toLowerCase(), name || null, source || 'website', ipHash || null, ua]
      );
    } catch (dbError: any) {
      if (dbError?.code === '23505') {
        // Unique violation (email). Treat as success (already on waitlist)
        return sendJSON(200, { success: true, message: 'You are already on the waitlist' });
      }
      throw dbError;
    }

    return sendJSON(201, { success: true, message: 'Successfully joined waitlist' });
  } catch (error) {
    return handleError(error, 'Waitlist signup');
  } finally {
    await client.end();
  }
};

export const handler = withCors(waitlistHandler);

