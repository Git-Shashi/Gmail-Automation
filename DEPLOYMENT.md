# Deployment Guide

This guide will help you deploy your Gmail Automation application to production.

## 📦 Deployment Architecture

- **Frontend**: Vercel (recommended) - Free tier available
- **Backend**: Render.com or Railway.app (recommended) - Free tier available  
- **Database**: MongoDB Atlas (already configured)

---

## 🎯 Prerequisites

Before deploying, ensure you have:

1. ✅ GitHub account (for code hosting)
2. ✅ Vercel account (for frontend)
3. ✅ Render.com or Railway.app account (for backend)
4. ✅ Google Cloud Console project with OAuth 2.0 configured
5. ✅ MongoDB Atlas database (already set up)
6. ✅ Google Gemini API key

---

## 🚀 Step 1: Push Code to GitHub

```bash
# Initialize git repository (if not already done)
cd /path/to/gmail-automation
git init
git add .
git commit -m "Initial commit - Gmail Automation"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/gmail-automation.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 2: Deploy Frontend to Vercel

### Option A: Vercel Dashboard (Recommended)

1. **Go to** [vercel.com](https://vercel.com) and sign in
2. **Click** "Add New Project"
3. **Import** your GitHub repository
4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   
5. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.onrender.com` (You'll get this after deploying backend)

6. **Click** "Deploy"

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel --prod

# Set environment variable
vercel env add VITE_API_URL production
# Enter your backend URL when prompted
```

**📝 Note**: Save your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

---

## 🔧 Step 3: Deploy Backend to Render.com

### 3.1 Create Web Service

1. **Go to** [render.com](https://render.com) and sign in
2. **Click** "New +" → "Web Service"
3. **Connect** your GitHub repository
4. **Configure Service**:
   - **Name**: `gmail-automation-backend` (or your choice)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: Free (or paid if needed)

### 3.2 Add Environment Variables

Click "Environment" and add these variables:

```bash
# MongoDB
MONGODB_URL=mongodb+srv://your-connection-string
DATABASE_NAME=gmail_automation

# JWT
SECRET_KEY=your-super-secret-jwt-key-min-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
REDIRECT_URI=https://your-backend.onrender.com/api/v1/auth/callback

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# CORS (YOUR VERCEL URL)
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:5173

# App Settings
APP_NAME=Gmail Automation
DEBUG=False
```

### 3.3 Deploy

Click "Create Web Service" - Render will automatically deploy!

**📝 Note**: Save your Render URL (e.g., `https://your-backend.onrender.com`)

---

## 🔐 Step 4: Update Google OAuth Configuration

1. **Go to** [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. **Select** your OAuth 2.0 Client ID
3. **Add** Authorized redirect URIs:
   ```
   https://your-backend.onrender.com/api/v1/auth/callback
   https://your-app.vercel.app/callback
   ```
4. **Add** Authorized JavaScript origins:
   ```
   https://your-app.vercel.app
   ```
5. **Click** "Save"

---

## 🔄 Step 5: Update Frontend Environment Variable

Go back to Vercel:
1. **Settings** → **Environment Variables**
2. **Update** `VITE_API_URL` with your Render backend URL:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
3. **Redeploy** from the Deployments tab

---

## ✅ Step 6: Test Your Deployment

1. **Visit** your Vercel URL: `https://your-app.vercel.app`
2. **Click** "Login with Google"
3. **Complete** OAuth flow
4. **Test** email fetching and AI chat features

---

## 🐛 Troubleshooting

### Frontend Issues

**Build fails on Vercel**:
```bash
# Check build logs in Vercel dashboard
# Common fix: Ensure all dependencies are in package.json
cd frontend
npm install
npm run build  # Test locally first
```

**CORS errors**:
- Verify `CORS_ORIGINS` in backend includes your Vercel URL
- Check browser console for exact error

### Backend Issues

**500 Internal Server Error**:
- Check Render logs: Dashboard → Logs
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

**OAuth redirect fails**:
- Verify `REDIRECT_URI` matches Google Console settings exactly
- Check that HTTPS is used (not HTTP) in production

**Rate limit errors (Gemini AI)**:
- Free tier: 10 requests/minute
- App already optimized with `with_summaries=False`
- Consider upgrading to paid tier if needed

---

## 📊 Monitoring

### Render Dashboard
- View logs: Real-time application logs
- Monitor CPU/Memory usage
- Check deployment status

### Vercel Dashboard
- View build logs
- Monitor bandwidth usage  
- Check function execution logs

---

## 💰 Cost Optimization

**Free Tier Limits**:
- **Vercel**: 100GB bandwidth/month, unlimited projects
- **Render**: 750 hours/month (1 free web service)
- **MongoDB Atlas**: 512MB storage
- **Gemini AI**: 10 requests/minute

**Tips**:
1. Render free tier sleeps after 15 min inactivity (cold starts ~30s)
2. Use `with_summaries=False` to reduce API calls
3. Cache email data in MongoDB to reduce Gmail API calls

---

## 🔄 Continuous Deployment

Both Vercel and Render auto-deploy when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Automatic deployment triggers on both platforms!
```

---

## 📝 Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Render
- [ ] Environment variables configured on both platforms
- [ ] Google OAuth redirect URIs updated
- [ ] CORS origins includes production URLs
- [ ] Tested login flow in production
- [ ] Tested email fetching
- [ ] Tested AI chat functionality
- [ ] SSL/HTTPS working (automatic on Vercel/Render)
- [ ] README updated with production URLs

---

## 🎉 Success!

Your application is now live! Update the README.md with your production URLs:

```markdown
## 🚀 Live Demo

**Frontend**: https://your-app.vercel.app
**Backend API**: https://your-backend.onrender.com
```

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com/deployment/
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/

---

## 🔒 Security Best Practices

1. ✅ Never commit `.env` files (already in `.gitignore`)
2. ✅ Use environment variables for all secrets
3. ✅ Rotate JWT `SECRET_KEY` periodically
4. ✅ Monitor Google OAuth token expiration
5. ✅ Set `DEBUG=False` in production
6. ✅ Use strong MongoDB passwords
7. ✅ Enable MongoDB IP whitelist (Render IPs + 0.0.0.0/0 for flexibility)

---

Good luck with your deployment! 🚀
