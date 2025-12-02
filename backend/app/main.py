"""
FastAPI Main Application

This is the entry point for the Gmail Automation backend API.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    
    Startup:
    - Connect to MongoDB Atlas
    - Initialize database indexes
    
    Shutdown:
    - Close MongoDB connection
    """
    # Startup
    print("\n" + "="*60)
    print("🚀 Starting Gmail Automation API Server")
    print("="*60)
    
    try:
        await connect_to_mongo()
        print("="*60)
        print("✅ Server startup complete!")
        print("="*60 + "\n")
    except Exception as e:
        print("="*60)
        print(f"❌ Server startup failed: {e}")
        print("="*60 + "\n")
        raise
    
    yield
    
    # Shutdown
    print("\n" + "="*60)
    print("🛑 Shutting down Gmail Automation API Server")
    print("="*60)
    await close_mongo_connection()
    print("✅ Server shutdown complete!")
    print("="*60 + "\n")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered Gmail automation with natural language commands",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint - Health check"""
    return {
        "message": "Gmail Automation API",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected"
    }


# Include API routers
from app.api.routes import auth, emails, chat

app.include_router(auth.router, prefix="/api/v1")
app.include_router(emails.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
