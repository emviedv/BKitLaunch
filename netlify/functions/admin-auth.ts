import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { withCors, sendJSON, handleError, signJwt, buildAuthCookie, createDbClient } from './utils';

const adminAuthHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return sendJSON(405, { error: 'Method not allowed' });
  }

  try {
    const client = createDbClient();
    await client.connect();
    const getIp = (headers: Record<string, string | undefined>): string =>
      (headers['x-forwarded-for'] || headers['X-Forwarded-For'] || headers['x-real-ip'] || '').toString().split(',')[0].trim();
    const reqIp = getIp(event.headers as any) || 'unknown';
    const ipSecret = process.env.IP_HASH_SECRET;
    if (!ipSecret) {
      return sendJSON(500, { error: 'Server configuration error' });
    }
    const ipHash = reqIp !== 'unknown' ? require('crypto').createHmac('sha256', ipSecret).update(reqIp).digest('hex') : null;
    if (!event.body) {
      return sendJSON(400, { error: 'Request body required' });
    }

    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return sendJSON(400, { error: 'Email and password are required' });
    }

    // Simple IP-based rate limit: max 10 attempts per 10 minutes per IP
    if (ipHash) {
      await client.query(`CREATE TABLE IF NOT EXISTS admin_login_attempts (
        id SERIAL PRIMARY KEY,
        ip_hash VARCHAR(128),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);
      const { rows } = await client.query(
        `SELECT COUNT(*)::int AS cnt FROM admin_login_attempts WHERE ip_hash = $1 AND created_at > NOW() - INTERVAL '10 minutes'`,
        [ipHash]
      );
      if ((rows[0]?.cnt ?? 0) >= 10) {
        await client.end();
        return sendJSON(429, { error: 'Too many attempts. Please try again later.' });
      }
    }

    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error('Admin credentials not configured in environment variables');
      console.log('Please set ADMIN_EMAIL and ADMIN_PASSWORD in your Netlify environment variables');
      return sendJSON(500, { 
        error: 'Server configuration error',
        details: 'Admin credentials not configured. Please check environment variables.' 
      });
    }

    // Verify credentials
    const ok = email === adminEmail && password === adminPassword;
    // Record attempt (success/fail)
    if (ipHash) {
      try { await client.query(`INSERT INTO admin_login_attempts (ip_hash) VALUES ($1)`, [ipHash]); } catch {}
    }
    if (ok) {
      // Issue JWT and set HttpOnly cookie
      const token = signJwt({ sub: email, role: 'admin' }, 60 * 60);
      const isHttps = (process.env.URL || '').startsWith('https://');
      const cookie = buildAuthCookie(token, isHttps);

      const res = {
        statusCode: 200,
        headers: {
          'Set-Cookie': cookie,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ success: true, message: 'Authentication successful' }),
      };
      await client.end();
      return res;
    } else {
      await client.end();
      return sendJSON(401, { 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

  } catch (error) {
    return handleError(error, 'Admin auth');
  }
};

export const handler = withCors(adminAuthHandler); 