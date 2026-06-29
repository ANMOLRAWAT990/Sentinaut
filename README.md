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
| Frontend | React JS (Vite + Tailwind CSS) |
| Backend | Python / FastAPI |
| Database | MongoDB (local via Compass / Atlas in production) |
| AI | Gemini Flash (Google AI free tier) |
| Local Dev AI | Ollama (llama3) |
| Deployment | Vercel (frontend) / Render (backend) |

---

## Database

### Why MongoDB?

MongoDB was chosen for SentiNaut for three reasons:

1. **Flexible schema** — Guest reviews vary wildly in structure (tags, platforms, sentiment fields). MongoDB's document model handles this without rigid migrations.
2. **Free tier availability** — MongoDB Atlas provides a generous free tier perfectly suited for a self-funded SIP project, with zero infrastructure cost.
3. **Python-native integration** — PyMongo integrates directly with FastAPI and Pydantic models with minimal boilerplate, keeping the codebase clean.

### Collections

| Collection | Purpose |
|---|---|
| `users` | Stores registered users with hashed passwords and role assignments (staff, manager, owner) |
| `reviews` | Stores all guest reviews ingested via the platform, with sentiment, tags, and status |
| `actions` | Stores operational action items generated from review patterns |

### Schema Diagram

![SentiNaut MongoDB Schema](./W5_SchemaDiagram_TBI-26100062.png)

> The `users` collection feeds into `reviews` (a user creates a review). Reviews generate `actions` (operational tasks derived from feedback patterns).

---

## Project Structure

```
Sentinaut/
├── frontend/                  # React app — role-based dashboards
│   └── src/
│       ├── pages/
│       │   ├── public/        # Landing, Login, Signup pages
│       │   └── dashboards/    # Staff, Manager, Owner dashboards
│       ├── components/        # UI component library + layouts
│       └── context/           # AuthContext, ThemeContext
├── backend/
│   ├── main.py                # FastAPI entry point — all API routes
│   ├── models/
│   │   ├── database.py        # MongoDB connection + collection references
│   │   └── schemas.py         # Pydantic schema models for data validation
│   ├── .env                   # Local environment variables (not committed)
│   └── .env.example           # Template for required env variables
├── W5_SchemaDiagram_TBI-26100062.png
└── README.md
```

---

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in your values:

```env
# API Keys
GEMINI_API_KEY=your_gemini_api_key_here
USE_GEMINI=false

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sentinaut?retryWrites=true&w=majority
```

> For local development with MongoDB Compass, use `MONGODB_URI=mongodb://localhost:27017`

---

## Set Up the Database

SentiNaut uses MongoDB as its database. Follow these steps to get it running locally:

### Option A — Local MongoDB (recommended for development)

1. **Install MongoDB Community Edition** from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. **Install MongoDB Compass** (GUI) from [mongodb.com/products/compass](https://www.mongodb.com/products/compass) to visually inspect your data
3. Start the MongoDB service — it runs on `mongodb://localhost:27017` by default
4. Set your `.env` file:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   ```
5. Run the backend — MongoDB will automatically create the `sentinaut` database and its collections (`users`, `reviews`, `actions`) on first write

### Option B — MongoDB Atlas (cloud, for production)

1. Create a free account at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Under **Database Access**, create a user with read/write permissions
4. Under **Network Access**, add your IP address (or `0.0.0.0/0` for open access during dev)
5. Click **Connect → Drivers** and copy your connection string
6. Paste it into `.env`:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/sentinaut?retryWrites=true&w=majority
   ```

---

## How to Run the Backend Locally

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
   pip install fastapi uvicorn pydantic python-dotenv pymongo passlib[bcrypt]
   ```
4. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Set your `MONGODB_URI` (see above)
5. **Run the server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend will now be running at `http://localhost:8000`.
   Interactive API docs available at `http://localhost:8000/docs`.

## How to Run the Frontend Locally

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the dev server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

> Make sure the backend is running first so the frontend can connect to the API.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reviews` | List all reviews |
| GET | `/api/reviews/search?q=` | Search reviews by text/guest/tag |
| GET | `/api/reviews/{id}` | Get a single review |
| POST | `/api/reviews` | Create a new review |
| PUT | `/api/reviews/{id}` | Update a review |
| DELETE | `/api/reviews/{id}` | Delete a review |
| GET | `/api/actions` | List all action items |
| POST | `/api/actions` | Create a new action item |
| PUT | `/api/actions/{id}` | Update an action item |
| POST | `/api/auth/signup` | Register a new user (staff/manager/owner) |
| POST | `/api/auth/login` | Authenticate and return user + role |

---

## Intern Details

| Field | Details |
|---|---|
| Intern ID | TBI-26100062 |
| Name | Anmol Rawat |
| Domain | Homestay and Eco-tourism |

