import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { Client } from 'pg';

// Standard CORS headers used across all functions
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json',
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
    headers: { ...CORS_HEADERS, ...customHeaders },
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
    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
      return sendJSON(200, '');
    }

    // Call the actual handler
    return handler(event, context);
  };
};

/**
 * Simple token verification utility
 * @param authHeader Authorization header value
 * @returns true if token is valid
 */
export const verifyToken = (authHeader: string | undefined): boolean => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  // In a simple implementation, we just check if token exists
  // In production, verify JWT or use proper token validation
  return token.length > 10;
};