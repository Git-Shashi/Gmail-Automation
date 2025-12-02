# Quick Deployment Checklist

## 📋 Pre-Deployment

- [ ] Push code to GitHub
- [ ] Have MongoDB Atlas connection string ready
- [ ] Have Google OAuth credentials ready
- [ ] Have Gemini API key ready

## 🎯 Deployment Steps

### 1️⃣ Deploy Backend (Render.com)

1. Go to [render.com](https://render.com)
2. New Web Service → Connect GitHub repo
3. **Settings**:
   - Root: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Add Environment Variables**:
   ```
   MONGODB_URL=mongodb+srv://...
   DATABASE_NAME=gmail_automation
   SECRET_KEY=<generate-with-openssl-rand-hex-32>
   GOOGLE_CLIENT_ID=...apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=...
   REDIRECT_URI=https://YOUR-BACKEND.onrender.com/api/v1/auth/callback
   GEMINI_API_KEY=...
   CORS_ORIGINS=https://YOUR-FRONTEND.vercel.app
   DEBUG=False
   ```
5. Deploy → Copy backend URL

### 2️⃣ Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. New Project → Import GitHub repo
3. **Settings**:
   - Framework: Vite
   - Root: `frontend`
   - Build: `npm run build`
   - Output: `dist`
4. **Environment Variable**:
   ```
   VITE_API_URL=https://YOUR-BACKEND.onrender.com
   ```
5. Deploy → Copy frontend URL

### 3️⃣ Update Google OAuth

1. [Google Console](https://console.cloud.google.com/apis/credentials)
2. Add Authorized redirect URIs:
   ```
   https://YOUR-BACKEND.onrender.com/api/v1/auth/callback
   ```
3. Add JavaScript origins:
   ```
   https://YOUR-FRONTEND.vercel.app
   ```

### 4️⃣ Final Updates

1. **Update Backend** (Render.com):
   - Environment variable `CORS_ORIGINS` = `https://YOUR-FRONTEND.vercel.app`
   - Redeploy

2. **Update Frontend** (Vercel):
   - Already set `VITE_API_URL`
   - Redeploy if needed

### 5️⃣ Test

- [ ] Visit your Vercel URL
- [ ] Login with Google
- [ ] Fetch emails
- [ ] Test AI chat

## 🎉 Done!

Update README.md:
```markdown
**Frontend**: https://YOUR-FRONTEND.vercel.app
**Backend**: https://YOUR-BACKEND.onrender.com
```

---

## 💡 Quick Commands

Generate JWT secret:
```bash
openssl rand -hex 32
```

Test backend locally:
```bash
cd backend
uvicorn app.main:app --reload
```

Test frontend locally:
```bash
cd frontend
npm run dev
```

Build frontend:
```bash
cd frontend
npm run build
```

---

## 🐛 Common Issues

**OAuth fails**: Check redirect URIs match exactly  
**CORS error**: Verify CORS_ORIGINS includes frontend URL  
**500 error**: Check backend logs on Render  
**Build fails**: Ensure all dependencies in package.json/requirements.txt

---

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions!
