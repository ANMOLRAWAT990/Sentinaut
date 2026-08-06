import sys
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
for db_name in client.list_database_names():
    db = client[db_name]
    if 'properties' in db.list_collection_names():
        for p in db.properties.find():
            print(f"DB: {db_name}, Name: {p.get('name')}, Plan: {p.get('plan')}, Owner: {p.get('owner_email')}")
