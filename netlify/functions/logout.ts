import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { withCors, clearAuthCookie } from './utils';

const logoutHandler: Handler = async (_event: HandlerEvent, _context: HandlerContext) => {
  const isHttps = (process.env.URL || '').startsWith('https://');
  const cookie = clearAuthCookie(isHttps);
  return {
    statusCode: 200,
    headers: { 'Set-Cookie': cookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true })
  };
};

export const handler = withCors(logoutHandler);



