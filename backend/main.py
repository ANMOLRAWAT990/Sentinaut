from fastapi import FastAPI, HTTPException, Request, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from bson.objectid import ObjectId
from bson.errors import InvalidId
import bcrypt
from models.database import reviews_collection, actions_collection, users_collection, properties_collection, checkouts_collection, invites_collection, notifications_collection, insights_collection, competitors_collection
from models.schemas import Review, Action, Property, SignupRequest, LoginRequest, UserResponse, Checkout, UserUpdate, PropertyUpdate, Notification
from datetime import datetime, timedelta
import uuid

import jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from config import config

app = FastAPI(title="SentiNaut Backend API")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

security = HTTPBearer(auto_error=False)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = credentials.credentials
    try:
        secret = getattr(config, 'JWT_SECRET', 'super_secret_key_change_me')
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles

    def __call__(self, payload: dict = Depends(verify_token)):
        if payload.get("role") not in self.allowed_roles:
            raise HTTPException(status_code=403, detail="Operation not permitted")
            
allow_owner = RoleChecker(["owner"])
allow_manager_or_owner = RoleChecker(["owner", "manager"])


# Configure CORS so the React frontend can communicate with it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
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
        "status": review.get("status", "Pending"),
        "property": review.get("property", "Unassigned"),
        "replied": review.get("replied", False),
        "translated_text": review.get("translated_text"),
        "created_at": review.get("created_at")
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
    if not review.created_at:
        review.created_at = datetime.utcnow().isoformat()
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
        "status": action.get("status"),
        "property": action.get("property", "Unassigned"),
        "assigned_to": action.get("assigned_to"),
        "priority": action.get("priority", "Medium"),
        "created_at": action.get("created_at"),
        "completed_at": action.get("completed_at"),
        "notes": action.get("notes", []),
        "is_archived": action.get("is_archived", False)
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
    if not action.created_at:
        action.created_at = datetime.utcnow().isoformat()
    if action.status == "Done" and not action.completed_at:
        action.completed_at = datetime.utcnow().isoformat()
    action_dict = action.model_dump(exclude={"id"})
    new_action = actions_collection.insert_one(action_dict)
    created_action = actions_collection.find_one({"_id": new_action.inserted_id})
    return action_helper(created_action)

@app.put("/api/actions/{id}", response_model=Action)
def update_action(id: str, updated_action: Action):
    if updated_action.status == "Done" and not updated_action.completed_at:
        updated_action.completed_at = datetime.utcnow().isoformat()
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
        "owner_email": prop.get("owner_email"),
        "is_active": prop.get("is_active", True),
        "custom_tags": prop.get("custom_tags", [])
    }

@app.get("/api/properties", response_model=List[Property])
def get_properties(owner_email: Optional[str] = None):
    query = {"is_active": {"$ne": False}}
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
        "property": user.get("property", "Unassigned"),
        "is_active": user.get("is_active", True),
        "dark_mode": user.get("dark_mode", False)
    }


@app.post("/api/auth/register", status_code=201)
@limiter.limit("5/15minute")
def register(request: Request, data: SignupRequest):
    if data.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {VALID_ROLES}")

    # Check duplicate email
    if users_collection.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    hashed = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = {
        "name": data.name,
        "email": data.email,
        "password": hashed,
        "role": data.role,
        "property": data.property,
        "is_active": True,
        "dark_mode": False
    }
    result = users_collection.insert_one(new_user)
    created = users_collection.find_one({"_id": result.inserted_id})
    return {"message": "Account created successfully", "user": user_helper(created)}

