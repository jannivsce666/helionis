#!/bin/bash

# Helionis - Manual Deploy to Netlify Script
# Führe dieses Script aus, um deine Seite manuell zu deployen

echo "🚀 Deploying Helionis to Netlify..."

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Login check
echo "🔐 Checking Netlify authentication..."
if ! netlify status &> /dev/null; then
    echo "❌ Please login to Netlify first:"
    echo "   netlify login"
    exit 1
fi

# Deploy to production
echo "🌟 Deploying to production..."
netlify deploy --prod --dir .

echo "✅ Deployment complete!"
echo "🌐 Your site should be live at: helionis.de"
