import urllib.request
import urllib.parse
import json

base_url = "https://sentinaut-backend.onrender.com/api"
email = "anmolrawat1509@gmail.com"

try:
    url = f"{base_url}/analytics?owner_email={urllib.parse.quote(email)}"
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as response:
        print("Analytics (All Properties):", response.read().decode('utf-8'))

    url2 = f"{base_url}/analytics?owner_email={urllib.parse.quote(email)}&property=lakers%20devine"
    req2 = urllib.request.Request(url2)
    with urllib.request.urlopen(req2) as response:
        print("\nAnalytics (lakers devine):", response.read().decode('utf-8'))

except Exception as e:
    print(f"Error: {e}")
