# 🚀 Netlify Deployment Guide with Database

This guide covers deploying your BiblioKit application to Netlify with full PostgreSQL database integration.

## 📋 Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **GitHub Repository**: Your code should be in a Git repository
3. **PostgreSQL Database**: Your Neon database is already configured

## 🔧 Environment Variables Setup

In your Netlify dashboard, you need to configure these environment variables:

### Go to: Site Settings → Environment Variables

Add the following variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_bS1zCfx7VYUy@ep-late-forest-aedui9mf-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

VITE_DATABASE_URL=postgresql://neondb_owner:npg_bS1zCfx7VYUy@ep-late-forest-aedui9mf-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

VITE_DB_HOST=ep-late-forest-aedui9mf-pooler.c-2.us-east-2.aws.neon.tech
VITE_DB_NAME=neondb
VITE_DB_USER=neondb_owner
VITE_DB_PASSWORD=npg_bS1zCfx7VYUy
VITE_DB_PORT=5432
VITE_DB_SSL=true
```

## 🚀 Deployment Options

### Option 1: Git Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add database integration"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Select your repository
   - Build settings are auto-detected from `netlify.toml`

3. **Configure Environment Variables** (as shown above)

4. **Deploy**: Netlify will automatically build and deploy

### Option 2: Manual Deploy

1. **Build locally**:
   ```bash
   npm install
   npm run build
   ```

2. **Deploy the dist folder**:
   - Drag `dist/` folder to Netlify's deploy interface
   - Add environment variables manually
   - Redeploy after adding variables

### Option 3: Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login and build**:
   ```bash
   netlify login
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

## 🛠️ Build Configuration

Your `netlify.toml` is already configured with:

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Functions Directory**: `netlify/functions`
- **API Redirects**: `/api/*` → `/.netlify/functions/:splat`

## 🗄️ Database Functions

The following serverless functions are included:

- **`/api/db-test`**: Test database connectivity
- **`/api/users`**: CRUD operations for users
- **`/api/db-tables`**: List database tables

## ✅ Verification Steps

After deployment:

1. **Visit your site** at the Netlify URL
2. **Navigate to `/database`** to test connectivity
3. **Check the browser console** for any errors
4. **Test database operations**:
   - Connection test should show ✅ Connected
   - Try creating a user
   - View database tables

## 🔍 Troubleshooting

### Common Issues:

1. **Environment Variables Not Set**:
   - Double-check all variables in Netlify dashboard
   - Redeploy after adding variables

2. **Database Connection Fails**:
   - Verify DATABASE_URL is correct
   - Check Neon database is active
   - Ensure SSL is enabled

3. **API Calls Fail**:
   - Check browser network tab
   - Verify functions are deployed
   - Check function logs in Netlify

4. **Build Errors**:
   - Run `npm run build` locally first
   - Check for TypeScript errors
   - Ensure all dependencies are installed

## 📱 Features Available After Deployment

✅ **Full Database Integration**
✅ **User Management System**
✅ **Real-time Database Operations**
✅ **Secure API Endpoints**
✅ **Automatic Table Creation**
✅ **CORS Handling**
✅ **Error Handling**

## 🔗 API Endpoints

Once deployed, your API will be available at:

- `https://your-site.netlify.app/api/db-test`
- `https://your-site.netlify.app/api/users`
- `https://your-site.netlify.app/api/db-tables`

## 📊 Database Schema

The `users` table will be automatically created with:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎉 You're Ready to Launch!

Your BiblioKit application is now ready for production deployment with full database persistence. All changes will be saved to your PostgreSQL database! 