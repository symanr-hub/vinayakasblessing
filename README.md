# AgroAI - AI-Powered Agriculture Crop Advisory Assistant

[![React](https://img.shields.io/badge/Frontend-React_18_%2B_Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styles-Tailwind_CSS_v3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js_%2B_Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![AI](https://img.shields.io/badge/AI_SDK-%40google%2Fgenai-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![Validation](https://img.shields.io/badge/Schema_Validation-Zod-3E67B1?logo=zod&logoColor=white)](https://zod.dev/)

An intelligent, responsible agricultural advisory platform designed to help farmers make data-driven decisions on crop selection, soil health diagnostics, fertilizer management, precision irrigation, and pest diagnostics.

Built with an **India-first architecture** with full support for Indian states, districts, agro-climatic zones, metric units, and multilingual consultations in **Kannada (ಕನ್ನಡ), Hindi (हिन्दी), Urdu (اردو), Telugu (తెలుగు), Tamil (தமிழ்), Malayalam (മലയാളം), and English**.

---

## 🌾 Core Features

1. **Crop Recommendation Engine**:
   - Synthesizes state, district, soil type, measured or estimated pH, N-P-K levels, seasonal sowing windows (Kharif, Rabi, Zaid), temperature, and water availability.
   - Generates advisory suitability scores, climate compatibility, water requirements, estimated durations, and cultivation risk disclosures.

2. **Soil Health & Fertility Diagnostic**:
   - Evaluates laboratory soil parameters (pH, N, P, K, Organic Carbon, Electrical Conductivity).
   - Identifies specific nutrient deficiencies, toxicities, and provides organic soil improvement practices (e.g. FYM, vermicompost, lime/gypsum application).
   - Never fabricates missing laboratory observations; responsibly advises certified soil testing.

3. **Fertilizer & Nutrition Advisory**:
   - Stage-specific fertilizer scheduling (basal, vegetative, tillering, flowering, grain filling).
   - Tailored for Conventional, Organic, Integrated, and Natural farming methods.
   - Enforces chemical safety precautions and warns against hazardous tank mixing.

4. **Precision Irrigation Scheduling**:
   - Recommends irrigation intervals and delivery methods (drip, sprinkler, furrow) based on growth stage, soil texture, rainfall, and water availability.
   - Highlights crop water stress indicators and drainage considerations to prevent root rot.

5. **Crop Disease & Pest Detection**:
   - Diagnoses plant pathologies from symptom descriptions and optional leaf/stem image uploads.
   - Multimodal Gemini AI inspection with file signature verification (JPEG, PNG, WebP).
   - Emphasizes Integrated Pest Management (IPM), biological controls, and cultural sanitation.

6. **Chronological Cultivation Calendar**:
   - Automated timeline from land preparation, seed priming, sowing, nutrient application, and pest scouting to harvesting and storage.
   - Interactive milestone checklist persisted in PostgreSQL for tracking real farm progress.

7. **Multilingual Agricultural Assistant**:
   - Conversational AI chatbot powered by Google Gemini supporting Indian regional languages.
   - Preserves conversation context across sessions with individual farmer ownership.

8. **Farm Parcel Management & Dynamic Dashboard**:
   - Register and manage distinct land plots with soil type and irrigation attributes.
   - Live dashboard statistics derived from real database records (no static mock statistics).

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite, React Router 6 | Component-driven Single Page Application |
| **Styling** | Tailwind CSS, Lucide React | Modern, accessible, mobile-first agricultural theme |
| **Backend** | Node.js, Express.js | Modular REST API under `/api/v1` |
| **Database** | Supabase PostgreSQL | Relational data store with UUIDs and triggers |
| **Security** | Row Level Security (RLS) | Farmer-isolated data access (no cross-user leakage) |
| **Auth** | Supabase Authentication | JWT bearer token verification |
| **AI Integration**| `@google/genai` (Official SDK) | Server-side structured Gemini JSON advisories |
| **Validation** | Zod | End-to-end request and AI response schema validation |
| **Storage** | Supabase Private Storage | Secure, private storage with signed URLs for crop images |
| **HTTP Security**| Helmet, CORS, Express Rate Limit | API hardening, rate limiting, and origin protection |

---

## 📁 Repository Structure

```text
agro-ai-assistant/
├── client/                     # React + Vite Frontend
│   ├── public/logo.svg         # Application Logo
│   ├── src/
│   │   ├── components/         # Reusable Component Architecture
│   │   │   ├── common/         # Button, Input, Modal, AdvisoryWarning, EmptyState, etc.
│   │   │   ├── layout/         # Navbar, Sidebar, DashboardLayout, MainLayout, Footer
│   │   │   ├── dashboard/      # WelcomeCard, StatisticsCard, UpcomingTasks, RecentAdvisories
│   │   │   ├── agriculture/    # Crop, Soil, Fertilizer, Irrigation, Disease, Calendar forms & cards
│   │   │   ├── chatbot/        # ChatWindow, ChatMessage, ChatInput, TypingIndicator
│   │   │   └── history/        # AdvisoryHistoryList, SearchFilter, AdvisoryHistoryCard
│   │   ├── pages/              # 16 Application Pages
│   │   ├── context/            # AuthContext (Supabase Auth & Session)
│   │   ├── services/           # api.js (Axios) and supabase.js
│   │   └── utils/              # Translations for 7 languages
│   ├── .env.example
│   └── package.json
│
├── server/                     # Node.js + Express REST API Backend
│   ├── src/
│   │   ├── config/             # Supabase & Gemini SDK configurations
│   │   ├── controllers/        # Profile, Farm, Crop, Soil, Fertilizer, Irrigation, Disease, Calendar, Chat, Dashboard
│   │   ├── services/           # Business logic & AI generation services
│   │   ├── routes/             # Express routes mounted under /api/v1
│   │   ├── middleware/         # Auth (JWT RLS), Validate (Zod), Upload (Multer+Magic Bytes), ErrorHandler
│   │   ├── schemas/            # Centralized Zod request and AI response schemas
│   │   ├── prompts/            # System persona, advisory prompts, multilingual templates
│   │   ├── app.js              # Express app configuration
│   │   └── server.js           # Server entry point
│   ├── .env.example
│   └── package.json
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql # Complete PostgreSQL schema, triggers, RLS & Storage policies
│
├── docs/
│   ├── SETUP.md                # Comprehensive local setup instructions
│   ├── API_DOCUMENTATION.md    # REST API endpoint reference
│   └── DEPLOYMENT.md           # Production deployment guide (Vercel + Render + Supabase)
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Database Setup (Supabase)
1. Create a project on [Supabase](https://supabase.com).
2. Go to **SQL Editor** and execute the complete migration script:  
   [`supabase/migrations/001_initial_schema.sql`](file:///c:/Users/Syman/OneDrive/Desktop/SYMAN/supabase/migrations/001_initial_schema.sql)
3. Copy your project credentials (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).

### 2. Configure Environment Files

**Backend (`server/.env`)**:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

**Frontend (`client/.env`)**:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Install Dependencies & Run

```bash
# In terminal 1: Start Backend Server
cd server
pnpm install
pnpm run dev

# In terminal 2: Start Frontend Client
cd client
pnpm install
pnpm run dev
```

- Open `http://localhost:5173` in your browser.
- Backend API running on `http://localhost:5000/api/v1`.
- Health check available at `http://localhost:5000/health`.

For detailed setup instructions, read [docs/SETUP.md](file:///c:/Users/Syman/OneDrive/Desktop/SYMAN/docs/SETUP.md).

---

## 🛡️ Responsible AI & Agricultural Safety Principles

- **Uncertainty Disclosures**: Model outputs communicate advisory estimates rather than scientific guarantees.
- **No Fabricated Observations**: Incomplete soil laboratory or weather data is marked as missing/uncalibrated rather than hallucinated.
- **Integrated Pest Management (IPM)**: Biological, cultural, and mechanical controls are prioritized before chemical intervention.
- **Expert Escalation**: When severe symptoms or uncertain conditions are detected, certified local agricultural extension officers or Krishi Vigyan Kendras (KVK) are recommended.

---

## 📄 License & Attribution

Licensed under the [MIT License](LICENSE). Built for the farming community.

