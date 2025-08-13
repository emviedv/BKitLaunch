import { Handler } from '@netlify/functions';
import { withCors, sendJSON } from './utils';

const handlerImpl: Handler = async () => {
  return sendJSON(200, {
    ok: true,
    timestamp: new Date().toISOString(),
    version: process.env.COMMIT_REF || 'dev',
  }, {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  });
};

export const handler = withCors(handlerImpl);


