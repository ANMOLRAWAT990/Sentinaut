import requests
import json
import time

API_URL = "http://127.0.0.1:8000/api/reviews"

# Sample batch of reviews to simulate a sudden influx of guest feedback
batch_reviews = [
    {
        "guestName": "Michael Scott",
        "platform": "Google",
        "text": "The conference room was great, but the catering was slightly delayed. Overall, a solid corporate stay.",
        "sentiment": "Neutral",
        "tags": ["Corporate", "Food", "Facilities"],
        "status": "Pending",
        "property": "The Oberoi",
        "replied": False
    },
    {
        "guestName": "Dwight Schrute",
        "platform": "TripAdvisor",
        "text": "Unacceptable security. Anyone could just walk into the lobby. I demanded a room change immediately.",
        "sentiment": "Negative",
        "tags": ["Security", "Lobby"],
        "status": "Pending",
        "property": "The Oberoi",
        "replied": False
    },
    {
        "guestName": "Jim Halpert",
        "platform": "Booking.com",
        "text": "Room was incredible. My wife loved the anniversary surprise the staff set up on the bed!",
        "sentiment": "Positive",
        "tags": ["Experience", "Staff", "Room"],
        "status": "Pending",
        "property": "The Oberoi",
        "replied": False
    }
]

print(f"Starting batch insertion of {len(batch_reviews)} reviews to {API_URL}...\n")

for i, review in enumerate(batch_reviews):
    print(f"[{i+1}/{len(batch_reviews)}] Posting review by {review['guestName']}...")
    try:
        response = requests.post(API_URL, json=review)
        if response.status_code == 201:
            print("  -> Success!")
        else:
            print(f"  -> Failed: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"  -> Error: {e}")
    
    # Tiny sleep to mimic realistic network requests
    time.sleep(0.5)

print("\nBatch insertion complete! Check the SentiNaut dashboard to see them appear.")
