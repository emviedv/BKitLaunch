import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { withCors, sendJSON, getAuthClaimsFromEvent } from './utils';

const meHandler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const claims = getAuthClaimsFromEvent(event);
  if (!claims) return sendJSON(200, { authenticated: false });
  return sendJSON(200, { authenticated: true, user: { email: claims.sub, role: claims.role || 'admin' } });
};

export const handler = withCors(meHandler);



