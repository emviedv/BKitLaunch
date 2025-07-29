#!/usr/bin/env node

/**
 * Trigger IndexNow for immediate re-indexing
 * Usage: node scripts/trigger-indexnow.js [site-url]
 */

const siteUrl = process.argv[2] || process.env.URL || 'https://bibliokit-launch.netlify.app';

async function triggerIndexNow() {
  try {
    console.log(`🚀 Triggering IndexNow for: ${siteUrl}`);
    
    const response = await fetch(`${siteUrl}/.netlify/functions/indexnow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'BiblioKit-Manual-Trigger/1.0'
      },
      body: JSON.stringify({ 
        trigger: 'manual',
        timestamp: new Date().toISOString()
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ IndexNow triggered successfully!');
      console.log('📊 Results:', JSON.stringify(result.results, null, 2));
    } else {
      console.error('❌ IndexNow failed:', result);
    }
    
  } catch (error) {
    console.error('❌ Error triggering IndexNow:', error.message);
  }
}

triggerIndexNow(); 