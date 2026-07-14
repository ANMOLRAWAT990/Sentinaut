import urllib.request
import urllib.parse
import json

base_url = "https://sentinaut-backend.onrender.com/api"

try:
    url = f"{base_url}/reviews?property=lakers%20devine"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        print(f"Reviews for lakers devine: {len(data)}")

except Exception as e:
    print(f"Error: {e}")
