import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")

print("="*50)
print(f"Attempting to connect to MongoDB at: {MONGODB_URI}")
print("="*50)

try:
    # Initialize with a 3-second timeout so it doesn't hang forever if offline
    client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=3000)
    
    # Ping the database
    client.admin.command('ping')
    print("SUCCESS: Connected to MongoDB successfully!")
    
    db = client.sentinaut
    collections = db.list_collection_names()
    print(f"Database 'sentinaut' selected. Existing Collections: {collections}")
    
    print("\nEverything is well connected!")
except Exception as e:
    print(f"FAILURE: Could not connect to MongoDB.")
    print(f"Error Details: {e}")
    print("\nPlease ensure your MongoDB server is running (either locally or via MongoDB Atlas).")
