# 🔐 Admin Environment Variables Setup

This guide explains how to configure the required environment variables for the admin dashboard to work properly on Netlify deployment.

## 🚨 Critical Issue Identified

The admin section was not working because:
1. **Wrong component imported**: App was using `AdminDashboard.minimal` instead of full `AdminDashboard`
2. **Missing AuthProvider**: Authentication context was not available  
3. **Missing environment variables**: Admin credentials and database URL not configured
4. **API URL issues**: ContentAPI was using wrong URLs in production

## ✅ Code Fixes Applied

1. **✅ Fixed Admin Dashboard Import**: Now using full `AdminDashboard` component
2. **✅ Added AuthProvider**: Wrapped App with authentication context
3. **✅ Fixed API URLs**: ContentAPI now uses correct production URLs
4. **✅ Improved Error Handling**: Better fallbacks and error messages

## 🔧 Required Environment Variables

### Admin Credentials
Add these in Netlify Dashboard → Site Settings → Environment Variables:

```bash
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
```

### Database Configuration (Already documented in NETLIFY_DEPLOY.md)
```bash
DATABASE_URL=postgresql://neondb_owner:npg_bS1zCfx7VYUy@ep-late-forest-aedui9mf-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## 🚀 Setup Instructions

### Step 1: Login to Netlify
```bash
npx netlify login
```

### Step 2: Link to your site (if not already linked)
```bash
npx netlify link
```

### Step 3: Set Environment Variables
```bash
# Set admin credentials
npx netlify env:set ADMIN_EMAIL "admin@bibliokit.com"
npx netlify env:set ADMIN_PASSWORD "your-secure-password-here"

# Database URL (if not already set)
npx netlify env:set DATABASE_URL "postgresql://neondb_owner:npg_bS1zCfx7VYUy@ep-late-forest-aedui9mf-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

### Step 4: Redeploy
```bash
npx netlify deploy --prod
```

## 🔍 Manual Setup (Alternative)

If CLI doesn't work, set variables manually:

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site
3. Go to **Site Settings** → **Environment Variables**
4. Click **Add Variable** and add:
   - `ADMIN_EMAIL` = `admin@bibliokit.com`
   - `ADMIN_PASSWORD` = `your-secure-password`
   - `DATABASE_URL` = (use the value from NETLIFY_DEPLOY.md)
5. Trigger a new deployment

## 🧪 Testing After Setup

1. **Visit your deployed site**
2. **Navigate to `/admin`**
3. **Should see login form** (not minimal dashboard)
4. **Login with your credentials**
5. **Should access full admin dashboard**

## ⚠️ Security Notes

- **Change default password**: Use a strong, unique password
- **Admin email**: Use a real email you control
- **Database credentials**: Never commit these to your repository

## 🔄 Fallback Behavior

The admin dashboard now includes improved fallback handling:

- **No Database**: Falls back to localStorage for content versions
- **No Auth**: Shows proper login interface
- **API Errors**: Displays helpful error messages
- **Network Issues**: Graceful degradation with local storage

## 🐛 Troubleshooting

### Admin Login Shows "Server Configuration Error"
- ❌ `ADMIN_EMAIL` and/or `ADMIN_PASSWORD` not set
- ✅ Set both environment variables and redeploy

### Admin Dashboard Shows Minimal UI
- ❌ Code still importing `AdminDashboard.minimal`
- ✅ Fixed in latest code changes

### Content Management Not Working
- ❌ `DATABASE_URL` not set or invalid
- ✅ Use localStorage fallback or set DATABASE_URL

### API Calls Fail with 404
- ❌ Wrong API URLs in production
- ✅ Fixed in ContentAPI implementation

## 📱 What Works Now

After applying the fixes and setting environment variables:

✅ **Full Admin Dashboard**  
✅ **Authentication System**  
✅ **Content Management**  
✅ **Version History**  
✅ **Database Integration** (when configured)  
✅ **Local Storage Fallback**  
✅ **Error Handling**  
✅ **Production API URLs**  

## 🎯 Next Steps

1. **Set environment variables** using one of the methods above
2. **Test the admin functionality** at `/admin`
3. **Configure stronger authentication** (optional, for production)
4. **Set up monitoring** for admin actions (optional)