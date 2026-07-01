from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from bson.objectid import ObjectId
from bson.errors import InvalidId
import bcrypt
from models.database import reviews_collection, actions_collection, users_collection, properties_collection
from models.schemas import Review, Action, Property, SignupRequest, LoginRequest, UserResponse

app = FastAPI(title="SentiNaut Backend API")

# Configure CORS so the React frontend can communicate with it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=False,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

def review_helper(review) -> dict:
    return {
        "id": str(review["_id"]),
        "guestName": review.get("guestName"),
        "platform": review.get("platform"),
        "text": review.get("text"),
        "sentiment": review.get("sentiment", "Neutral"),
        "tags": review.get("tags", []),
        "status": review.get("status", "Pending")
    }

# 1. GET /api/reviews - list all reviews
@app.get("/api/reviews", response_model=List[Review])
def get_reviews(property: Optional[str] = None):
    query = {}
    if property:
        query["property"] = property
    reviews = []
    for review in reviews_collection.find(query):
        reviews.append(review_helper(review))
    return reviews

# 2. GET /api/reviews/search?q=... - search reviews
@app.get("/api/reviews/search", response_model=List[Review])
def search_reviews(q: str = Query(..., description="Search query")):
    query = {"$regex": q, "$options": "i"}
    db_query = {
        "$or": [
            {"guestName": query},
            {"text": query},
            {"tags": query}
        ]
    }
    reviews = []
    for review in reviews_collection.find(db_query):
        reviews.append(review_helper(review))
    return reviews

# 3. GET /api/reviews/{id} - get a single review
@app.get("/api/reviews/{id}", response_model=Review)
def get_review(id: str):
    try:
        review = reviews_collection.find_one({"_id": ObjectId(id)})
    except InvalidId:
        review = reviews_collection.find_one({"id": id})
        
    if review:
        return review_helper(review)
    raise HTTPException(status_code=404, detail="Review not found")

# 4. POST /api/reviews - create a review
@app.post("/api/reviews", response_model=Review, status_code=201)
def create_review(review: Review):
    review_dict = review.model_dump(exclude={"id"})
    new_review = reviews_collection.insert_one(review_dict)
    created_review = reviews_collection.find_one({"_id": new_review.inserted_id})
    return review_helper(created_review)

# 5. PUT /api/reviews/{id} - update a review
@app.put("/api/reviews/{id}", response_model=Review)
def update_review(id: str, updated_review: Review):
    review_dict = updated_review.model_dump(exclude={"id"})
    
    try:
        filter_query = {"_id": ObjectId(id)}
    except InvalidId:
        filter_query = {"id": id}

    update_result = reviews_collection.update_one(filter_query, {"$set": review_dict})
    
    if update_result.modified_count == 1 or update_result.matched_count == 1:
        updated = reviews_collection.find_one(filter_query)
        if updated:
            return review_helper(updated)
            
    raise HTTPException(status_code=404, detail="Review not found")

# 6. DELETE /api/reviews/{id} - delete a review
@app.delete("/api/reviews/{id}", status_code=204)
def delete_review(id: str):
    try:
        filter_query = {"_id": ObjectId(id)}
    except InvalidId:
        filter_query = {"id": id}
        
    delete_result = reviews_collection.delete_one(filter_query)
    if delete_result.deleted_count == 1:
        return
    raise HTTPException(status_code=404, detail="Review not found")

# --- Actions API ---

def action_helper(action) -> dict:
    _id = action.get("_id")
    action_id = str(_id) if _id else str(action.get("id"))
    return {
        "id": action_id,
        "task": action.get("task"),
        "status": action.get("status")
    }

@app.get("/api/actions", response_model=List[Action])
def get_actions(property: Optional[str] = None):
    query = {}
    if property:
        query["property"] = property
    actions = []
    for action in actions_collection.find(query):
        actions.append(action_helper(action))
    return actions

@app.post("/api/actions", response_model=Action, status_code=201)
def create_action(action: Action):
    action_dict = action.model_dump(exclude={"id"})
    new_action = actions_collection.insert_one(action_dict)
    created_action = actions_collection.find_one({"_id": new_action.inserted_id})
    return action_helper(created_action)

@app.put("/api/actions/{id}", response_model=Action)
def update_action(id: str, updated_action: Action):
    action_dict = updated_action.model_dump(exclude={"id"})
    
    try:
        filter_query = {"_id": ObjectId(id)}
    except InvalidId:
        filter_query = {"id": id}
            
    update_result = actions_collection.update_one(filter_query, {"$set": action_dict})
    
    if update_result.modified_count == 1 or update_result.matched_count == 1:
        updated = actions_collection.find_one(filter_query)
        if updated:
            return action_helper(updated)
            
    raise HTTPException(status_code=404, detail="Action not found")

@app.get("/")
def read_root():
    return {"message": "Welcome to SentiNaut API"}

# --- Properties API ---

def property_helper(prop) -> dict:
    return {
        "id": str(prop["_id"]),
        "name": prop.get("name"),
        "location": prop.get("location"),
        "status": prop.get("status", "Active"),
        "owner_email": prop.get("owner_email")
    }

@app.get("/api/properties", response_model=List[Property])
def get_properties(owner_email: Optional[str] = None):
    query = {}
    if owner_email:
        query["owner_email"] = owner_email
    props = []
    for prop in properties_collection.find(query):
        props.append(property_helper(prop))
    return props

