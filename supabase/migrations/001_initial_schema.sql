-- ==============================================================================
-- AI-POWERED AGRICULTURE CROP ADVISORY ASSISTANT (AgroAI)
-- Complete Production Database Migration
-- Target: Supabase PostgreSQL
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean Up Existing (for repeatable idempotent setups)
-- Dropping triggers and tables in reverse dependency order if needed
-- (Uncomment during manual reset if desired)

-- 3. Create Function to Automatically Update 'updated_at' Timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 4. TABLE CREATION
-- ==============================================================================

-- A. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    country TEXT DEFAULT 'India',
    state TEXT,
    district TEXT,
    village TEXT,
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'kn', 'hi', 'ur', 'te', 'ta', 'ml')),
    farming_experience INTEGER DEFAULT 0 CHECK (farming_experience >= 0),
    land_area NUMERIC(12,3) CHECK (land_area >= 0),
    land_unit TEXT DEFAULT 'acre' CHECK (land_unit IN ('acre', 'hectare', 'sqm', 'bigha', 'guntha')),
    farming_type TEXT DEFAULT 'Conventional' CHECK (farming_type IN ('Conventional', 'Organic', 'Mixed', 'Hydroponic', 'Natural')),
    irrigation_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- B. Farms Table (Parcels / Plots)
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    location TEXT,
    state TEXT,
    district TEXT,
    soil_type TEXT,
    soil_ph NUMERIC(4,2) CHECK (soil_ph >= 0 AND soil_ph <= 14),
    land_area NUMERIC(12,3) NOT NULL CHECK (land_area > 0),
    land_unit TEXT DEFAULT 'acre' CHECK (land_unit IN ('acre', 'hectare', 'sqm', 'bigha', 'guntha')),
    irrigation_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- C. Crop Recommendations Table
CREATE TABLE IF NOT EXISTS public.crop_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    input_data JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    advisory_language TEXT DEFAULT 'en',
    model_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- D. Soil Reports Table
CREATE TABLE IF NOT EXISTS public.soil_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    soil_data JSONB NOT NULL,
    analysis JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- E. Fertilizer Advisories Table
CREATE TABLE IF NOT EXISTS public.fertilizer_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    input_data JSONB NOT NULL,
    advisory JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- F. Irrigation Advisories Table
CREATE TABLE IF NOT EXISTS public.irrigation_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    input_data JSONB NOT NULL,
    advisory JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- G. Disease Reports Table
CREATE TABLE IF NOT EXISTS public.disease_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    image_path TEXT,
    analysis JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- H. Cultivation Calendars Table
CREATE TABLE IF NOT EXISTS public.cultivation_calendars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    activities JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- I. Chat Conversations Table
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- J. Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 5. ATTACH AUTOMATIC UPDATED_AT TRIGGERS
-- ==============================================================================

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_farms_updated_at ON public.farms;
CREATE TRIGGER trigger_farms_updated_at
    BEFORE UPDATE ON public.farms
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_cultivation_calendars_updated_at ON public.cultivation_calendars;
CREATE TRIGGER trigger_cultivation_calendars_updated_at
    BEFORE UPDATE ON public.cultivation_calendars
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_chat_conversations_updated_at ON public.chat_conversations;
CREATE TRIGGER trigger_chat_conversations_updated_at
    BEFORE UPDATE ON public.chat_conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 6. INDEXES FOR HIGH QUERY EFFICIENCY
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_state ON public.profiles(state);
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);

