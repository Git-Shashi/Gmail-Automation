"""
MongoDB Database Connection and Configuration

This file manages the MongoDB Atlas connection using Motor (async MongoDB driver).

Purpose:
- Establish connection to MongoDB Atlas
- Provide database instance to other modules
- Handle connection lifecycle (startup/shutdown)
- Configure database settings

Connection Flow:
1. App starts -> connect_to_mongo() called
2. Motor client connects to Atlas
3. Database instance becomes available
4. App shuts down -> close_mongo_connection() called

Usage in other files:
```python
from app.core.database import get_database

db = await get_database()
users_collection = db.users
user = await users_collection.find_one({"email": email})
```
"""

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

# Global MongoDB client and database instances
mongodb_client: AsyncIOMotorClient = None
mongodb: AsyncIOMotorDatabase = None


async def connect_to_mongo():
    """
    Connect to MongoDB Atlas on application startup.
    
    This is called in main.py lifespan context manager.
    Creates a Motor client and connects to the specified database.
    """
    global mongodb_client, mongodb
    
    try:
        print("🔄 Attempting to connect to MongoDB Atlas...")
        print(f"📍 Database Name: {settings.DATABASE_NAME}")
        print(f"🔗 Connection URL: {settings.MONGODB_URL[:50]}...")  # Print first 50 chars only
        
        # Create Motor client with MongoDB Atlas connection string
        mongodb_client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            maxPoolSize=10,  # Max concurrent connections
            minPoolSize=1,   # Min connections in pool
            serverSelectionTimeoutMS=5000  # 5 second timeout
        )
        
        # Get database instance
        mongodb = mongodb_client[settings.DATABASE_NAME]
        print(f"✅ Motor client created successfully")
        
        # Test connection by pinging
        print("🔄 Testing connection with ping command...")
        result = await mongodb.command("ping")
        print(f"✅ Ping successful: {result}")
        
        # List existing collections
        collections = await mongodb.list_collection_names()
        print(f"📦 Existing collections: {collections if collections else 'None (new database)'}")
        
        print(f"✅ Successfully connected to MongoDB Atlas database: {settings.DATABASE_NAME}")
        
        # Create indexes for better query performance
        await create_indexes()
        
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        print(f"❌ Error type: {type(e).__name__}")
        print(f"❌ Error details: {str(e)}")
        raise


async def close_mongo_connection():
    """
    Close MongoDB connection on application shutdown.
    
    This is called in main.py lifespan context manager.
    Properly closes all connections in the pool.
    """
    global mongodb_client
    
    if mongodb_client:
        mongodb_client.close()
        print("✅ MongoDB connection closed")


async def get_database() -> AsyncIOMotorDatabase:
    """
    Get the MongoDB database instance.
    
    This is used as a dependency in FastAPI routes.
    
    Returns:
        AsyncIOMotorDatabase instance
        
    Usage:
        @router.get("/users")
        async def get_users(db = Depends(get_database)):
            users = await db.users.find().to_list(100)
            return users
    """
    return mongodb


async def create_indexes():
    """
    Create database indexes for optimized queries.
    
    Indexes improve query performance on frequently searched fields.
    """
    try:
        # Users collection indexes
        await mongodb.users.create_index("email", unique=True)  # Unique email
        await mongodb.users.create_index("google_id", unique=True)  # Unique Google ID
        
        # Conversations collection indexes
        await mongodb.conversations.create_index("user_id")  # Find by user
        await mongodb.conversations.create_index([("user_id", 1), ("updated_at", -1)])  # Recent conversations
        
        print("✅ Database indexes created")
        
    except Exception as e:
        print(f"⚠️  Warning: Could not create indexes: {e}")
