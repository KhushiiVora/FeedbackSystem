import motor.motor_asyncio
from app.config import settings

# MongoDB connection
client = motor.motor_asyncio.AsyncIOMotorClient(settings.mongodb_url)
db = client[settings.database_name]

async def connect_to_mongo():
    """Create database connection"""
    try:
        # Test the connection
        await client.admin.command('ping')
        print("Successfully connected to MongoDB Atlas!")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    client.close()