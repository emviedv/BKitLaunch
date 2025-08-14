import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { withCors, sendJSON, handleError, signJwt, buildAuthCookie, createDbClient } from './utils';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

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
    const ipHash = reqIp !== 'unknown' ? crypto.createHmac('sha256', ipSecret).update(reqIp).digest('hex') : null;
    if (!event.body) {
      return sendJSON(400, { error: 'Request body required' });
    }

    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return sendJSON(400, { error: 'Email and password are required' });
    }

    // Normalize and hash identifier (email) for rate-limiting without storing PII
    const normalizeEmail = (e: string) => e.trim().toLowerCase();
    const emailNormalized = normalizeEmail(email);
    const identifierHash = crypto.createHmac('sha256', ipSecret).update(emailNormalized).digest('hex');

    // Ensure admin_login_attempts schema exists and is up to date
    await client.query(`CREATE TABLE IF NOT EXISTS admin_login_attempts (
      id SERIAL PRIMARY KEY,
      ip_hash VARCHAR(128),
      identifier_hash VARCHAR(128),
      success BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`);
    await client.query(`ALTER TABLE admin_login_attempts ADD COLUMN IF NOT EXISTS identifier_hash VARCHAR(128);`);
    await client.query(`ALTER TABLE admin_login_attempts ADD COLUMN IF NOT EXISTS success BOOLEAN DEFAULT false;`);

    // Rate limits: per-IP and per-identifier (email) in a 10-minute window
    const rlPerIp = parseInt(process.env.ADMIN_RATE_LIMIT_PER_IP || '10', 10);
    const rlPerId = parseInt(process.env.ADMIN_RATE_LIMIT_PER_ID || '7', 10);

    let ipAttempts = 0;
    let idAttempts = 0;
    if (ipHash) {
      const { rows } = await client.query(
        `SELECT COUNT(*)::int AS cnt FROM admin_login_attempts WHERE ip_hash = $1 AND created_at > NOW() - INTERVAL '10 minutes'`,
        [ipHash]
      );
      ipAttempts = rows[0]?.cnt ?? 0;
      if (ipAttempts >= rlPerIp) {
        await client.end();
        return sendJSON(429, { error: 'Too many attempts. Please try again later.' });
      }
    }
    {
      const { rows } = await client.query(
        `SELECT COUNT(*)::int AS cnt FROM admin_login_attempts WHERE identifier_hash = $1 AND created_at > NOW() - INTERVAL '10 minutes'`,
        [identifierHash]
      );
      idAttempts = rows[0]?.cnt ?? 0;
      if (idAttempts >= rlPerId) {
        await client.end();
        return sendJSON(429, { error: 'Too many attempts. Please try again later.' });
      }
    }

    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH; // bcrypt hash preferred
    const adminPassword = process.env.ADMIN_PASSWORD; // plaintext fallback only in non-prod

    // Verify credentials with constant-time checks and bcrypt
    const isProd = (process.env.URL || '').startsWith('https://') || process.env.NODE_ENV === 'production';

    if (!adminEmail || (isProd ? !adminPasswordHash : !(adminPasswordHash || adminPassword))) {
      console.error('Admin credentials not configured in environment variables');
      console.log('Please set ADMIN_EMAIL and ADMIN_PASSWORD_HASH (recommended) or ADMIN_PASSWORD (dev only).');
      return sendJSON(500, { 
        error: 'Server configuration error',
        details: 'Admin credentials not configured. Please set ADMIN_EMAIL and ADMIN_PASSWORD_HASH (recommended) or ADMIN_PASSWORD for development.' 
      });
    }

    // Constant-time email comparison via fixed-length SHA-256 digests
    const digest = (s: string) => crypto.createHash('sha256').update(s).digest();
    const providedEmailDigest = digest(emailNormalized);
    const adminEmailDigest = digest(normalizeEmail(adminEmail));
    const emailOk = crypto.timingSafeEqual(providedEmailDigest, adminEmailDigest);

    // Bcrypt compare for password; always perform a compare to equalize timing
    const FAKE_BCRYPT_HASH = '$2a$12$8e3i/2b0n86nB0yYM0eA9uFhxyh6oE0Gm2Qx3s5k1uIVo0iZg9Q1K'; // hash of "invalid-password"
    let passwordOk = false;
    if (adminPasswordHash) {
      try {
        passwordOk = await bcrypt.compare(password, adminPasswordHash);
      } catch {
        // fall through; keep passwordOk = false
      }
    } else {
      // For non-prod only, allow plaintext fallback but still burn time with a bcrypt compare
      if (!isProd && typeof adminPassword === 'string') {
        passwordOk = password === adminPassword;
      }
      try { await bcrypt.compare('invalid-password', FAKE_BCRYPT_HASH); } catch {}
    }

    const ok = emailOk && passwordOk;
    // Record attempt (success/fail)
    try {
      await client.query(
        `INSERT INTO admin_login_attempts (ip_hash, identifier_hash, success) VALUES ($1, $2, $3)`,
        [ipHash, identifierHash, ok]
      );
    } catch {}

    // On failure, add small tarpit delay to slow brute-force without hurting UX
    if (!ok) {
      const delay = 200 + Math.min(1000, (ipAttempts + idAttempts) * 100);
      await new Promise((r) => setTimeout(r, delay));
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