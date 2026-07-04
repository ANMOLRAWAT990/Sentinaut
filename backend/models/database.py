from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB URI
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")

# Initialize MongoDB Client with a 2-second timeout for demo purposes
client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000)

# Connect to the sentinaut database
db = client.sentinaut

# Collections
reviews_collection = db.reviews
actions_collection = db.actions
users_collection = db.users
properties_collection = db.properties
checkouts_collection = db.checkouts
invites_collection = db.invites
notifications_collection = db.notifications
