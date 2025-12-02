# Gmail Automation Setup Guide

## Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB Atlas account
- Google Cloud account
- Google AI Studio account

## Backend Setup

### 1. Create Virtual Environment
```bash
cd backend
python -m venv ../.venv
source ../.venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `backend/.env` and fill in your credentials:

#### MongoDB Configuration
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Set `MONGODB_URL` and `DATABASE_NAME`

#### Google OAuth 2.0
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Gmail API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: Web application
6. Authorized redirect URIs: `http://localhost:8000/api/v1/auth/callback`
7. Copy Client ID and Client Secret to `.env`

#### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Set `GEMINI_API_KEY` in `.env`

#### JWT Secret
Generate a random secret key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 4. Run Backend Server
```bash
cd backend
PYTHONPATH=. uvicorn app.main:app --reload --port 8000
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Run Frontend Server
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Features

- 🔐 Google OAuth authentication
- 📧 Read and manage Gmail emails
- 🤖 AI-powered email assistant (Gemini 2.5 Flash)
- 💬 Natural language commands
- 🎨 Modern UI with Tailwind CSS & Shadcn UI
- 📊 Redux state management

## Security Notes

⚠️ **NEVER commit `.env` files to git!**

The `.env` file contains sensitive credentials and is already in `.gitignore`. Always use `.env.example` as a template.

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (must be 3.10+)
- Ensure virtual environment is activated
- Verify all environment variables in `.env`

### Frontend won't start
- Check Node version: `node --version` (must be 18+)
- Delete `node_modules` and run `npm install` again
- Clear npm cache: `npm cache clean --force`

### OAuth not working
- Verify `REDIRECT_URI` matches Google Cloud Console
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Ensure Gmail API is enabled in Google Cloud Console

### AI not responding
- Verify `GEMINI_API_KEY` is valid
- Check API quota at https://ai.dev/usage
- Free tier has rate limits (15 requests/minute)

## License

MIT
