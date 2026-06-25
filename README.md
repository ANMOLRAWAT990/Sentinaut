# SentiNaut

**Reputation and Operations Management Platform for Homestays and Mountain Resorts**

SentiNaut turns guest reviews into direct business actions. Staff paste reviews from any platform and the system classifies sentiment, tags recurring themes, benchmarks performance against nearby competitors, and converts feedback patterns into trackable staff action items — all working together to maximize positive review volume, reduce repeat complaints, and improve search visibility over time.


---

## The Problem

Small homestays and mountain resorts in competitive markets (like Lansdowne with 30-40 properties) receive reviews across Google, Booking.com, and TripAdvisor but have no system to:
- Read and categorize feedback at volume
- Identify recurring operational issues before they hurt ratings
- Act on feedback in a structured, trackable way
- Understand how they compare to nearby competitors

SentiNaut solves all of this in one platform.

---

## Core Features

**1. Role-Based Access Control**
Distinct dashboards for Owners (analytics and competitor benchmarking), Managers (review moderation and action tracker), and Staff (review submission and guest checkout logging). Every team member sees exactly what they need.

**2. Sentiment Classification and Theme Tagging**
Single and batch review processing returning sentiment (Positive, Neutral, Negative), confidence level, primary theme tag (Food, Host, Location, Cleanliness, Value, Experience), and an AI-generated suggested management reply per review.

**3. Operational Suggestions and Action Tracker**
AI analyzes full batch patterns to surface root causes and priority action items that automatically become trackable staff tasks (Pending, In Progress, Done, Verified), staying open until new reviews confirm the issue is resolved.

**4. Competitor Benchmarking**
Staff paste reviews from nearby competing properties and SentiNaut identifies where competitors consistently win or lose, giving owners clear gaps to exploit and differentiate their property.

**5. Review Request Generator**
Staff log departing guest details at checkout and SentiNaut generates a personalized review request message with a direct link to the platform they booked from, ensuring the review lands where it matters most for visibility.

---

## AI Architecture

Two-layer classification pipeline:

- **Layer 1 — Rule-based pre-classifier:** Lightweight keyword matching handles high-confidence reviews instantly without an API call
- **Layer 2 — Gemini Flash (Google AI free tier):** Ambiguous and complex reviews are escalated for nuanced sentiment analysis and theme detection
- **Aggregate call:** A second Gemini call processes the full batch pattern to generate operational suggestions and actionable staff tasks
- **Token compression:** Raw review text is pre-processed to extract only sentiment-bearing phrases before any API call, reducing cost and latency

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React JS |
| Backend | Python / FastAPI |
| Database | MongoDB via Atlas |
| AI | Gemini Flash (Google AI free tier) |
| Local Dev AI | Ollama (llama3) |
| Deployment | Vercel (frontend) / Render (backend) |

---

## Project Structure

```
Sentinaut/
├── frontend/          # React app — role-based dashboards
├── backend/
│   ├── main.py        # FastAPI entry point
│   ├── classifier.py  # Rule-based pre-classifier
│   ├── suggestions.py # Gemini aggregate suggestions call
│   ├── models/        # Data models
│   ├── routes/        # API endpoints
│   └── .env           # Environment variables
├── README.md
└── W1_ProjectBrief_TBI-26100062.txt
```

---

## Environment Variables

```
Temporary:
GEMINI_API_KEY=your_key_here
USE_GEMINI=true
MONGODB_URI=your_atlas_uri
```

Set `USE_GEMINI=false` to use local Ollama during development.

---

## How to run backend locally

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Create a virtual environment and activate it:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. **Install dependencies:**
   ```bash
   pip install fastapi uvicorn pydantic python-dotenv
   ```
4. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in any required keys (like `GEMINI_API_KEY`)
5. **Run the server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend will now be running at `http://localhost:8000`. You can access the interactive API documentation at `http://localhost:8000/docs`.

---

## Intern Details

| Field | Details |
|---|---|
| Intern ID | TBI-26100062 |
| Name | Anmol Rawat |
| Domain | Homestay and Eco-tourism |
