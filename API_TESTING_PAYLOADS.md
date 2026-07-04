# SentiNaut RBAC & API Testing Payloads

You can use these dummy payloads to test the backend API. Since SentiNaut uses FastAPI, the easiest way to test these is by navigating to the interactive Swagger UI at:
👉 **http://127.0.0.1:8000/docs**

Just click on the relevant endpoint, click **"Try it out"**, and paste these JSON snippets into the Request Body!

---

## 1. System Ingestion (Reviews)
*Use these to simulate new reviews coming into the system from external platforms. Once posted, you will see them appear on the Owner and Manager dashboards for "The Oberoi".*

**Endpoint:** `POST /api/reviews`

### Single Positive Review
```json
{
  "guestName": "David Chen",
  "platform": "Google",
  "text": "The beachfront view from my suite was unbelievable. Room service was prompt and the food was delicious. Highly recommend!",
  "sentiment": "Positive",
  "tags": ["View", "Room Service", "Food"],
  "status": "Pending",
  "property": "The Oberoi",
  "replied": false
}
```

### Single Negative Review (Triggers lower health score & alerts)
```json
{
  "guestName": "Emma Thompson",
  "platform": "TripAdvisor",
  "text": "Extremely noisy at night due to construction next door. We were not informed about this before booking. Unacceptable for the price.",
  "sentiment": "Negative",
  "tags": ["Noise", "Construction", "Price"],
  "status": "Pending",
  "property": "The Oberoi",
  "replied": false
}
```

### Foreign Language Review (To test translation features)
```json
{
  "guestName": "Carlos Rodriguez",
  "platform": "Booking.com",
  "text": "La habitación era hermosa y la cama muy cómoda. Sin embargo, el wifi era intermitente.",
  "sentiment": "Neutral",
  "tags": ["Room", "Comfort", "Wifi"],
  "status": "Pending",
  "property": "The Oberoi",
  "replied": false
}
```

*(Note: Since there is no batch review endpoint, simply paste these individually into the `POST /api/reviews` endpoint in Swagger to simulate a batch of incoming reviews.)*

---

## 2. Manager Role (`manager@test.com`)
*Managers oversee operations for a specific property. Use these to test task delegation and updates.*

**Endpoint:** `POST /api/actions`

### Assign a Task to Staff
```json
{
  "task": "Investigate noise complaint from Emma Thompson in Room 302",
  "status": "Todo",
  "property": "The Oberoi",
  "assigned_to": "staff@test.com",
  "priority": "High",
  "notes": ["Guest is extremely upset. Offer complimentary spa voucher if needed."]
}
```

**Endpoint:** `PUT /api/actions/{id}`
*(Copy the `id` string from an existing task to test updating its status)*
```json
{
  "task": "Investigate noise complaint from Emma Thompson in Room 302",
  "status": "Done",
  "property": "The Oberoi",
  "assigned_to": "staff@test.com",
  "priority": "High",
  "notes": ["Guest is extremely upset. Offer complimentary spa voucher if needed.", "Voucher delivered, guest satisfied."]
}
```

---

## 3. Owner Role (`owner@test.com`)
*Owners manage the overarching portfolio. Use these to test adding new properties and onboarding new managers.*

**Endpoint:** `POST /api/properties`

### Create a New Property
```json
{
  "name": "The Taj Mahal Palace",
  "location": "Colaba, Mumbai",
  "status": "Active",
  "owner_email": "owner@test.com",
  "is_active": true,
  "custom_tags": ["Heritage", "Iconic", "Luxury"]
}
```

**Endpoint:** `POST /api/auth/signup`
*Use this to invite/provision a new manager for the newly created property.*

### Provision a New Manager
```json
{
  "name": "Vikram Singh",
  "email": "vikram@test.com",
  "password": "password123",
  "role": "manager",
  "property": "The Taj Mahal Palace"
}
```

---

## 4. System Notifications
*Use this to manually push alerts to a specific property's dashboard.*

**Endpoint:** `POST /api/notifications`

### Push an Urgent Alert
```json
{
  "property": "The Oberoi",
  "message": "Health Inspection scheduled for tomorrow at 9 AM.",
  "type": "Alert",
  "is_read": false
}
```
