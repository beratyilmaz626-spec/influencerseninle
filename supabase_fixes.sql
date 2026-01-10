-- =====================================================
-- SUPABASE PERFORMANS VE GÜVENLİK DÜZELTMELERİ v2
-- Bu script'i Supabase Dashboard > SQL Editor'da çalıştırın
-- =====================================================

-- =====================================================
-- 1. PERFORMANS DÜZELTMELERİ - İNDEKSLER
-- =====================================================

-- Users tablosu için indeksler
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Videos tablosu için indeksler
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON public.videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_user_status ON public.videos(user_id, status);

-- Video styles tablosu için indeksler
CREATE INDEX IF NOT EXISTS idx_video_styles_is_active ON public.video_styles(is_active);
CREATE INDEX IF NOT EXISTS idx_video_styles_order ON public.video_styles(order_index);

-- UGC Tasks tablosu için indeksler
CREATE INDEX IF NOT EXISTS idx_ugc_tasks_user_id ON public.ugc_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_ugc_tasks_created_at ON public.ugc_tasks(created_at DESC);

-- Slider videos tablosu için indeksler
CREATE INDEX IF NOT EXISTS idx_slider_videos_is_active ON public.slider_videos(is_active);
CREATE INDEX IF NOT EXISTS idx_slider_videos_order ON public.slider_videos(order_index);

-- User credits tablosu için indeksler (eğer varsa)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_credits' AND table_schema = 'public') THEN
        CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON public.user_credits(user_id);
    END IF;
END $$;

-- Credit transactions tablosu için indeksler (eğer varsa)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'credit_transactions' AND table_schema = 'public') THEN
        CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
        CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON public.credit_transactions(created_at DESC);
    END IF;
END $$;

-- Stripe customers tablosu için indeksler (eğer varsa)
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stripe_customers' AND table_schema = 'public') THEN
        CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON public.stripe_customers(user_id);
    END IF;
END $$;

-- =====================================================
-- 2. GÜVENLİK DÜZELTMELERİ - ROW LEVEL SECURITY (RLS)
-- =====================================================

-- =====================================================
-- 2.1 USERS TABLOSU İÇİN RLS
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role has full access to users" ON public.users;
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.users;

CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin can view all users" ON public.users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.is_admin = true)
    );

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow insert for authenticated users" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role has full access to users" ON public.users
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- 2.2 VIDEOS TABLOSU İÇİN RLS
-- =====================================================

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can insert own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can update own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can delete own videos" ON public.videos;
DROP POLICY IF EXISTS "Service role has full access to videos" ON public.videos;

CREATE POLICY "Users can view own videos" ON public.videos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own videos" ON public.videos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos" ON public.videos
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own videos" ON public.videos
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to videos" ON public.videos
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- 2.3 UGC_TASKS TABLOSU İÇİN RLS
-- =====================================================

ALTER TABLE public.ugc_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own tasks" ON public.ugc_tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON public.ugc_tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.ugc_tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.ugc_tasks;
DROP POLICY IF EXISTS "Service role has full access to ugc_tasks" ON public.ugc_tasks;

CREATE POLICY "Users can view own tasks" ON public.ugc_tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks" ON public.ugc_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks" ON public.ugc_tasks
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks" ON public.ugc_tasks
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to ugc_tasks" ON public.ugc_tasks
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- 2.4 TEST_TABLE TABLOSU İÇİN RLS
-- =====================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'test_table' AND table_schema = 'public') THEN
        ALTER TABLE public.test_table ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "No public access to test_table" ON public.test_table;
        CREATE POLICY "No public access to test_table" ON public.test_table
            FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- =====================================================
-- 2.5 SLIDER_VIDEOS TABLOSU İÇİN RLS
-- =====================================================

ALTER TABLE public.slider_videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Kimliği doğrulanmış kullanıcılar slayt videolarını yönetebilir" ON public.slider_videos;
DROP POLICY IF EXISTS "Anyone can view active slider videos" ON public.slider_videos;
DROP POLICY IF EXISTS "Admin can manage slider videos" ON public.slider_videos;
DROP POLICY IF EXISTS "Service role has full access to slider_videos" ON public.slider_videos;

CREATE POLICY "Anyone can view active slider videos" ON public.slider_videos
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage slider videos" ON public.slider_videos
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.is_admin = true)
    );

CREATE POLICY "Service role has full access to slider_videos" ON public.slider_videos
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- 2.6 VIDEO_STYLES TABLOSU İÇİN RLS
-- =====================================================

ALTER TABLE public.video_styles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active styles" ON public.video_styles;
DROP POLICY IF EXISTS "Admin can manage styles" ON public.video_styles;
DROP POLICY IF EXISTS "Service role can manage styles" ON public.video_styles;