@app.post("/api/properties", response_model=Property, status_code=201)
def create_property(prop: Property):
    prop_dict = prop.model_dump(exclude={"id"})
    new_prop = properties_collection.insert_one(prop_dict)
    created_prop = properties_collection.find_one({"_id": new_prop.inserted_id})
    return property_helper(created_prop)


# ============================================================
# AUTH API  (signup / login — DB backed, no JWT this week)
# ============================================================
VALID_ROLES = ["staff", "manager", "owner"]


def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user.get("name"),
        "email": user.get("email"),
        "role": user.get("role"),
        "property": user.get("property", "Unassigned")
    }


@app.post("/api/auth/signup", status_code=201)
def signup(data: SignupRequest):
    if data.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {VALID_ROLES}")

    # Check duplicate email
    if users_collection.find_one({"email": data.email}):
        raise HTTPException(status_code=409, detail="An account with this email already exists.")

    hashed = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = {
        "name": data.name,
        "email": data.email,
        "password": hashed,
        "role": data.role,
        "property": data.property,
    }
    result = users_collection.insert_one(new_user)
    created = users_collection.find_one({"_id": result.inserted_id})
    return {"message": "Account created successfully", "user": user_helper(created)}

@app.get("/api/users", response_model=List[UserResponse])
def get_users(role: Optional[str] = None, owner_email: Optional[str] = None, property: Optional[str] = None):
    query = {}
    if role:
        query["role"] = role
    if property:
        query["property"] = property
    elif owner_email:
        # To get managers for an owner, we find all properties owned by them and filter by those properties.
        owned_props = [p["name"] for p in properties_collection.find({"owner_email": owner_email})]
        query["property"] = {"$in": owned_props}
    users = []
    for user in users_collection.find(query):
        u = user_helper(user)
        name_parts = str(u["name"]).split() if u.get("name") else []
        u["initials"] = "".join([p[0].upper() for p in name_parts[:2]]) if name_parts else "U"
        users.append(u)
    return users


@app.post("/api/auth/login")
def login(data: LoginRequest):
    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if not bcrypt.checkpw(data.password.encode('utf-8'), user["password"].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    if user.get("role") != data.role:
        raise HTTPException(status_code=403, detail=f"Access denied: This account does not have {data.role} privileges.")

    return {"message": "Login successful", "user": user_helper(user)}


# --- Analytics & AI API ---
import random

@app.post("/api/reviews/analyze")
def analyze_reviews(payload: dict):
    is_batch = "batch" in payload
    texts = payload.get("batch") if is_batch else [payload.get("text")]
    if not texts or not texts[0]:
        raise HTTPException(status_code=400, detail="No text provided")
    
    saved_reviews = []
    positive_count = 0
    for text in texts:
        sentiment = "Positive" if "good" in text.lower() or "great" in text.lower() or "love" in text.lower() else "Negative"
        if sentiment == "Positive":
            positive_count += 1
        tags = ["Experience"] if sentiment == "Positive" else ["Operations", "Service"]
        review = {
            "guestName": "Batch Processing" if is_batch else "Direct Analysis",
            "platform": "Internal",
            "text": text,
            "sentiment": sentiment,
            "tags": tags,
            "status": "Pending",
            "property": payload.get("property", "Unassigned")
        }
        res = reviews_collection.insert_one(review)
        review["_id"] = res.inserted_id
        saved_reviews.append(review_helper(review))
    
    if is_batch:
        actions = []
        if positive_count < len(texts):
            action_doc = {"task": "Review negative themes identified in recent batch upload", "status": "Pending", "property": payload.get("property", "Unassigned")}
            res = actions_collection.insert_one(action_doc)
            action_doc["_id"] = res.inserted_id
            actions.append(action_helper(action_doc))
            
        return {
            "reviews": saved_reviews,
            "rootCauses": ["Analyzed themes from batch ingestion."],
            "working": ["Sentiment classification pipeline completed."],
            "actions": [a["task"] for a in actions]
        }
    else:
        return {
            "review": saved_reviews[0],
            "confidence": "94%",
            "themes": saved_reviews[0]["tags"],
            "reply": f"Thank you for your feedback! We noticed you mentioned: '{texts[0][:30]}...' We are reviewing your comments closely."
        }


@app.get("/api/analytics")
def get_analytics(owner_email: Optional[str] = None, property: Optional[str] = None):
    query = {}
    if property:
        query["property"] = property
    elif owner_email:
        owned_props = [p["name"] for p in properties_collection.find({"owner_email": owner_email})]
        query["property"] = {"$in": owned_props}
        
    all_reviews = list(reviews_collection.find(query))
    total = len(all_reviews)
    positive = sum(1 for r in all_reviews if r.get("sentiment") == "Positive")
    pos_pct = round((positive / total * 100) if total > 0 else 0)
    
    base_score = pos_pct / 10 if total > 0 else 8.5
    chart_data = {
        "7days": [{"name": f"Day {i}", "score": round(max(0, min(10, base_score + random.uniform(-0.5, 0.5))), 1)} for i in range(1, 8)],
        "30days": [{"name": f"Week {i}", "score": round(max(0, min(10, base_score + random.uniform(-0.3, 0.3))), 1)} for i in range(1, 5)]
    }

    return {
        "healthScore": round(base_score, 1),
        "totalReviews": total,
        "positiveSentimentPct": pos_pct,
        "chartData": chart_data
    }