@app.get("/api/users", response_model=List[UserResponse])
def get_users(role: Optional[str] = None, owner_email: Optional[str] = None, property: Optional[str] = None, token_payload = Depends(verify_token)):
    query = {"is_active": {"$ne": False}}
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
@limiter.limit("5/15minute")
def login(request: Request, data: LoginRequest):
    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    # Check if account is locked
    locked_until_str = user.get("locked_until")
    if locked_until_str:
        try:
            locked_until = datetime.fromisoformat(locked_until_str)
            if datetime.utcnow() < locked_until:
                raise HTTPException(status_code=403, detail="Account is locked due to too many failed attempts. Please try again later.")
        except ValueError:
            pass

    if not bcrypt.checkpw(data.password.encode('utf-8'), user["password"].encode('utf-8')):
        attempts = user.get("invalid_login_attempts", 0) + 1
        update_data = {"invalid_login_attempts": attempts}
        if attempts >= 3:
            update_data["locked_until"] = (datetime.utcnow() + timedelta(minutes=15)).isoformat()
        
        users_collection.update_one({"_id": user["_id"]}, {"$set": update_data})
        
        if attempts >= 3:
            raise HTTPException(status_code=403, detail="Account is locked due to too many failed attempts. Please try again later.")
        else:
            raise HTTPException(status_code=401, detail=f"Invalid email or password. You have {3 - attempts} attempt(s) left.")

    # Reset attempts on successful login
    if user.get("invalid_login_attempts", 0) > 0 or user.get("locked_until"):
        users_collection.update_one({"_id": user["_id"]}, {"$unset": {"invalid_login_attempts": "", "locked_until": ""}})

    if user.get("role") != data.role:
        raise HTTPException(status_code=403, detail=f"Access denied: This account does not have {data.role} privileges.")

    # Create JWT
    secret = getattr(config, 'JWT_SECRET', 'super_secret_key_change_me')
    expiry = datetime.utcnow() + timedelta(days=7)
    payload = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "exp": expiry
    }
    token = jwt.encode(payload, secret, algorithm="HS256")

    return {"message": "Login successful", "token": token, "user": user_helper(user)}



# --- Analytics & AI API ---
from services.ai_service import AIService

ai = AIService()

@app.post("/api/reviews/analyze")
def analyze_reviews(payload: dict):
    is_batch = "batch" in payload
    texts = payload.get("batch") if is_batch else [payload.get("text")]
    if not texts or not texts[0]:
        raise HTTPException(status_code=400, detail="No text provided")
    
    prop_name = payload.get("property", "Unassigned")
    prop = properties_collection.find_one({"name": prop_name})
    custom_tags = prop.get("custom_tags", []) if prop else []

    saved_reviews = []
    actions = []
    positive_count = 0
    
    CHUNK_SIZE = 20
    for i in range(0, len(texts), CHUNK_SIZE):
        chunk_texts = texts[i:i+CHUNK_SIZE]
        try:
            results = ai.classify_review_batch(chunk_texts, custom_tags)
            if not isinstance(results, list) or len(results) != len(chunk_texts):
                raise ValueError("LLM returned malformed data")
        except Exception as e:
            # Graceful degradation on failure
            print(f"AI Classification failed: {e}")
            results = [{"sentiment": "Pending", "tags": ["Unclassified"], "suggested_action": ""} for _ in chunk_texts]
            
        for text, res in zip(chunk_texts, results):
            sentiment = res.get("sentiment", "Pending")
            tags = res.get("tags", [])
            suggested_action = res.get("suggested_action", "")
            
            if sentiment == "Positive":
                positive_count += 1
                
            review = {
                "guestName": "Batch Processing" if is_batch else "Direct Analysis",
                "platform": "Internal",
                "text": text,
                "sentiment": sentiment,
                "tags": tags,
                "status": "Pending",
                "property": prop_name,
                "created_at": datetime.utcnow().isoformat()
            }
            db_res = reviews_collection.insert_one(review)
            review["_id"] = db_res.inserted_id
            saved_reviews.append(review_helper(review))
            
            if suggested_action and sentiment == "Negative":
                action_doc = {
                    "task": suggested_action, 
                    "status": "Pending", 
                    "property": prop_name, 
                    "assigned_to": None,
                    "priority": "High",
                    "created_at": datetime.utcnow().isoformat()
                }
                act_res = actions_collection.insert_one(action_doc)
                action_doc["_id"] = act_res.inserted_id
                actions.append(action_helper(action_doc))

    if is_batch:
        return {
            "reviews": saved_reviews,
            "rootCauses": ["Analyzed themes from batch ingestion via AI."],
            "working": ["Sentiment classification pipeline completed."],
            "actions": [a["task"] for a in actions]
        }
    else:
        return {
            "review": saved_reviews[0],
            "confidence": "AI Classified",
            "themes": saved_reviews[0]["tags"],
            "reply": f"Thank you for your feedback! We noticed you mentioned: '{texts[0][:30]}...' We are reviewing your comments closely."
        }