CREATE POLICY "Anyone can view active styles" ON public.video_styles
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage styles" ON public.video_styles
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.is_admin = true)
    );

CREATE POLICY "Service role can manage styles" ON public.video_styles
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- 2.7 USER_CREDITS TABLOSU İÇİN RLS (varsa)
-- =====================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_credits' AND table_schema = 'public') THEN
        ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can view own credits" ON public.user_credits;
        DROP POLICY IF EXISTS "Users can update own credits" ON public.user_credits;
        DROP POLICY IF EXISTS "Service role has full access to user_credits" ON public.user_credits;
        
        CREATE POLICY "Users can view own credits" ON public.user_credits
            FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can update own credits" ON public.user_credits
            FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Service role has full access to user_credits" ON public.user_credits
            FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- =====================================================
-- 2.8 CREDIT_TRANSACTIONS TABLOSU İÇİN RLS (varsa)
-- =====================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'credit_transactions' AND table_schema = 'public') THEN
        ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can view own transactions" ON public.credit_transactions;
        DROP POLICY IF EXISTS "Users can insert own transactions" ON public.credit_transactions;
        DROP POLICY IF EXISTS "Service role has full access to credit_transactions" ON public.credit_transactions;
        
        CREATE POLICY "Users can view own transactions" ON public.credit_transactions
            FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert own transactions" ON public.credit_transactions
            FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Service role has full access to credit_transactions" ON public.credit_transactions
            FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- =====================================================
-- 2.9 STRIPE_CUSTOMERS TABLOSU İÇİN RLS (varsa)
-- =====================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stripe_customers' AND table_schema = 'public') THEN
        ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can view own stripe data" ON public.stripe_customers;
        DROP POLICY IF EXISTS "Service role has full access to stripe_customers" ON public.stripe_customers;
        
        CREATE POLICY "Users can view own stripe data" ON public.stripe_customers
            FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Service role has full access to stripe_customers" ON public.stripe_customers
            FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- =====================================================
-- 2.10 USER_SUBSCRIPTIONS TABLOSU İÇİN RLS (varsa)
-- =====================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_subscriptions' AND table_schema = 'public') THEN
        ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.user_subscriptions;
        DROP POLICY IF EXISTS "Service role has full access to user_subscriptions" ON public.user_subscriptions;
        
        CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions
            FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Service role has full access to user_subscriptions" ON public.user_subscriptions
            FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- =====================================================
-- 3. FONKSİYONLAR İÇİN GÜVENLİK - SEARCH_PATH DÜZELTMESİ
-- =====================================================

-- update_videos_updated_at
CREATE OR REPLACE FUNCTION public.update_videos_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- update_slider_videos_updated_at
CREATE OR REPLACE FUNCTION public.update_slider_videos_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- update_user_credits_updated_at
CREATE OR REPLACE FUNCTION public.update_user_credits_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- add_user_credits
CREATE OR REPLACE FUNCTION public.add_user_credits(user_id_param UUID, credits_to_add INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_credits INTEGER;
BEGIN
    UPDATE public.users 
    SET user_credits_points = COALESCE(user_credits_points, 0) + credits_to_add
    WHERE id = user_id_param
    RETURNING user_credits_points INTO new_credits;
    
    RETURN COALESCE(new_credits, 0);
END;
$$;

-- deduct_user_credits
CREATE OR REPLACE FUNCTION public.deduct_user_credits(user_id_param UUID, credits_to_deduct INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_credits INTEGER;
    new_credits INTEGER;
BEGIN
    SELECT user_credits_points INTO current_credits FROM public.users WHERE id = user_id_param;
    
    IF current_credits IS NULL OR current_credits < credits_to_deduct THEN
        RETURN -1;
    END IF;
    
    UPDATE public.users 
    SET user_credits_points = user_credits_points - credits_to_deduct
    WHERE id = user_id_param
    RETURNING user_credits_points INTO new_credits;
    
    RETURN new_credits;
END;
$$;

-- update_video_styles_updated_at
CREATE OR REPLACE FUNCTION public.update_video_styles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- =====================================================
-- 4. PERFORMANS - VACUUM VE ANALYZE
-- =====================================================

ANALYZE public.users;
ANALYZE public.videos;
ANALYZE public.video_styles;
ANALYZE public.ugc_tasks;
ANALYZE public.slider_videos;

-- =====================================================
-- TAMAMLANDI!
-- =====================================================
-- Script çalıştırıldıktan sonra:
-- 1. Supabase Dashboard'da Linter'ı yeniden kontrol edin
-- 2. HaveIBeenPwned: Authentication > Settings > Security > Enable leaked password protection
-- =====================================================
