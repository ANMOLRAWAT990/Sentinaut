from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uuid

app = FastAPI(title="SentiNaut Backend API")

# Configure CORS so the React frontend can communicate with it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development, can restrict to http://localhost:5173 later
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Core Data Model
class Review(BaseModel):
    id: Optional[str] = None
    guestName: str
    platform: str
    text: str
    sentiment: str = "Neutral"
    tags: List[str] = []
    status: str = "Pending"

# In-memory data store for this week
# We populate it with some dummy data to preserve "old data" equivalents
reviews_db = [
    Review(
        id="1", 
        guestName="John Doe", 
        platform="Google", 
        text="The room was clean but the food was cold.", 
        sentiment="Neutral", 
        tags=["Food", "Cleanliness"], 
        status="Pending"
    ),
    Review(
        id="2", 
        guestName="Jane Smith", 
        platform="Booking.com", 
        text="Amazing view and great host!", 
        sentiment="Positive", 
        tags=["Host", "Experience"], 
        status="Done"
    )
]

# 1. GET /api/reviews - list all reviews
@app.get("/api/reviews", response_model=List[Review])
def get_reviews():
    return reviews_db

# 2. GET /api/reviews/search?q=... - search reviews (Must be defined BEFORE /api/reviews/{id})
@app.get("/api/reviews/search", response_model=List[Review])
def search_reviews(q: str = Query(..., description="Search query")):
    query = q.lower()
    results = [
        r for r in reviews_db 
        if query in r.guestName.lower() or query in r.text.lower() or any(query in tag.lower() for tag in r.tags)
    ]
    return results

# 3. GET /api/reviews/{id} - get a single review
@app.get("/api/reviews/{id}", response_model=Review)
def get_review(id: str):
    for r in reviews_db:
        if r.id == id:
            return r
    raise HTTPException(status_code=404, detail="Review not found")

# 4. POST /api/reviews - create a review
@app.post("/api/reviews", response_model=Review, status_code=201)
def create_review(review: Review):
    # Generate a unique ID if not provided
    review.id = review.id or str(uuid.uuid4())
    reviews_db.append(review)
    return review

# 5. PUT /api/reviews/{id} - update a review
@app.put("/api/reviews/{id}", response_model=Review)
def update_review(id: str, updated_review: Review):
    for i, r in enumerate(reviews_db):
        if r.id == id:
            updated_review.id = id # Ensure ID remains the same
            reviews_db[i] = updated_review
            return updated_review
    raise HTTPException(status_code=404, detail="Review not found")

# 6. DELETE /api/reviews/{id} - delete a review
@app.delete("/api/reviews/{id}", status_code=204)
def delete_review(id: str):
    for i, r in enumerate(reviews_db):
        if r.id == id:
            del reviews_db[i]
            return
    raise HTTPException(status_code=404, detail="Review not found")

# --- Actions API ---
class Action(BaseModel):
    id: int
    task: str
    status: str

actions_db = [
    Action(id=1, task="Inspect AC in 302", status="Pending"),
    Action(id=2, task="Praise kitchen staff", status="Done"),
]

@app.get("/api/actions", response_model=List[Action])
def get_actions():
    return actions_db

@app.put("/api/actions/{id}", response_model=Action)
def update_action(id: int, updated_action: Action):
    for i, a in enumerate(actions_db):
        if a.id == id:
            updated_action.id = id
            actions_db[i] = updated_action
            return updated_action
    raise HTTPException(status_code=404, detail="Action not found")

@app.get("/")
def read_root():
    return {"message": "Welcome to SentiNaut API"}
