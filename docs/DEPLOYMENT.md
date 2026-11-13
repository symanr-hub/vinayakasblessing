# AgroAI Production Deployment Guide

This guide details how to deploy AgroAI to production environments.

---

## 1. Architecture Overview

- **Frontend**: React + Vite SPA deployed on **Vercel**
- **Backend API**: Node.js + Express REST API deployed on **Render** (or Railway / AWS App Runner)
- **Database & Auth**: **Supabase** Managed PostgreSQL & Authentication
- **AI Engine**: **Google Gemini API** (`@google/genai`) invoked exclusively from backend

---

## 2. Database & Storage Deployment (Supabase)

1. Ensure all migrations are applied in your production Supabase project via `supabase/migrations/001_initial_schema.sql`.
2. Confirm that:
   - Row Level Security (RLS) is enabled on all tables.
   - The private storage bucket `crop-images` is initialized.
   - Email Auth is enabled under `Authentication -> Providers -> Email`.
   - Site URL under `Authentication -> URL Configuration` points to your production client URL (e.g. `https://agro-ai.vercel.app`).

---

## 3. Backend Deployment (Render / Railway)

### Steps for Render:
1. Connect your Git repository to [Render](https://render.com).
2. Create a new **Web Service**.
3. Configure settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install`
   - **Start Command**: `node src/server.js`
4. Set the following Environment Variables in the Render dashboard:
   ```env
   NODE_ENV=production
   PORT=10000
   CLIENT_URL=https://your-frontend.vercel.app

   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   GEMINI_API_KEY=your-google-gemini-api-key
   GEMINI_MODEL=gemini-2.5-flash
   ```
5. Deploy and copy the assigned service URL (e.g., `https://agro-ai-api.onrender.com`).

---

## 4. Frontend Deployment (Vercel)

1. Connect your Git repository to [Vercel](https://vercel.com).
2. Configure project settings:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`
3. Set the following Environment Variables in Vercel:
   ```env
   VITE_API_BASE_URL=https://agro-ai-api.onrender.com/api/v1
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Deploy the project.

---

## 5. Security & Verification Checklist

- [ ] `GEMINI_API_KEY` is present **only** in the backend server environment.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is present **only** in the backend server environment.
- [ ] Backend `CLIENT_URL` matches the deployed Vercel domain.
- [ ] RLS policies verify record ownership (`auth.uid() = user_id`) on all queries.
- [ ] Image upload magic byte validation prevents file signature spoofing.
- [ ] CORS rejects unauthorized external origins in production.
- [ ] Rate limiting is active on `/api/v1` routes to prevent API abuse.

