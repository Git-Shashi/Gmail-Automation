#!/bin/bash

# =============================================================================
# Gmail Automation - Deployment Helper Script
# =============================================================================
# This script helps you prepare for deployment
# Run: chmod +x deploy-helper.sh && ./deploy-helper.sh
# =============================================================================

echo "🚀 Gmail Automation - Deployment Helper"
echo "========================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized"
    echo "Run: git init"
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes"
    echo "Staged changes:"
    git diff --cached --name-only
    echo ""
    echo "Unstaged changes:"
    git diff --name-only
    echo ""
    read -p "Do you want to commit these changes? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        echo "✅ Changes committed"
    fi
fi

echo ""
echo "📋 Pre-Deployment Checklist:"
echo "=============================="
echo ""

# Check backend files
echo "Backend Files:"
if [ -f "backend/requirements.txt" ]; then
    echo "  ✅ requirements.txt"
else
    echo "  ❌ requirements.txt missing"
fi

if [ -f "backend/Procfile" ]; then
    echo "  ✅ Procfile"
else
    echo "  ❌ Procfile missing"
fi

if [ -f "backend/runtime.txt" ]; then
    echo "  ✅ runtime.txt"
else
    echo "  ❌ runtime.txt missing"
fi

if [ -f "backend/.env.example" ]; then
    echo "  ✅ .env.example"
else
    echo "  ❌ .env.example missing"
fi

echo ""

# Check frontend files
echo "Frontend Files:"
if [ -f "frontend/vercel.json" ]; then
    echo "  ✅ vercel.json"
else
    echo "  ❌ vercel.json missing"
fi

if [ -f "frontend/.env.example" ]; then
    echo "  ✅ .env.example"
else
    echo "  ❌ .env.example missing"
fi

if [ -f "frontend/package.json" ]; then
    echo "  ✅ package.json"
else
    echo "  ❌ package.json missing"
fi

echo ""

# Check documentation
echo "Documentation:"
if [ -f "DEPLOYMENT.md" ]; then
    echo "  ✅ DEPLOYMENT.md"
else
    echo "  ❌ DEPLOYMENT.md missing"
fi

if [ -f "QUICK_START.md" ]; then
    echo "  ✅ QUICK_START.md"
else
    echo "  ❌ QUICK_START.md missing"
fi

if [ -f "README.md" ]; then
    echo "  ✅ README.md"
else
    echo "  ❌ README.md missing"
fi

echo ""
echo "========================================"
echo "🔑 Required Credentials:"
echo "========================================"
echo ""
echo "Make sure you have:"
echo "  📌 MongoDB Atlas connection string"
echo "  📌 Google OAuth Client ID"
echo "  📌 Google OAuth Client Secret"
echo "  📌 Google Gemini API key"
echo "  📌 JWT Secret Key (generate with: openssl rand -hex 32)"
echo ""

echo "========================================"
echo "🎯 Next Steps:"
echo "========================================"
echo ""
echo "1. Push to GitHub:"
echo "   git remote add origin https://github.com/YOUR-USERNAME/gmail-automation.git"
echo "   git push -u origin main"
echo ""
echo "2. Deploy Backend to Render.com:"
echo "   - Visit: https://render.com"
echo "   - Follow: DEPLOYMENT.md (Step 3)"
echo ""
echo "3. Deploy Frontend to Vercel:"
echo "   - Visit: https://vercel.com"
echo "   - Follow: DEPLOYMENT.md (Step 2)"
echo ""
echo "4. Update Google OAuth:"
echo "   - Visit: https://console.cloud.google.com/apis/credentials"
echo "   - Follow: DEPLOYMENT.md (Step 4)"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo "⚡ See QUICK_START.md for quick checklist"
echo ""
echo "🎉 Good luck with deployment!"
