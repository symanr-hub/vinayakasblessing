# AgroAI REST API Specification

**Base URL**: `/api/v1`  
**Authentication**: Supabase JWT Bearer Token (`Authorization: Bearer <token>`)

---

## 1. Response Standard

### Success Response (HTTP 200 / 201)
```json
{
  "success": true,
  "message": "Crop recommendations generated successfully",
  "data": {},
  "error": null
}
```

### Error Response (HTTP 400 / 401 / 404 / 500 / 502)
```json
{
  "success": false,
  "message": "Request validation failed",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "soilType",
        "message": "Soil type is required",
        "code": "invalid_type"
      }
    ]
  }
}
```

---

## 2. API Endpoints

### A. Health & Diagnostics
- `GET /health`: Server health, uptime, and configured Gemini model.
- `GET /api/v1/health`: API v1 operational status.

---

### B. Farmer Profile & Farms
- `GET /api/v1/profile`: Retrieve authenticated farmer profile.
- `PUT /api/v1/profile`: Update profile (full name, phone, state, district, farming experience, land area, unit, irrigation availability, preferred language).
- `GET /api/v1/farms`: List farmer's registered land parcels.
- `POST /api/v1/farms`: Register a new farm plot.
- `GET /api/v1/farms/:id`: Get individual farm plot details.
- `PUT /api/v1/farms/:id`: Update farm plot details.
- `DELETE /api/v1/farms/:id`: Delete farm plot.

---

### C. Crop Recommendations
- `POST /api/v1/crop/recommend`:
  **Request Body**:
  ```json
  {
    "farmId": "uuid-optional",
    "state": "Karnataka",
    "district": "Mandya",
    "soilType": "Loamy soil",
    "season": "Kharif",
    "landArea": 2.5,
    "landUnit": "acre",
    "irrigationAvailable": true,
    "soilPH": 6.8,
    "nitrogen": 240,
    "phosphorus": 35,
    "potassium": 180,
    "language": "en"
  }
  ```
- `GET /api/v1/crop/recommendations?limit=20&offset=0`: List saved recommendations.
- `GET /api/v1/crop/recommendations/:id`: Get individual recommendation report.
- `DELETE /api/v1/crop/recommendations/:id`: Delete recommendation report.

---

### D. Soil Health Analysis
- `POST /api/v1/soil/analyze`:
  **Request Body**:
  ```json
  {
    "soilType": "Loamy soil",
    "soilTexture": "Medium loam",
    "soilPH": 6.5,
    "nitrogen": 220,
    "phosphorus": 28,
    "potassium": 190,
    "organicCarbon": 0.55,
    "electricalConductivity": 0.8,
    "language": "kn"
  }
  ```
- `GET /api/v1/soil/reports`: List soil reports.
- `GET /api/v1/soil/reports/:id`: Get individual soil report.
- `DELETE /api/v1/soil/reports/:id`: Delete soil report.

---

### E. Fertilizer Advisory
- `POST /api/v1/fertilizer/recommend`:
  **Request Body**:
  ```json
  {
    "cropName": "Rice",
    "growthStage": "Vegetative / Tillering",
    "landArea": 2.0,
    "landUnit": "acre",
    "farmingMethod": "Conventional",
    "language": "hi"
  }
  ```
- `GET /api/v1/fertilizer/advisories`: List fertilizer advisories.
- `GET /api/v1/fertilizer/advisories/:id`: Get specific fertilizer advisory.
- `DELETE /api/v1/fertilizer/advisories/:id`: Delete advisory.

---

### F. Irrigation Advisory
- `POST /api/v1/irrigation/recommend`:
  **Request Body**:
  ```json
  {
    "cropName": "Tomato",
    "growthStage": "Flowering & Fruit Setting",
    "soilType": "Loamy soil",
    "landArea": 1.5,
    "landUnit": "acre",
    "irrigationMethod": "Drip irrigation",
    "waterAvailability": "Moderate",
    "temperature": 32,
    "humidity": 65,
    "language": "en"
  }
  ```
- `GET /api/v1/irrigation/advisories`: List irrigation advisories.
- `GET /api/v1/irrigation/advisories/:id`: Get specific irrigation advisory.
- `DELETE /api/v1/irrigation/advisories/:id`: Delete advisory.

---

### G. Disease & Pest Detection
- `POST /api/v1/disease/analyze`:
  **Content-Type**: `multipart/form-data`
  **Fields**:
  - `cropName`: string
  - `affectedPlantPart`: "Leaves" | "Stem" | "Roots" | "Flowers" | "Fruit/Grain" | "Whole Plant"
  - `symptoms`: string
  - `duration`: string
  - `visibleDamage`: string (optional)
  - `weatherCondition`: string (optional)
  - `language`: string
  - `image`: binary file (optional JPEG/PNG/WebP, up to 5MB, verified by magic bytes)
- `GET /api/v1/disease/reports`: List disease reports (includes temporary signed image URLs).
- `GET /api/v1/disease/reports/:id`: Get specific disease report.
- `DELETE /api/v1/disease/reports/:id`: Delete disease report and remove private storage photo.

---

### H. Cultivation Calendar
- `POST /api/v1/calendar/generate`:
  **Request Body**:
  ```json
  {
    "cropName": "Paddy / Rice",
    "startDate": "2026-06-15",
    "state": "Karnataka",
    "district": "Mandya",
    "farmingType": "Conventional",
    "language": "en"
  }
  ```
- `GET /api/v1/calendar`: List calendars.
- `GET /api/v1/calendar/:id`: Get specific calendar.
- `PUT /api/v1/calendar/:id`: Update activity completion statuses.
- `DELETE /api/v1/calendar/:id`: Delete calendar.

---

### I. Conversational AI Chatbot
- `POST /api/v1/chat/conversations`: Create new conversation session.
- `GET /api/v1/chat/conversations`: List user's consultation conversations.
- `GET /api/v1/chat/conversations/:id`: Get conversation details and message history.
- `POST /api/v1/chat/conversations/:id/messages`:
  **Request Body**:
  ```json
  {
    "message": "How do I control fall armyworm in maize organically?",
    "language": "en"
  }
  ```
- `DELETE /api/v1/chat/conversations/:id`: Delete conversation.

---

### J. Dashboard Records
- `GET /api/v1/dashboard/summary`: Actual advisory counts and profile completion percentage.
- `GET /api/v1/dashboard/recent-activities`: Recent 8 records across all advisory tables.
- `GET /api/v1/dashboard/upcoming-tasks`: Active cultivation activities with calculated remaining days.

