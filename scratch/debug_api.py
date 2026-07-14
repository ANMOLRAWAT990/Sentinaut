import urllib.request
import json

base_url = "https://sentinaut-backend.onrender.com/api"

try:
    req = urllib.request.Request(f"{base_url}/properties")
    with urllib.request.urlopen(req) as response:
        print("Properties:", response.read().decode('utf-8')[:500])

    req2 = urllib.request.Request(f"{base_url}/reviews")
    with urllib.request.urlopen(req2) as response:
        print("\nReviews sample:", response.read().decode('utf-8')[:1000])

except Exception as e:
    print(f"Error: {e}")
