import sys, os
sys.path.append(r'a:\Project\SentiNaut\backend')
from config import config
from pymongo import MongoClient

client = MongoClient(config.MONGODB_URI)
db = client.sentinaut
for p in db.properties.find():
    print(f"DB Name: {p.get('name')}, Plan: {p.get('plan')}, Owner: {p.get('owner_email')}")
