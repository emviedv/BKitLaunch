import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import fs from 'fs';
import path from 'path';
import { withCors, sendJSON, handleError } from './utils';

interface IndexNowRequest {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

const readKeyFromFile = (): string | null => {
  try {
    const keyPath = path.join(process.cwd(), 'public', 'indexnow-key.txt');
    const value = fs.readFileSync(keyPath, 'utf8').trim();
    return value && /^[a-z0-9]{32}$/i.test(value) ? value : null;
  } catch {
    return null;
  }
};

const resolveIndexNowKey = (): string | null => {
  if (typeof process !== 'undefined') {
    const envKey = process.env.INDEXNOW_KEY;
    if (envKey && /^[a-z0-9]{32}$/i.test(envKey.trim())) {
      return envKey.trim();
    }
  }
  return readKeyFromFile();
};

const indexnowHandler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST requests and deploy-succeeded hook
  if (event.httpMethod !== 'POST') {
    return sendJSON(405, { error: 'Method not allowed' });
  }

  try {
    // Get the site URL from environment or use default
    const siteUrl = process.env.URL || 'https://bibliokit-launch.netlify.app';

    // IndexNow key (env preferred, falls back to public/indexnow-key.txt)
    const indexNowKey = resolveIndexNowKey();
    if (!indexNowKey) {
      return sendJSON(400, { error: 'INDEXNOW_KEY missing; set env or update public/indexnow-key.txt' });
    }

    // URLs to submit for re-indexing
    const urlsToIndex = [
      siteUrl,
      `${siteUrl}/llms.txt`,
      `${siteUrl}/robots.txt`
    ];

    const requestBody: IndexNowRequest = {
      host: new URL(siteUrl).hostname,
      key: indexNowKey,
      keyLocation: `${siteUrl}/indexnow-key.txt`,
      urlList: urlsToIndex
    };

    // Submit to IndexNow API
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'BiblioKit-IndexNow/1.0'
      },
      body: JSON.stringify(requestBody)
    });

    // Also submit to Bing directly
    const bingResponse = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'BiblioKit-IndexNow/1.0'
      },
      body: JSON.stringify(requestBody)
    });

    const results = {
      indexnow: {
        status: response.status,
        success: response.ok
      },
      bing: {
        status: bingResponse.status,
        success: bingResponse.ok
      },
      urlsSubmitted: urlsToIndex,
      timestamp: new Date().toISOString()
    };

    return sendJSON(200, {
      message: 'IndexNow submission completed',
      results
    });

  } catch (error) {
    console.error('IndexNow submission failed:', error);
    
    return handleError(error, 'IndexNow submission');
  }
};

export const handler = withCors(indexnowHandler); 
