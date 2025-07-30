#!/bin/bash

# 🔐 BiblioKit Admin Environment Setup Script
# This script helps set up the required environment variables for the admin dashboard

echo "🔐 BiblioKit Admin Environment Setup"
echo "===================================="
echo ""

# Check if netlify CLI is available
if ! command -v netlify &> /dev/null && ! command -v npx &> /dev/null; then
    echo "❌ Error: Neither 'netlify' nor 'npx' command found."
    echo "Please install Node.js and npm first: https://nodejs.org"
    exit 1
fi

# Use npx netlify if netlify command not available globally
NETLIFY_CMD="netlify"
if ! command -v netlify &> /dev/null; then
    NETLIFY_CMD="npx netlify"
    echo "ℹ️  Using npx netlify (netlify CLI not installed globally)"
fi

echo "🔍 Checking Netlify authentication..."

# Check if logged in
if ! $NETLIFY_CMD status &> /dev/null; then
    echo "❌ Not logged in to Netlify."
    echo ""
    echo "Please run: $NETLIFY_CMD login"
    echo "Then run this script again."
    exit 1
fi

echo "✅ Netlify authentication confirmed"
echo ""

# Check if site is linked
echo "🔍 Checking site configuration..."
if ! $NETLIFY_CMD status | grep -q "Site Name"; then
    echo "❌ No site linked to this project."
    echo ""
    echo "Please run: $NETLIFY_CMD link"
    echo "Then run this script again."
    exit 1
fi

echo "✅ Site linked successfully"
echo ""

# Get current environment variables
echo "🔍 Checking current environment variables..."
CURRENT_VARS=$($NETLIFY_CMD env:list 2>/dev/null || echo "")

# Check for required variables
ADMIN_EMAIL_SET=$(echo "$CURRENT_VARS" | grep -q "ADMIN_EMAIL" && echo "true" || echo "false")
ADMIN_PASSWORD_SET=$(echo "$CURRENT_VARS" | grep -q "ADMIN_PASSWORD" && echo "true" || echo "false")
DATABASE_URL_SET=$(echo "$CURRENT_VARS" | grep -q "DATABASE_URL" && echo "true" || echo "false")

echo "Current status:"
echo "- ADMIN_EMAIL: $([ "$ADMIN_EMAIL_SET" = "true" ] && echo "✅ Set" || echo "❌ Not set")"
echo "- ADMIN_PASSWORD: $([ "$ADMIN_PASSWORD_SET" = "true" ] && echo "✅ Set" || echo "❌ Not set")"
echo "- DATABASE_URL: $([ "$DATABASE_URL_SET" = "true" ] && echo "✅ Set" || echo "❌ Not set")"
echo ""

# Set up admin credentials if not already set
if [ "$ADMIN_EMAIL_SET" = "false" ] || [ "$ADMIN_PASSWORD_SET" = "false" ]; then
    echo "🔧 Setting up admin credentials..."
    echo ""
    
    if [ "$ADMIN_EMAIL_SET" = "false" ]; then
        read -p "Enter admin email address: " ADMIN_EMAIL
        if [ -n "$ADMIN_EMAIL" ]; then
            echo "Setting ADMIN_EMAIL..."
            $NETLIFY_CMD env:set ADMIN_EMAIL "$ADMIN_EMAIL"
            echo "✅ ADMIN_EMAIL set successfully"
        fi
    fi
    
    if [ "$ADMIN_PASSWORD_SET" = "false" ]; then
        echo ""
        read -s -p "Enter admin password: " ADMIN_PASSWORD
        echo ""
        if [ -n "$ADMIN_PASSWORD" ]; then
            echo "Setting ADMIN_PASSWORD..."
            $NETLIFY_CMD env:set ADMIN_PASSWORD "$ADMIN_PASSWORD"
            echo "✅ ADMIN_PASSWORD set successfully"
        fi
    fi
fi

# Set up database URL if not already set
if [ "$DATABASE_URL_SET" = "false" ]; then
    echo ""
    echo "🗄️  Setting up database URL..."
    echo ""
    echo "Using the database URL from NETLIFY_DEPLOY.md..."
    
    DATABASE_URL="postgresql://neondb_owner:npg_bS1zCfx7VYUy@ep-late-forest-aedui9mf-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    
    $NETLIFY_CMD env:set DATABASE_URL "$DATABASE_URL"
    echo "✅ DATABASE_URL set successfully"
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📋 Summary of actions taken:"
echo "- Admin credentials configured"
echo "- Database URL configured"
echo ""
echo "🚀 Next steps:"
echo "1. Deploy your site: $NETLIFY_CMD deploy --prod"
echo "2. Visit your site's /admin route"
echo "3. Login with your admin credentials"
echo ""
echo "📖 For troubleshooting, see: ENV_SETUP_ADMIN.md"