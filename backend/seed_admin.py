import os
from pymongo import MongoClient
import bcrypt
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client.get_database("sentinaut")
users = db.get_collection("users")

email = "admin@sentinaut.com"
password = "sentinaut_admin"
hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Delete existing admin if any
users.delete_many({"email": email})

new_user = {
    "name": "System Administrator",
    "email": email,
    "password": hashed,
    "role": "admin",
    "property": "System",
    "is_active": True,
    "dark_mode": False
}

users.insert_one(new_user)
print("Admin user seeded successfully.")
