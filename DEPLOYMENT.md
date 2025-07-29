# BiblioKit Simple - Deployment Guide

This is a complete, self-contained version of the BiblioKit website optimized for quick deployment.

## 🚀 Quick Deploy to Netlify

### Option 1: Git Integration (Recommended)
1. Push this folder to a GitHub/GitLab repository
2. Connect to Netlify:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Build settings are auto-detected from `netlify.toml`
3. Deploy automatically!

### Option 2: Manual Deploy
1. Run: `npm install && npm run build`
2. Drag the `dist/` folder to Netlify's deploy interface
3. Your site is live!

### Option 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the site
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

## 🌐 Other Platforms

### Vercel
1. Push to GitHub
2. Import project to Vercel
3. Build settings are auto-detected

### GitHub Pages
1. Build: `npm run build`
2. Deploy `dist/` folder to gh-pages branch

### Railway/Render
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

## ⚙️ Build Configuration

All platforms should auto-detect these settings from `netlify.toml`:
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Node Version:** 18+

## 🎯 Post-Deployment

After deployment:
1. Visit your live site
2. Click the ✏️ button to edit content
3. Customize with your branding
4. Share your new site!

## 🔧 Custom Domain

Once deployed, you can add a custom domain:
1. In Netlify: Site settings → Domain management
2. Add your custom domain
3. Configure DNS (Netlify provides instructions)

## 📝 Content Management

- Edit content using the ✏️ button on your live site
- Changes are saved in browser localStorage
- For permanent changes, edit `src/data/products.json`

## 🆘 Troubleshooting

**Build fails?**
- Ensure Node.js 18+ is available
- Check all dependencies are in package.json

**Site blank after deploy?**
- Check browser console for errors
- Verify build completed successfully
- Test locally first with `npm run preview`

**Content editor not working?**
- Content editor requires JavaScript
- Check if browser has localStorage enabled

Happy deploying! 🎉 