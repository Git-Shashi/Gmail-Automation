# Gmail Automation with AI Assistant

A modern email management application powered by AI that helps users interact with their Gmail inbox through natural language conversations.

## 🌟 Solution Overview

This application provides an intelligent email assistant that:
- **Authenticates** users via Google OAuth 2.0 with Gmail API access
- **Fetches and displays** emails from Gmail with a modern, responsive UI
- **AI-powered chat** enables natural conversations about emails using Google Gemini 2.5 Flash
- **Context-aware responses** - AI has full access to recent emails for intelligent answers
- **Email actions** - Users can ask questions, get summaries, and manage emails through chat
- **Real-time updates** with Redux state management for seamless user experience

## 🚀 Live Demo

**Frontend:** https://your-app.vercel.app *(Update after deployment)*  
**Backend API:** https://your-backend.onrender.com *(Update after deployment)*

> 📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions**

## 🛠️ Technologies Used

### Backend (FastAPI)
- **FastAPI** - Modern Python web framework
- **Motor** - Async MongoDB driver for Python
- **Google Auth Library** - OAuth 2.0 authentication
- **Gmail API** - Email fetching and management
- **Google Generative AI** - Gemini 2.5 Flash for conversational AI
- **PyJWT** - JWT token authentication
- **Pydantic** - Data validation

### Frontend (React)
- **React 18** with Vite for fast development
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Shadcn UI** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Lucide Icons** - Modern icon library

### Database
- **MongoDB Atlas** - Cloud database for user and conversation storage

## 📋 Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Cloud account
- Google AI Studio account

### 1. Clone Repository
```bash
git clone https://github.com/Git-Shashi/Gmail-Automation.git
cd Gmail-Automation
```

### 2. Backend Setup (FastAPI)

#### Install Dependencies
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables
```bash
cp .env.example .env
```

Edit `backend/.env` with your credentials (see configuration section below).

#### Run Backend Server
```bash
cd backend
PYTHONPATH=. uvicorn app.main:app --reload --port 8000
```

Backend will run at: http://localhost:8000

### 3. Frontend Setup (React + Vite)

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Run Frontend Server
```bash
npm run dev
```

Frontend will run at: http://localhost:5173

## 🔐 Google Credentials & OAuth Configuration

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Gmail API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Gmail API"
   - Click "Enable"

### Step 2: Create OAuth 2.0 Credentials
1. Navigate to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Configure OAuth consent screen:
   - User Type: External
   - App name: Gmail Automation
   - Scopes: Add Gmail API scopes
   - Test users: Add your email
4. Create OAuth Client:
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: 
     - `http://localhost:8000/api/v1/auth/callback`
     - `http://localhost:5173/auth/callback`
5. Copy **Client ID** and **Client Secret**

### Step 3: Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the generated key

### Step 4: Setup MongoDB Atlas
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free M0 tier)
3. Add database user with password
4. Whitelist your IP (or use 0.0.0.0/0 for development)
5. Get connection string from "Connect" → "Connect your application"

## ⚙️ Required Environment Variables

Create `backend/.env` file with the following:

```env
# MongoDB Configuration
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
DATABASE_NAME=gmail_automation

# JWT Secret (generate with: python -c "import secrets; print(secrets.token_urlsafe(32))")
SECRET_KEY=your_generated_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Google OAuth 2.0 (from Google Cloud Console)
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=http://localhost:8000/api/v1/auth/callback

# Google Gemini AI (from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here

# CORS Settings
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# App Settings
APP_NAME=Gmail Automation
DEBUG=True
```

## 📝 Assumptions

1. **Email Volume**: Application fetches and displays up to 10 recent emails for AI context
2. **AI Model**: Uses Gemini 2.5 Flash with free tier rate limits (10-15 requests/minute)
3. **Authentication**: JWT tokens expire after 7 days (configurable)
4. **Email Operations**: Focus on read operations and AI conversations; send/delete features implemented but require additional Gmail permissions
5. **Browser Compatibility**: Optimized for modern browsers (Chrome, Firefox, Safari, Edge)

## ⚠️ Known Limitations

1. **Rate Limits**: 
   - Gemini API free tier: 10-15 requests per minute
   - Gmail API: 250 quota units per user per second
   
2. **Email Context**: AI has access to 10 most recent emails to balance performance and context quality

3. **OAuth Scope**: Currently requests Gmail read/send/delete permissions - users must grant all scopes

4. **Real-time Updates**: No WebSocket implementation - requires manual refresh to see new emails

5. **Email Attachments**: Attachment detection implemented but download functionality requires additional work

6. **Mobile Responsiveness**: UI optimized for desktop; mobile layout needs refinement

7. **Production Security**: 
   - JWT secret should be rotated regularly
   - OAuth credentials should be regenerated for production
   - MongoDB connection should use environment-specific credentials

## 🎯 Features

✅ Google OAuth 2.0 authentication  
✅ Gmail inbox integration  
✅ AI-powered conversational assistant (Google Gemini)  
✅ Context-aware email understanding  
✅ Modern, responsive UI with theme switcher (White/Charcoal/Night)  
✅ Real-time chat interface  
✅ Email detail modal with full email view  
✅ Email categorization and search  
✅ Redux state management  
✅ MongoDB conversation storage  
✅ Rate limit optimization (AI summaries optional)  

## 🚢 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete step-by-step deployment instructions to:
- ✅ Vercel (Frontend)
- ✅ Render.com/Railway (Backend)
- ✅ MongoDB Atlas (Database - already configured)

The deployment guide includes:
- Platform-specific configurations
- Environment variable setup
- Google OAuth production setup
- Troubleshooting tips
- Cost optimization strategies

## 📄 License

MIT License - feel free to use this project for learning and development.

---

**Note**: Remember to keep your `.env` file secure and never commit it to version control. Use `.env.example` as a template.