@app.post("/api/reviews/{id}/draft-reply")
def draft_reply(id: str):
    try:
        filter_query = {"_id": ObjectId(id)}
    except InvalidId:
        filter_query = {"id": id}
    review = reviews_collection.find_one(filter_query)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    try:
        draft = ai.draft_reply(review.get("text", ""), review.get("sentiment", "Neutral"))
        return {"draft": draft}
    except Exception as e:
        raise HTTPException(status_code=503, detail="AI service unavailable. Please draft manually.")

@app.post("/api/reviews/{id}/translate")
def translate_review(id: str):
    try:
        filter_query = {"_id": ObjectId(id)}
    except InvalidId:
        filter_query = {"id": id}
    review = reviews_collection.find_one(filter_query)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
        
    if review.get("translated_text"):
        return {"translated_text": review["translated_text"]}
        
    try:
        translated = ai.translate_text(review.get("text", ""))
        reviews_collection.update_one(filter_query, {"$set": {"translated_text": translated}})
        return {"translated_text": translated}
    except Exception as e:
        raise HTTPException(status_code=503, detail="AI service unavailable.")

@app.get("/api/insights")
def get_insights(property: str):
    insight = insights_collection.find_one({"property": property}, sort=[("created_at", -1)])
    if not insight:
        return {"summary": "No insights available yet.", "anomalies": [], "tasks": []}
    insight.pop("_id", None)
    return insight

@app.post("/api/insights/generate")
def generate_insights(property: str):
    all_reviews = list(reviews_collection.find({"property": property}))
    positive = sum(1 for r in all_reviews if r.get("sentiment") == "Positive")
    total = len(all_reviews)
    pos_pct = round((positive / total * 100) if total > 0 else 0)
    data_summary = {"total_reviews": total, "positive_pct": pos_pct}
    
    try:
        insights = ai.generate_strategic_insights(data_summary)
        insights["property"] = property
        insights["created_at"] = datetime.utcnow().isoformat()
        insights_collection.insert_one(insights)
        insights.pop("_id", None)
        return insights
    except Exception as e:
        raise HTTPException(status_code=503, detail="AI service unavailable.")

@app.get("/api/competitors/summary")
def get_competitor_summary(property: str):
    comp = competitors_collection.find_one({"property": property}, sort=[("created_at", -1)])
    if not comp:
        return {"summary": "No competitor data available yet. Please wait for the scheduled refresh."}
    return {"summary": comp["summary"]}

