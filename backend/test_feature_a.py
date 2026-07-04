from services.ai_service import AIService
import json

ai = AIService()
texts = [
    "The room was amazing but the AC was loud and broken",
    "Staff was super friendly. I loved the breakfast."
]
custom_tags = ["Room Quality", "Service", "Cleanliness", "Food"]

try:
    results = ai.classify_review_batch(texts, custom_tags)
    print(json.dumps(results, indent=2))
except Exception as e:
    print(f"FAILED: {e}")