CREATE INDEX IF NOT EXISTS idx_crop_rec_user_id ON public.crop_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_rec_farm_id ON public.crop_recommendations(farm_id);
CREATE INDEX IF NOT EXISTS idx_crop_rec_created_at ON public.crop_recommendations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_soil_reports_user_id ON public.soil_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_soil_reports_created_at ON public.soil_reports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_fertilizer_user_id ON public.fertilizer_advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_fertilizer_created_at ON public.fertilizer_advisories(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_irrigation_user_id ON public.irrigation_advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_irrigation_created_at ON public.irrigation_advisories(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_disease_reports_user_id ON public.disease_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_disease_reports_created_at ON public.disease_reports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_calendars_user_id ON public.cultivation_calendars(user_id);
CREATE INDEX IF NOT EXISTS idx_calendars_created_at ON public.cultivation_calendars(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_updated_at ON public.chat_conversations(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conv_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at ASC);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertilizer_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irrigation_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultivation_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- A. Profiles Policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
    ON public.profiles FOR DELETE
    TO authenticated
    USING (auth.uid() = id);

-- B. Farms Policies
CREATE POLICY "Users can view own farms"
    ON public.farms FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own farms"
    ON public.farms FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own farms"
    ON public.farms FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own farms"
    ON public.farms FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- C. Crop Recommendations Policies
CREATE POLICY "Users can view own crop recommendations"
    ON public.crop_recommendations FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own crop recommendations"
    ON public.crop_recommendations FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own crop recommendations"
    ON public.crop_recommendations FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- D. Soil Reports Policies
CREATE POLICY "Users can view own soil reports"
    ON public.soil_reports FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own soil reports"
    ON public.soil_reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own soil reports"
    ON public.soil_reports FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- E. Fertilizer Advisories Policies
CREATE POLICY "Users can view own fertilizer advisories"
    ON public.fertilizer_advisories FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fertilizer advisories"
    ON public.fertilizer_advisories FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own fertilizer advisories"
    ON public.fertilizer_advisories FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- F. Irrigation Advisories Policies
CREATE POLICY "Users can view own irrigation advisories"
    ON public.irrigation_advisories FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own irrigation advisories"
    ON public.irrigation_advisories FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own irrigation advisories"
    ON public.irrigation_advisories FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- G. Disease Reports Policies
CREATE POLICY "Users can view own disease reports"
    ON public.disease_reports FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own disease reports"
    ON public.disease_reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own disease reports"
    ON public.disease_reports FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- H. Cultivation Calendars Policies
CREATE POLICY "Users can view own cultivation calendars"
    ON public.cultivation_calendars FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cultivation calendars"
    ON public.cultivation_calendars FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cultivation calendars"
    ON public.cultivation_calendars FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cultivation calendars"
    ON public.cultivation_calendars FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- I. Chat Conversations Policies
CREATE POLICY "Users can view own chat conversations"
    ON public.chat_conversations FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat conversations"
    ON public.chat_conversations FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat conversations"
    ON public.chat_conversations FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat conversations"
    ON public.chat_conversations FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- J. Chat Messages Policies
CREATE POLICY "Users can view own chat messages"
    ON public.chat_messages FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id AND
        conversation_id IN (
            SELECT id FROM public.chat_conversations WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own chat messages"
    ON public.chat_messages FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id AND
        conversation_id IN (
            SELECT id FROM public.chat_conversations WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own chat messages"
    ON public.chat_messages FOR DELETE
    TO authenticated
    USING (
        auth.uid() = user_id AND
        conversation_id IN (
            SELECT id FROM public.chat_conversations WHERE user_id = auth.uid()
        )
    );

-- ==============================================================================
-- 8. AUTOMATIC PROFILE INITIALIZATION ON SIGNUP
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, preferred_language)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Farmer'),
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 9. SUPABASE STORAGE BUCKET CONFIGURATION (CROP IMAGES)
-- ==============================================================================

-- Create private bucket for crop disease images if not already existing
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'crop-images',
    'crop-images',
    false,
    5242880, -- 5 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Storage Policies: Farmer can only access and upload into their own folder: <uid>/<filename>
CREATE POLICY "Farmers can upload own crop images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'crop-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Farmers can view own crop images"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'crop-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Farmers can delete own crop images"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'crop-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

