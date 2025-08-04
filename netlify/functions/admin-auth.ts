import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import * as crypto from 'crypto';
import { withCors, sendJSON, handleError } from './utils';

// Simple token generation (in production, use JWT or similar)
const generateToken = (email: string): string => {
  const timestamp = Date.now();
  const data = `${email}:${timestamp}`;
  return Buffer.from(data).toString('base64');
};

const adminAuthHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return sendJSON(405, { error: 'Method not allowed' });
  }

  try {
    if (!event.body) {
      return sendJSON(400, { error: 'Request body required' });
    }

    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return sendJSON(400, { error: 'Email and password are required' });
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
    if (email === adminEmail && password === adminPassword) {
      const token = generateToken(email);
      
      return sendJSON(200, { 
        success: true, 
        token,
        message: 'Authentication successful'
      });
    } else {
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