@app.post("/api/competitors/refresh")
def refresh_competitors(property: str):
    if not config.OUTSCRAPER_API_KEY:
        raise HTTPException(status_code=501, detail="Outscraper API is not configured.")
        
    mock_data = {"competitor_rating": 4.1, "our_rating": 4.5}
    try:
        summary = ai.summarize_competitors(mock_data)
        doc = {
            "property": property,
            "summary": summary,
            "created_at": datetime.utcnow().isoformat()
        }
        competitors_collection.insert_one(doc)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=503, detail="AI service unavailable.")


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
    
    now = datetime.utcnow()
    # Chart Data Calculation
    chart_data_7days = []
    chart_data_30days = []
    
    # Calculate period-over-period
    last_7_days = []
    prev_7_days = []
    
    for r in all_reviews:
        if not r.get("created_at"):
            continue
        try:
            r_date = datetime.fromisoformat(r["created_at"])
            days_ago = (now - r_date).days
            if days_ago < 7:
                last_7_days.append(r)
            elif days_ago < 14:
                prev_7_days.append(r)
        except ValueError:
            pass

    last_7_pos = sum(1 for r in last_7_days if r.get("sentiment") == "Positive")
    prev_7_pos = sum(1 for r in prev_7_days if r.get("sentiment") == "Positive")
    
    last_7_pct = (last_7_pos / len(last_7_days) * 100) if last_7_days else 0
    prev_7_pct = (prev_7_pos / len(prev_7_days) * 100) if prev_7_days else 0
    pop_change = round(last_7_pct - prev_7_pct, 1)

    for i in range(7):
        target_date = now - timedelta(days=i)
        day_reviews = [r for r in last_7_days if datetime.fromisoformat(r["created_at"]).date() == target_date.date()] if last_7_days else []
        day_pos = sum(1 for r in day_reviews if r.get("sentiment") == "Positive")
        score = (day_pos / len(day_reviews) * 10) if day_reviews else (pos_pct / 10 if total > 0 else 8.5)
        chart_data_7days.insert(0, {"name": target_date.strftime("%b %d"), "score": round(score, 1)})
        
    for i in range(4):
        week_start = now - timedelta(days=(i+1)*7)
        week_end = now - timedelta(days=i*7)
        week_reviews = []
        for r in all_reviews:
             if r.get("created_at"):
                 try:
                     r_date = datetime.fromisoformat(r["created_at"])
                     if week_start <= r_date < week_end:
                         week_reviews.append(r)
                 except ValueError:
                     pass
        week_pos = sum(1 for r in week_reviews if r.get("sentiment") == "Positive")
        score = (week_pos / len(week_reviews) * 10) if week_reviews else (pos_pct / 10 if total > 0 else 8.5)
        chart_data_30days.insert(0, {"name": f"Week {4-i}", "score": round(score, 1)})

    chart_data = {
        "7days": chart_data_7days,
        "30days": chart_data_30days
    }

    # SLA Calculation
    all_actions = list(actions_collection.find(query))
    sla_times = []
    for a in all_actions:
        if a.get("status") == "Done" and a.get("created_at") and a.get("completed_at"):
            try:
                c_at = datetime.fromisoformat(a["created_at"])
                done_at = datetime.fromisoformat(a["completed_at"])
                diff_hours = (done_at - c_at).total_seconds() / 3600
                if diff_hours >= 0:
                    sla_times.append(diff_hours)
            except ValueError:
                pass
    sla_avg_hours = round(sum(sla_times) / len(sla_times), 1) if sla_times else 0

    # Conversion Rate Calculation
    all_checkouts = list(checkouts_collection.find(query))
    last_30_checkouts = 0
    last_30_reviews = 0
    for c in all_checkouts:
        if c.get("timestamp"):
            try:
                c_date = datetime.fromisoformat(c["timestamp"])
                if (now - c_date).days < 30:
                    last_30_checkouts += 1
            except ValueError:
                pass
    for r in all_reviews:
        if r.get("created_at"):
             try:
                 r_date = datetime.fromisoformat(r["created_at"])
                 if (now - r_date).days < 30:
                     last_30_reviews += 1
             except ValueError:
                 pass
    conversion_rate = round((last_30_reviews / last_30_checkouts) * 100, 1) if last_30_checkouts > 0 else 0

    base_score = pos_pct / 10 if total > 0 else 8.5

    return {
        "healthScore": round(base_score, 1),
        "totalReviews": total,
        "positiveSentimentPct": pos_pct,
        "chartData": chart_data,
        "periodOverPeriod": pop_change,
        "managerSLA": f"{sla_avg_hours}h",
        "conversionRate": f"{conversion_rate}%"
    }

