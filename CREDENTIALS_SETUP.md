# Environment Variables Setup Guide

This guide explains how to obtain all required credentials for the Gmail Automation project.

## 1. MongoDB Atlas Setup

**Get your MongoDB connection string:**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up/Login (free tier is sufficient)
3. Create a new cluster:
   - Click "Build a Database" → "Shared" (Free)
   - Choose a cloud provider (AWS recommended)
   - Region: Choose closest to you
   - Cluster Name: `gmail-automation-cluster`
4. Create Database User:
   - Click "Database Access" → "Add New Database User"
   - Authentication Method: Password
   - Username: `gmail_admin` (or your choice)
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Atlas Admin"
5. Setup Network Access:
   - Click "Network Access" → "Add IP Address"
   - For development: Click "Allow Access From Anywhere" (0.0.0.0/0)
   - For production: Add your server's IP
6. Get Connection String:
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Python, Version: 3.12 or later
   - Copy the connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://gmail_admin:yourpassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

**Update .env:**
```env
MONGODB_URL=mongodb+srv://gmail_admin:yourpassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=gmail_automation
```

---

## 2. Google OAuth 2.0 Setup

**Create Google Cloud Project and OAuth credentials:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project:
   - Click project dropdown → "New Project"
   - Project name: `Gmail Automation`
   - Click "Create"
3. Enable Gmail API:
   - Go to "APIs & Services" → "Library"
   - Search for "Gmail API"
   - Click "Enable"
4. Configure OAuth Consent Screen:
   - Go to "APIs & Services" → "OAuth consent screen"
   - User Type: "External" → Click "Create"
   - App information:
     - App name: `Gmail Automation`
     - User support email: Your email
     - Developer contact: Your email
   - Scopes: Click "Add or Remove Scopes"
     - Add these scopes:
       - `https://www.googleapis.com/auth/gmail.readonly`
       - `https://www.googleapis.com/auth/gmail.send`
       - `https://www.googleapis.com/auth/gmail.modify`
       - `https://www.googleapis.com/auth/userinfo.email`
       - `https://www.googleapis.com/auth/userinfo.profile`
   - Test users: Add `test@gmail.com` (as required by assignment)
   - Click "Save and Continue"
5. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: `Gmail Automation Web Client`
   - Authorized redirect URIs:
     - Add: `http://localhost:8000/api/v1/auth/callback`
     - Add: `https://your-backend-url.com/api/v1/auth/callback` (for production)
   - Click "Create"
   - **Copy the Client ID and Client Secret**

**Update .env:**
```env
GOOGLE_CLIENT_ID=1234567890-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
REDIRECT_URI=http://localhost:8000/api/v1/auth/callback
```

---

## 3. Google Gemini AI API Key

**Get Gemini API key for AI-powered features:**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Select project: Choose your Gmail Automation project
5. Click "Create API key in existing project"
6. **Copy the API key**

**Update .env:**
```env
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz123456
```

---

## 4. JWT Secret Key

**Generate a secure random secret key:**

Option 1 - Using OpenSSL (Mac/Linux):
```bash
openssl rand -hex 32
```

Option 2 - Using Python:
```python
import secrets
print(secrets.token_urlsafe(32))
```

Option 3 - Online Generator:
- Go to [RandomKeygen.com](https://randomkeygen.com/)
- Use "Fort Knox Passwords" section

**Update .env:**
```env
SECRET_KEY=your-generated-64-character-random-string
```

---

## 5. CORS Origins

**Frontend URLs that can access your backend:**

Development:
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

Production (after Vercel deployment):
```env
CORS_ORIGINS=http://localhost:5173,https://your-app.vercel.app
```

---

## Complete .env Example

After following all steps above, your `.env` should look like:

```env
# MongoDB
MONGODB_URL=mongodb+srv://gmail_admin:MyP@ssw0rd123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=gmail_automation

# JWT
SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
REDIRECT_URI=http://localhost:8000/api/v1/auth/callback

# Gemini AI
GEMINI_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz123456

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# App
APP_NAME=Gmail Automation
DEBUG=True
```

---

## Testing Your Setup

After setting up all credentials, test the connection:

```bash
# Start backend
cd backend
uvicorn app.main:app --reload --port 8000
```

You should see:
```
✅ Connected to MongoDB Atlas database: gmail_automation
✅ Database indexes created
```

If you see errors, double-check:
- MongoDB URL has correct password
- IP address is whitelisted in MongoDB Atlas
- Google OAuth redirect URI matches exactly
- All API keys are valid

---

## Security Notes

⚠️ **Important:**
- Never commit `.env` to git (it's in `.gitignore`)
- Use different keys for development and production
- Rotate secrets periodically
- For production, use environment variables in hosting platform
- Keep API keys secret and secure

---

## Need Help?

- MongoDB Issues: Check [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- OAuth Issues: Check [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- Gemini API: Check [Gemini API Docs](https://ai.google.dev/docs)
