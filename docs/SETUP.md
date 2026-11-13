# AgroAI - Local Setup & Installation Guide

This guide provides complete instructions to configure, run, and verify the **AI-Powered Agriculture Crop Advisory Assistant (AgroAI)** locally.

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or later (v20+ / v22+ recommended)
- **pnpm** (or npm / yarn)
- **Supabase Account**: A free project on [Supabase](https://supabase.com)
- **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)

---

## 2. Supabase Database & Auth Setup

### Step A: Create a Supabase Project
1. Log in to your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. Choose a region close to your target users (e.g. `ap-south-1` Mumbai for India).
3. Copy your **Project URL**, **Anon (Public) Key**, and **Service Role Key** from `Project Settings -> API`.

### Step B: Execute the SQL Migration
1. Go to the **SQL Editor** in your Supabase dashboard.
2. Open the file [001_initial_schema.sql](../supabase/migrations/001_initial_schema.sql).
3. Copy the entire contents, paste into the SQL Editor, and click **Run**.
4. This will create:
   - All 10 tables: `profiles`, `farms`, `crop_recommendations`, `soil_reports`, `fertilizer_advisories`, `irrigation_advisories`, `disease_reports`, `cultivation_calendars`, `chat_conversations`, `chat_messages`.
   - Automatic `updated_at` triggers and auto-profile creation on user signup.
   - Comprehensive PostgreSQL Row Level Security (RLS) policies for complete data isolation.
   - Private Supabase Storage bucket `crop-images` with user-folder upload policies.

---

## 3. Environment Variables Configuration

### Server Configuration (`server/.env`)
Copy `server/.env.example` to `server/.env`:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your actual credentials:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

GEMINI_API_KEY=your-actual-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

> ⚠️ **Security Warning**: The `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` must **never** be placed in the client or committed to public Git repositories.

### Client Configuration (`client/.env`)
Copy `client/.env.example` to `client/.env`:

```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 4. Install Dependencies

In the project root, or in both `server/` and `client/` directories:

```bash
# In server directory
cd server
pnpm install

# In client directory
cd ../client
pnpm install
```

---

## 5. Starting the Application

You can run both services concurrently:

### Terminal 1: Run the Backend Server
```bash
cd server
pnpm run dev
```
Backend starts at: `http://localhost:5000`  
Health check endpoint: `http://localhost:5000/health`

### Terminal 2: Run the Frontend Client
```bash
cd client
pnpm run dev
```
Frontend starts at: `http://localhost:5173`

---

## 6. Functional Verification

1. Open `http://localhost:5173` in your browser.
2. Click **Register** and create a new farmer account.
3. Upon registration, you will be directed to `/dashboard`.
4. Navigate to **My Farm Plots** (`/farms`) and add your first agricultural land parcel.
5. Navigate to **Crop Advisory** (`/crop-recommendation`) and submit your state, soil type, and season to receive real AI-ranked crop selections.
6. Check **Soil Health**, **Fertilizer Advisory**, **Irrigation Advisory**, and **Disease Detection** with optional photo uploads.
7. Open **Cultivation Calendar** (`/cultivation-calendar`), generate a production timeline, and click on milestone checkboxes to verify state persistence in the database.
8. Chat with the **AI Assistant** in Kannada, Hindi, or English.
9. Visit **Advisory History** (`/history`) to confirm all generated advisories are stored securely under your user ID.

