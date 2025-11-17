import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Client } from 'pg';

const BASE_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
};

const isLocalOrigin = (value?: string | null): boolean => {
  if (!value) return false;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost');
  } catch {
    return false;
  }
};

const resolveAllowedOrigin = (originHeader?: string | null): string | undefined => {
  if (!originHeader) return undefined;

  const allowedFromEnv = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  const devDefaults = [
    'http://localhost:5173',
    'http://localhost:53173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:53173',
  ];

  const allowed = new Set<string>([...allowedFromEnv, ...devDefaults]);

  if (allowed.has(originHeader)) {
    return originHeader;
  }

  if (isLocalOrigin(originHeader)) {
    return originHeader;
  }

  return undefined;
};

export const withCors = (handler: Handler): Handler => {
  return async (event: HandlerEvent, context: HandlerContext) => {
    const originHeader = event.headers?.origin || (event.headers as any)?.Origin;
    const origin = resolveAllowedOrigin(originHeader);
    const headers = origin
      ? { ...BASE_HEADERS, 'Access-Control-Allow-Origin': origin }
      : { ...BASE_HEADERS };

    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers, body: '' };
    }

    const response = await handler(event, context);
    return {
      ...response,
      headers: {
        ...headers,
        ...(response?.headers || {}),
      },
    };
  };
};

export const createDbClient = (): Client => {
  return new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
};

export const sendJSON = (statusCode: number, body: any, extraHeaders?: Record<string, string>) => {
  return {
    statusCode,
    headers: { ...BASE_HEADERS, ...(extraHeaders || {}) },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  };
};

export const handleError = (error: unknown, context: string) => {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(`[${context}]`, error);
  return sendJSON(500, { error: message });
};

