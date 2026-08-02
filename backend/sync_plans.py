import sys, os
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['sentinaut']

owners_with_multi = db.properties.find({"plan": {"$in": ["multi", "enterprise", "resort"]}})
owner_emails = set(p.get("owner_email") for p in owners_with_multi if p.get("owner_email"))

print(f"Found owners with multi plan: {owner_emails}")

for email in owner_emails:
    db.properties.update_many({"owner_email": email}, {"$set": {"plan": "multi"}})
    print(f"Updated all properties for {email} to multi")
