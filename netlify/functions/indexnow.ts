import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import fs from 'fs';
import path from 'path';
import { withCors, sendJSON, handleError } from './utils';
import { buildSitemapXml } from './sitemap';

interface IndexNowRequest {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

const normalizeSiteUrl = (raw?: string | null): string => {
  if (!raw) return 'https://www.bibliokit.com';
  try {
    return new URL(raw).origin;
  } catch {
    try {
      return new URL(`https://${raw}`).origin;
    } catch {
      return 'https://www.bibliokit.com';
    }
  }
};

const unescapeXml = (value: string): string =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

const extractSitemapUrls = (xml: string): string[] => {
  const urls: string[] = [];
  const regex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(unescapeXml(match[1]));
  }
  return urls;
};

const buildIndexNowUrls = (siteUrl: string): string[] => {
  const baseUrls = [
    siteUrl,
    `${siteUrl}/llms.txt`,
    `${siteUrl}/robots.txt`
  ];
  const sitemapXml = buildSitemapXml(siteUrl);
  const sitemapUrls = extractSitemapUrls(sitemapXml);
  return Array.from(new Set([...baseUrls, ...sitemapUrls]));
};

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
    const siteUrl = normalizeSiteUrl(
      process.env.PUBLIC_SITE_URL ||
      process.env.URL ||
      process.env.DEPLOY_PRIME_URL ||
      process.env.DEPLOY_URL
    );

    // IndexNow key (env preferred, falls back to public/indexnow-key.txt)
    const indexNowKey = resolveIndexNowKey();
    if (!indexNowKey) {
      return sendJSON(400, { error: 'INDEXNOW_KEY missing; set env or update public/indexnow-key.txt' });
    }

    // URLs to submit for re-indexing
    const urlsToIndex = buildIndexNowUrls(siteUrl);

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