# --- Checkouts API ---

def checkout_helper(checkout) -> dict:
    return {
        "id": str(checkout["_id"]),
        "guestName": checkout.get("guestName"),
        "phone": checkout.get("phone"),
        "property": checkout.get("property"),
        "timestamp": checkout.get("timestamp")
    }

@app.post("/api/checkouts", response_model=Checkout, status_code=201)
def create_checkout(checkout: Checkout):
    if not checkout.timestamp:
        checkout.timestamp = datetime.utcnow().isoformat()
    checkout_dict = checkout.model_dump(exclude={"id"})
    new_checkout = checkouts_collection.insert_one(checkout_dict)
    created_checkout = checkouts_collection.find_one({"_id": new_checkout.inserted_id})
    return checkout_helper(created_checkout)

@app.get("/api/checkouts", response_model=List[Checkout])
def get_checkouts(property: Optional[str] = None):
    query = {}
    if property:
        query["property"] = property
    checkouts = []
    for c in checkouts_collection.find(query):
        checkouts.append(checkout_helper(c))
    return checkouts


# --- Soft Delete API ---
@app.delete("/api/properties/{id}", status_code=204)
def delete_property(id: str, _ = Depends(allow_owner)):
    try:
        filter_query = {"_id": ObjectId(id)}
    except InvalidId:
        filter_query = {"id": id}
    update_result = properties_collection.update_one(filter_query, {"$set": {"is_active": False}})
    if update_result.modified_count == 1 or update_result.matched_count == 1:
        return
    raise HTTPException(status_code=404, detail="Property not found")

