import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { withCors, sendJSON, handleError, signJwt, buildAuthCookie } from './utils';

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
      // Issue JWT and set HttpOnly cookie
      const token = signJwt({ sub: email, role: 'admin' }, 60 * 60);
      const isHttps = (process.env.URL || '').startsWith('https://');
      const cookie = buildAuthCookie(token, isHttps);

      return {
        statusCode: 200,
        headers: {
          'Set-Cookie': cookie,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ success: true, message: 'Authentication successful' }),
      };
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