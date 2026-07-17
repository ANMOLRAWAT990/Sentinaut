# Prompt Engineering Log

## System Prompt & Role
For my final implementation, I used the following System Persona/Role to guide the Gemini model:
**"You are an expert hospitality analyst."**
I used this persona so the model would understand hotel-specific context and use correct terminology (like distinguishing between "Service" and "Operations" when tagging reviews).

---

## Task: Guest Review Classification & Information Extraction
The main goal of my prompt was to take a raw hotel guest review and extract its **Sentiment**, relevant **Tags**, and a **Suggested Action** if there was a complaint.

### Variation 1: Basic Unstructured Prompt
**Prompt:**
```text
Please read the following reviews and tell me the sentiment, tags, and if I should do anything about it.
Reviews: [User Reviews...]
```
**Example Input:**
"The AC in room 204 was broken and the front desk staff was rude when I complained."
**Example Output:**
"The sentiment is negative. The tags are AC, Front Desk. You should fix the AC and talk to the staff."
**Result:** This didn't work well. The output was just a normal conversational sentence, which made it impossible for my Python backend to parse it and save it into the MongoDB database.

---

### Variation 2: Basic JSON Prompt
**Prompt:**
```text
Analyze these hotel reviews and return a JSON array containing the sentiment (Positive/Negative/Neutral), tags, and an action item.
Reviews: [User Reviews...]
```
**Example Input:**
"The AC in room 204 was broken and the front desk staff was rude when I complained."
**Example Output:**
```json
[
  {
    "sentiment": "Negative",
    "tags": ["Maintenance", "Staff"],
    "action_item": "Fix AC and discipline staff."
  }
]
```
**Result:** This was better because returning JSON allowed my backend to parse the data. However, the `action_item` was sometimes way too dramatic ("discipline staff"), and the tags were completely random every time, which made filtering the dashboard later very difficult.

---

### Variation 3: Persona + Strict JSON Schema (Final Version in Codebase)
**Prompt:**
```text
You are an expert hospitality analyst. I will provide a batch of guest reviews.
For each review, determine:
1. Sentiment: "Positive", "Negative", or "Neutral"
2. Tags: Select the most relevant tags from the provided custom tags list. If none fit, use general tags like "Experience", "Service", "Operations".
3. Suggested Action: If the review is Negative and mentions a specific problem (e.g. broken AC, rude staff), suggest a short, actionable task for the staff (e.g. "Inspect AC in Room 204"). Otherwise, set it to an empty string.

Custom Tags available: {custom_tags}
Reviews: {reviews}

You must return a JSON array of objects, one for each review in the exact same order. Each object must follow this schema:
{{
  "sentiment": "Positive|Negative|Neutral",
  "tags": ["Tag1", "Tag2"],
  "suggested_action": "string or empty"
}}
```
**Example Input:**
"The AC in room 204 was broken and the front desk staff was rude when I complained."
**Example Output:**
```json
[
  {
    "sentiment": "Negative",
    "tags": ["Operations", "Service"],
    "suggested_action": "Inspect AC in Room 204 and review guest interaction with front desk."
  }
]
```

### Which one worked best and why?
**Variation 3** worked the best and is what I actually implemented in my `backend/services/ai_service.py` file. Giving the model the "hospitality analyst" persona made the tags match standard hotel vocabulary much better. Also, explicitly writing out the exact JSON schema structure (`sentiment`, `tags`, `suggested_action`) made sure my backend parsing never crashed. Finally, adding a specific rule for negative actions stopped the AI from inventing unnecessary tasks for positive reviews.
