# 🔄 IndexNow Setup Guide

IndexNow allows you to instantly notify search engines when your content is updated, helping AI crawlers find your changes within minutes instead of days.

## 🚀 Quick Setup

### 1. Generate Your IndexNow Key

```bash
# Generate a 32-character key (keep this secure!)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### 2. Add Environment Variable

In Netlify Dashboard → Site Settings → Environment Variables:
```
INDEXNOW_KEY=your-generated-key-here
```

### 3. Update Key File

Replace the demo key in `public/indexnow-key.txt` with your real key:
```bash
echo "your-generated-key-here" > public/indexnow-key.txt
```

### 4. Deploy

```bash
npm run build
# Deploy to Netlify
```

## 🎯 Usage

### Manual Trigger (After Content Updates)
```bash
# Trigger re-indexing for your live site
node scripts/trigger-indexnow.js

# Or for a specific URL
node scripts/trigger-indexnow.js https://your-custom-domain.com
```

### API Endpoint
```bash
# Direct API call
curl -X POST https://your-site.netlify.app/.netlify/functions/indexnow \
  -H "Content-Type: application/json" \
  -d '{"trigger": "manual"}'
```

### Automatic Triggers

Add to your content publishing workflow:
```bash
# After updating content
git commit -m "Update content"
git push
npm run deploy
node scripts/trigger-indexnow.js
```

## 📊 What Gets Indexed

The function automatically submits these URLs:
- Homepage: `/`
- Product page: `/product`
- AI sitemap: `/llms.txt`
- Robots file: `/robots.txt`

## 🔍 Verification

### Test Your Setup
```bash
# Check if key file is accessible
curl https://your-site.netlify.app/indexnow-key.txt

# Trigger IndexNow and check response
node scripts/trigger-indexnow.js
```

### Expected Response
```json
{
  "message": "IndexNow submission completed",
  "results": {
    "indexnow": { "status": 200, "success": true },
    "bing": { "status": 200, "success": true },
    "urlsSubmitted": ["..."],
    "timestamp": "2024-12-22T..."
  }
}
```

## ⚡ Benefits

- **Bing/Copilot**: Updates within minutes
- **Other Search Engines**: Automatic relay from IndexNow API
- **AI Crawlers**: Fresh content discovery
- **SEO**: Faster ranking updates

## 🔐 Security Notes

- Keep your IndexNow key secure (treat like an API key)
- The key file must be publicly accessible for verification
- Function only accepts POST requests
- Rate limiting handled by IndexNow service

## 🆘 Troubleshooting

### Function Not Found
- Check Netlify Functions are enabled
- Verify `netlify.toml` functions path
- Redeploy site

### Invalid Key Error
- Ensure `INDEXNOW_KEY` environment variable is set
- Verify key file contains exact same key
- Key must be 32 characters (hex)

### Network Errors
- Check site is publicly accessible
- Verify no firewall blocking IndexNow API
- Try manual trigger script for debugging 