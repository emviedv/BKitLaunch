import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Client } from 'pg';
import crypto from 'crypto';

// Standard CORS headers used across all functions (origin set dynamically in wrapper)
const CORS_HEADERS = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

// Resolve whether an incoming Origin is allowed
const getAllowedOrigin = (originHeader?: string | null): string | undefined => {
  if (!originHeader) return undefined;

  // Comma-separated list, e.g. https://bibliokit.com,https://app.bibliokit.com
  const envList = process.env.ALLOWED_ORIGINS || '';
  const allowedFromEnv = envList
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Always allow localhost during development
  const devOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:9989',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5175',
    'http://127.0.0.1:9989',
  ];

  const allowed = new Set<string>([...allowedFromEnv, ...devOrigins]);
  return allowed.has(originHeader) ? originHeader : undefined;
};

/**
 * Creates a PostgreSQL client with standard connection settings
 * @returns Configured PostgreSQL client
 */
export const createDbClient = (): Client => {
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
};

// ──────────────────────────────────────────────────────────────────────────────
// JWT utilities (HS256) without external deps
// ──────────────────────────────────────────────────────────────────────────────
type JwtPayload = Record<string, any> & { exp?: number; iat?: number };

const base64url = (input: Buffer | string): string => {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  const isProd = (process.env.URL || '').startsWith('https://') || process.env.NODE_ENV === 'production';
  if (secret && secret.length >= 32) return secret; // require stronger length
  if (isProd) {
    throw new Error('JWT_SECRET is missing or too short in production');
  }
  console.warn('[Auth] JWT_SECRET not set or too short; using insecure dev secret.');
  return 'dev-insecure-secret-change-me';
};

export const signJwt = (payload: JwtPayload, expiresInSeconds: number = 3600): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = { ...payload, iat: now, exp: now + expiresInSeconds };
  const headerPart = base64url(JSON.stringify(header));
  const payloadPart = base64url(JSON.stringify(fullPayload));
  const data = `${headerPart}.${payloadPart}`;
  const signature = crypto.createHmac('sha256', getJwtSecret()).update(data).digest('base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${data}.${signature}`;
};

export const verifyJwt = (token: string): JwtPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerPart, payloadPart, signature] = parts;
    const data = `${headerPart}.${payloadPart}`;
    const expected = crypto.createHmac('sha256', getJwtSecret()).update(data).digest('base64')
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    if (signature !== expected) return null;
    const payload = JSON.parse(Buffer.from(payloadPart, 'base64').toString('utf8')) as JwtPayload;
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// Cookie utilities and auth helpers
// ──────────────────────────────────────────────────────────────────────────────
const parseCookies = (cookieHeader?: string): Record<string, string> => {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce((acc, part) => {
    const [k, ...v] = part.trim().split('=');
    if (k) acc[k] = decodeURIComponent(v.join('='));
    return acc;
  }, {} as Record<string, string>);
};

const getAuthCookieName = () => process.env.ADMIN_COOKIE_NAME || 'BIBLIOKIT_ADMIN';

export const getAuthClaimsFromEvent = (event: HandlerEvent): JwtPayload | null => {
  // 1) Try cookie-based JWT
  const cookies = parseCookies(event.headers?.cookie || event.headers?.Cookie || event.headers?.COOKIE);
  const cookieToken = cookies[getAuthCookieName()];
  if (cookieToken) {
    const claims = verifyJwt(cookieToken);
    if (claims) return claims;
  }

  // 2) Optional Fallback to Bearer for tooling/backward-compat (disabled by default)
  const allowBearer = (process.env.ADMIN_ALLOW_BEARER || 'false').toLowerCase() === 'true';
  if (allowBearer) {
    const authHeader = event.headers?.authorization || (event.headers?.Authorization as string | undefined);
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const bearerToken = authHeader.substring(7);
      if (bearerToken.split('.').length === 3) {
        const claims = verifyJwt(bearerToken);
        if (claims) return claims;
        return null;
      }
      return bearerToken.length > 10 ? { sub: 'legacy', method: 'bearer-legacy' } : null;
    }
  }

  return null;
};

export const isAuthorized = (event: HandlerEvent): boolean => {
  return !!getAuthClaimsFromEvent(event);
};

export const buildAuthCookie = (token: string, https: boolean): string => {
  const parts = [
    `${getAuthCookieName()}=${token}`,
    'Path=/',
    'HttpOnly',
    // SameSite=Strict to avoid cross-site; adjust later if cross-site admin needed
    'SameSite=Strict',
  ];
  if (https) parts.push('Secure');
  return parts.join('; ');
};

export const clearAuthCookie = (https: boolean): string => {
  const parts = [
    `${getAuthCookieName()}=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
  ];
  if (https) parts[0] += '; Secure';
  return parts[0];
};
/**
 * Sends a standardized JSON response with CORS headers
 * @param statusCode HTTP status code
 * @param payload Data to send in response body
 * @param customHeaders Optional additional headers
 * @returns Netlify function response object
 */
export const sendJSON = (
  statusCode: number, 
  payload: any, 
  customHeaders?: Record<string, string>
) => {
  return {
    statusCode,
    headers: {
      ...CORS_HEADERS,
      // Default to no-store for APIs unless overridden explicitly
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...customHeaders
    },
    body: JSON.stringify(payload),
  };
};

/**
 * Handles errors by logging server-side details and returning generic client response
 * @param error The error that occurred
 * @param context Optional context for logging
 * @returns Standardized error response
 */
export const handleError = (error: any, context?: string) => {
  const errorMsg = context ? `${context} error:` : 'Server error:';
  console.error(errorMsg, error);
  
  return sendJSON(500, {
    success: false,
    error: 'Internal server error'
  });
};

/**
 * Higher-order function that wraps a handler with CORS support
 * Automatically handles OPTIONS preflight requests
 * @param handler The actual function handler
 * @returns Wrapped handler with CORS support
 */
export const withCors = (handler: Handler): Handler => {
  return async (event: HandlerEvent, context: HandlerContext) => {
    const requestOrigin = event.headers?.origin || event.headers?.Origin || event.headers?.ORIGIN;
    const allowedOrigin = getAllowedOrigin(requestOrigin);

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      const base = sendJSON(200, '');
      return {
        ...base,
        headers: {
          ...base.headers,
          ...(allowedOrigin ? { 'Access-Control-Allow-Origin': allowedOrigin } : {}),
          // Allow credentials to support cookie-based auth in the future
          'Access-Control-Allow-Credentials': 'true',
          // Ensure caches/proxies differentiate by Origin
          'Vary': 'Origin',
        },
      };
    }

    // Call the actual handler
    const response = await handler(event, context);
    return {
      ...response,
      headers: {
        ...(response?.headers || {}),
        ...(allowedOrigin ? { 'Access-Control-Allow-Origin': allowedOrigin } : {}),
        'Access-Control-Allow-Credentials': 'true',
        // Ensure caches/proxies differentiate by Origin
        'Vary': 'Origin',
      },
    };
  };
};

/**
 * Simple token verification utility
 * @param authHeader Authorization header value
 * @returns true if token is valid
 */
export const verifyToken = (authHeader: string | undefined): boolean => {
  // Backward-compat helper used by some handlers; prefer isAuthorized(event)
  if (!authHeader) return false;
  if (authHeader.startsWith('Bearer ')) {
    const t = authHeader.substring(7);
    if (t.split('.').length === 3) return !!verifyJwt(t);
    return t.length > 10;
  }
  return false;
};