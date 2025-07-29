import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface IndexNowRequest {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST requests and deploy-succeeded hook
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get the site URL from environment or use default
    const siteUrl = process.env.URL || 'https://bibliokit-launch.netlify.app';
    
    // IndexNow key (you'll need to generate this)
    const indexNowKey = process.env.INDEXNOW_KEY || 'demo-key-12345678901234567890123456789012';
    
    // URLs to submit for re-indexing
    const urlsToIndex = [
      siteUrl,
      `${siteUrl}/product`,
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'IndexNow submission completed',
        results
      })
    };

  } catch (error) {
    console.error('IndexNow submission failed:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'IndexNow submission failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
}; 