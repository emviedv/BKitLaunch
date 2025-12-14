import fs from 'fs';
import path from 'path';

const normalizeSiteUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  try {
    const parsed = new URL(rawUrl);
    return parsed.origin;
  } catch {
    try {
      const parsed = new URL(`https://${rawUrl}`);
      return parsed.origin;
    } catch {
      return null;
    }
  }
};

const readKeyFromFile = () => {
  try {
    const keyPath = path.join(process.cwd(), 'public', 'indexnow-key.txt');
    const value = fs.readFileSync(keyPath, 'utf8').trim();
    return value && /^[a-z0-9]{32}$/i.test(value) ? value : null;
  } catch {
    return null;
  }
};

const buildPayload = (siteUrl, key) => {
  const origin = normalizeSiteUrl(siteUrl) || 'https://www.bibliokit.com';
  return {
    host: new URL(origin).hostname,
    key,
    keyLocation: `${origin}/indexnow-key.txt`,
    urlList: [
      origin,
      `${origin}/llms.txt`,
      `${origin}/robots.txt`,
      `${origin}/sitemap.xml`,
    ],
  };
};

export const onSuccess = async ({ utils, constants }) => {
  const siteUrl =
    process.env.URL ||
    process.env.DEPLOY_PRIME_URL ||
    process.env.DEPLOY_URL ||
    constants?.SITE_URL ||
    'https://www.bibliokit.com';

  const indexNowKey = process.env.INDEXNOW_KEY || readKeyFromFile();
  if (!indexNowKey) {
    utils.status.show({
      title: 'IndexNow ping skipped',
      summary: 'Missing INDEXNOW_KEY env or public/indexnow-key.txt',
    });
    return;
  }

  const payload = buildPayload(siteUrl, indexNowKey);
  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow',
  ];

  const results = [];
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'User-Agent': 'BiblioKit-IndexNow-Plugin/1.0',
        },
        body: JSON.stringify(payload),
      });

      results.push({
        endpoint,
        status: response.status,
        ok: response.ok,
      });
    } catch (error) {
      results.push({
        endpoint,
        status: 'network_error',
        ok: false,
        message: error?.message,
      });
    }
  }

  const successCount = results.filter((r) => r.ok).length;
  const summary = results
    .map((r) => `${r.endpoint} → ${r.status}${r.ok ? '' : ' (failed)'}`)
    .join('; ');

  utils.status.show({
    title: 'IndexNow ping completed',
    summary: `${successCount}/${results.length} endpoints accepted the submission`,
    text: summary,
  });
};
