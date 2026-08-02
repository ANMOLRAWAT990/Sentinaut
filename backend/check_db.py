import sys, os
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['sentinaut']
for p in db.properties.find():
    print(f"Name: {p.get('name')}, Plan: {p.get('plan')}, Owner: {p.get('owner_email')}")