@app.patch("/api/properties/{id}", response_model=Property)
def patch_property(id: str, prop_update: PropertyUpdate):
    try:
        filter_query = {"_id": ObjectId(id)}
    except InvalidId:
        filter_query = {"id": id}
    
    update_data = {k: v for k, v in prop_update.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update.")
        
    update_result = properties_collection.update_one(filter_query, {"$set": update_data})
    if update_result.modified_count == 1 or update_result.matched_count == 1:
        updated = properties_collection.find_one(filter_query)
        return property_helper(updated)
    raise HTTPException(status_code=404, detail="Property not found")

@app.delete("/api/users/{id}", status_code=204)
def delete_user(id: str, _ = Depends(allow_owner)):
    try:
        filter_query = {"_id": ObjectId(id)}
    except InvalidId:
        filter_query = {"id": id}
    update_result = users_collection.update_one(filter_query, {"$set": {"is_active": False}})
    if update_result.modified_count == 1 or update_result.matched_count == 1:
        return
    raise HTTPException(status_code=404, detail="User not found")

@app.patch("/api/users/{id}", response_model=UserResponse)
def patch_user(id: str, user_update: UserUpdate):
    try:
        filter_query = {"_id": ObjectId(id)}
    except InvalidId:
        filter_query = {"id": id}
        
    update_data = {k: v for k, v in user_update.model_dump().items() if v is not None}
    if "password" in update_data:
        update_data["password"] = bcrypt.hashpw(update_data["password"].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided for update.")
        
    update_result = users_collection.update_one(filter_query, {"$set": update_data})
    if update_result.modified_count == 1 or update_result.matched_count == 1:
        updated = users_collection.find_one(filter_query)
        return user_helper(updated)
    raise HTTPException(status_code=404, detail="User not found")

# --- Magic Links / Invites ---
@app.post("/api/auth/invite", status_code=201)
def invite_user(email: str, role: str, property: str = "Unassigned"):
    token = str(uuid.uuid4())
    expiry = (datetime.utcnow() + timedelta(hours=24)).isoformat()
    invite = {
        "email": email,
        "role": role,
        "property": property,
        "token": token,
        "expires_at": expiry
    }
    invites_collection.insert_one(invite)
    
    # Magic Links require SMTP
    if not all([config.SMTP_HOST, config.SMTP_PORT, config.SMTP_USER, config.SMTP_PASSWORD]):
        raise HTTPException(status_code=501, detail="SMTP service is not configured. Cannot send magic links.")
        
    return {"message": "Invite generated and sent via email (mocked).", "token": token}


# --- Notifications API ---
def notification_helper(notif) -> dict:
    return {
        "id": str(notif["_id"]),
        "property": notif.get("property"),
        "message": notif.get("message"),
        "type": notif.get("type", "Info"),
        "is_read": notif.get("is_read", False),
        "created_at": notif.get("created_at")
    }

@app.get("/api/notifications", response_model=List[Notification])
def get_notifications(property: str):
    query = {"property": property}
    notifs = []
    # Sort by created_at descending
    for notif in notifications_collection.find(query).sort("created_at", -1):
        notifs.append(notification_helper(notif))
    return notifs

@app.put("/api/notifications/{id}/read", response_model=Notification)
def mark_notification_read(id: str):
    try:
        filter_query = {"_id": ObjectId(id)}
    except InvalidId:
        filter_query = {"id": id}
    
    update_result = notifications_collection.update_one(filter_query, {"$set": {"is_read": True}})
    if update_result.modified_count == 1 or update_result.matched_count == 1:
        updated = notifications_collection.find_one(filter_query)
        return notification_helper(updated)
    raise HTTPException(status_code=404, detail="Notification not found")

@app.post("/api/notifications", response_model=Notification, status_code=201)
def create_notification(notif: Notification):
    if not notif.created_at:
        notif.created_at = datetime.utcnow().isoformat()
    notif_dict = notif.model_dump(exclude={"id"})
    new_notif = notifications_collection.insert_one(notif_dict)
    created_notif = notifications_collection.find_one({"_id": new_notif.inserted_id})
    return notification_helper(created_notif)

# --- Follow Ups (Mocked) ---
@app.post("/api/followup")
def trigger_followup(guest_phone: str):
    if not all([config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN, config.TWILIO_WHATSAPP_NUMBER]):
        raise HTTPException(status_code=501, detail="Twilio/WhatsApp Business API is not configured.")
        
    return {"message": f"Follow up logic initiated for {guest_phone}."}


from pydantic import BaseModel
class OAuthLoginRequest(BaseModel):
    credential: str
    role: str = "owner"

@app.post("/api/auth/google")
def google_oauth_login(data: OAuthLoginRequest):
    # This is a mock verification since we don't have a real Google Client ID configured
    # In a real app, use `id_token.verify_oauth2_token(data.credential, google_requests.Request(), CLIENT_ID)`
    # We will simulate decoding the credential (which is a JWT returned by @react-oauth/google)
    try:
        # Decode without verification just to extract email for the assignment simulation
        payload = jwt.decode(data.credential, options={"verify_signature": False})
        email = payload.get("email")
        name = payload.get("name")
        
        user = users_collection.find_one({"email": email})
        if not user:
            # Create user on the fly if not exists
            new_user = {
                "name": name,
                "email": email,
                "password": bcrypt.hashpw(str(uuid.uuid4()).encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                "role": data.role,
                "property": "Unassigned",
                "is_active": True,
                "dark_mode": False
            }
            res = users_collection.insert_one(new_user)
            user = users_collection.find_one({"_id": res.inserted_id})
            
        secret = getattr(config, 'JWT_SECRET', 'super_secret_key_change_me')
        expiry = datetime.utcnow() + timedelta(days=7)
        jwt_payload = {
            "sub": str(user["_id"]),
            "email": user["email"],
            "role": user["role"],
            "exp": expiry
        }
        token = jwt.encode(jwt_payload, secret, algorithm="HS256")
        
        return {"message": "Google Login successful", "token": token, "user": user_helper(user)}
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid Google credential")
