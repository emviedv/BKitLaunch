# 🔐 Environment Variables Setup for Admin Authentication

## ⚠️ CRITICAL: Admin Authentication Required

**The admin dashboard will appear blank if these environment variables are not configured!**

Your admin page needs authentication credentials to function. Without these, users will see a blank page or login errors.

## Required Environment Variables

To secure your BiblioKit admin access, you need to set up the following environment variables in your Netlify deployment:

### 1. Admin Credentials

```bash
ADMIN_EMAIL=your-email@domain.com
ADMIN_PASSWORD=your-secure-password
```

## Setting Up in Netlify

### Option 1: Netlify Dashboard
1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add variable** and add:
   - **Variable name**: `ADMIN_EMAIL`
   - **Value**: Your admin email address
4. Click **Add variable** again and add:
   - **Variable name**: `ADMIN_PASSWORD`
   - **Value**: Your secure admin password (use a strong password!)

### Option 2: Netlify CLI
```bash
# Login to Netlify CLI
netlify login

# Set environment variables
netlify env:set ADMIN_EMAIL "your-email@domain.com"
netlify env:set ADMIN_PASSWORD "your-secure-password"
```

## Security Best Practices

### Password Requirements
- **Minimum 12 characters**
- Include uppercase and lowercase letters
- Include numbers and special characters
- Don't use common words or personal information

### Example Strong Password
```
MySecure2024!Admin@BiblioKit
```

## After Setting Variables

1. **Redeploy your site** to apply the new environment variables
2. **Test the login** using the 🔒 button on your live site
3. **Verify security** by trying to access the editor without logging in

## How It Works

- The 🔒 button appears for non-authenticated users
- Click it to open the admin login form
- Enter your `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- Once authenticated, the ✏️ edit button and 🚪 logout button appear
- The content editor is now protected and only accessible to you

## Troubleshooting

### Admin Page Appears Blank?
**This is the most common issue! Follow these steps:**

1. **Check environment variables** - Most common cause
   - Verify ADMIN_EMAIL and ADMIN_PASSWORD are set in Netlify
   - Make sure you redeployed after adding variables

2. **Check browser console** - Look for authentication errors
   - Press F12 and check for error messages
   - Look for "Server configuration error" messages

3. **Check Netlify function logs**
   - Go to Netlify dashboard → Functions → admin-auth
   - Look for error logs about missing credentials

4. **Clear browser storage**
   - Clear localStorage and cookies
   - Try in an incognito/private window

### Login Not Working?
1. Check that environment variables are set correctly in Netlify
2. Ensure you redeployed after setting variables
3. Verify there are no typos in email/password
4. Check browser console for error messages

### Can't See Admin Buttons?
1. Clear your browser cache
2. Try in an incognito/private window
3. Check that JavaScript is enabled

### Quick Diagnostic Steps
```bash
# Check your environment setup locally
cat .env.example

# Copy for local development
cp .env.example .env.local

# Edit with your credentials
nano .env.local
```

## Next Steps

Once authentication is working:
- Consider implementing content database storage
- Add content versioning and backup
- Set up admin dashboard for better management 