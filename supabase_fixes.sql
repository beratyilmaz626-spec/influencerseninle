-- =====================================================
-- SUPABASE PERFORMANS VE GÜVENLİK DÜZELTMELERİ v3
-- ÖNCE ESKİ POLİTİKALARI TEMİZLE, SONRA BASİT RLS EKLE
-- =====================================================

-- =====================================================
-- 1. TÜM ESKİ POLİTİKALARI TEMİZLE
-- =====================================================

-- Users tablosu politikalarını temizle
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Service role has full access to users" ON public.users;
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.users;

-- Videos tablosu politikalarını temizle
DROP POLICY IF EXISTS "Users can view own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can insert own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can update own videos" ON public.videos;
DROP POLICY IF EXISTS "Users can delete own videos" ON public.videos;
DROP POLICY IF EXISTS "Service role has full access to videos" ON public.videos;

-- UGC Tasks tablosu politikalarını temizle
DROP POLICY IF EXISTS "Users can view own tasks" ON public.ugc_tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON public.ugc_tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON public.ugc_tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON public.ugc_tasks;
DROP POLICY IF EXISTS "Service role has full access to ugc_tasks" ON public.ugc_tasks;

-- Slider videos tablosu politikalarını temizle
DROP POLICY IF EXISTS "Kimliği doğrulanmış kullanıcılar slayt videolarını yönetebilir" ON public.slider_videos;
DROP POLICY IF EXISTS "Anyone can view active slider videos" ON public.slider_videos;
DROP POLICY IF EXISTS "Admin can manage slider videos" ON public.slider_videos;
DROP POLICY IF EXISTS "Service role has full access to slider_videos" ON public.slider_videos;

-- Video styles tablosu politikalarını temizle
DROP POLICY IF EXISTS "Anyone can view active styles" ON public.video_styles;
DROP POLICY IF EXISTS "Admin can manage styles" ON public.video_styles;
DROP POLICY IF EXISTS "Service role can manage styles" ON public.video_styles;

-- =====================================================
-- 2. RLS ETKİNLEŞTİR
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ugc_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slider_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_styles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. BASİT RLS POLİTİKALARI (Subquery yok!)
-- =====================================================

-- USERS: Herkes kendi profilini görebilir/güncelleyebilir
CREATE POLICY "users_select_own" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- VIDEOS: Herkes kendi videolarını görebilir/yönetebilir
CREATE POLICY "videos_select_own" ON public.videos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "videos_insert_own" ON public.videos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "videos_update_own" ON public.videos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "videos_delete_own" ON public.videos
    FOR DELETE USING (auth.uid() = user_id);

-- UGC_TASKS: Herkes kendi görevlerini görebilir/yönetebilir
CREATE POLICY "ugc_tasks_select_own" ON public.ugc_tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "ugc_tasks_insert_own" ON public.ugc_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ugc_tasks_update_own" ON public.ugc_tasks
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "ugc_tasks_delete_own" ON public.ugc_tasks
    FOR DELETE USING (auth.uid() = user_id);

-- SLIDER_VIDEOS: Herkes okuyabilir (public içerik)
CREATE POLICY "slider_videos_select_all" ON public.slider_videos
    FOR SELECT USING (true);

-- VIDEO_STYLES: Herkes okuyabilir (public içerik)
CREATE POLICY "video_styles_select_all" ON public.video_styles
    FOR SELECT USING (true);

-- =====================================================
-- 4. TEST_TABLE İÇİN RLS (varsa)
-- =====================================================

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'test_table' AND table_schema = 'public') THEN
        ALTER TABLE public.test_table ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "No public access to test_table" ON public.test_table;
        -- Test tablosuna sadece authenticated kullanıcılar erişebilir
        CREATE POLICY "test_table_authenticated" ON public.test_table
            FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- =====================================================
-- 5. DİĞER TABLOLAR İÇİN RLS (varsa)
-- =====================================================

-- USER_CREDITS
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_credits' AND table_schema = 'public') THEN
        ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can view own credits" ON public.user_credits;
        DROP POLICY IF EXISTS "Users can update own credits" ON public.user_credits;
        DROP POLICY IF EXISTS "Service role has full access to user_credits" ON public.user_credits;
        CREATE POLICY "user_credits_select_own" ON public.user_credits
            FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY "user_credits_update_own" ON public.user_credits
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- CREDIT_TRANSACTIONS
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'credit_transactions' AND table_schema = 'public') THEN
        ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can view own transactions" ON public.credit_transactions;
        DROP POLICY IF EXISTS "Users can insert own transactions" ON public.credit_transactions;
        DROP POLICY IF EXISTS "Service role has full access to credit_transactions" ON public.credit_transactions;
        CREATE POLICY "credit_transactions_select_own" ON public.credit_transactions
            FOR SELECT USING (auth.uid() = user_id);
        CREATE POLICY "credit_transactions_insert_own" ON public.credit_transactions
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- STRIPE_CUSTOMERS
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stripe_customers' AND table_schema = 'public') THEN
        ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can view own stripe data" ON public.stripe_customers;
        DROP POLICY IF EXISTS "Service role has full access to stripe_customers" ON public.stripe_customers;
        CREATE POLICY "stripe_customers_select_own" ON public.stripe_customers
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- USER_SUBSCRIPTIONS
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_subscriptions' AND table_schema = 'public') THEN
        ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.user_subscriptions;
        DROP POLICY IF EXISTS "Service role has full access to user_subscriptions" ON public.user_subscriptions;
        CREATE POLICY "user_subscriptions_select_own" ON public.user_subscriptions
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- =====================================================
-- 6. FONKSİYONLAR - SEARCH_PATH DÜZELTMESİ
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_videos_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.update_slider_videos_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.update_user_credits_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.update_video_styles_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.add_user_credits(user_id_param UUID, credits_to_add INTEGER)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_credits INTEGER;
BEGIN
    UPDATE public.users SET user_credits_points = COALESCE(user_credits_points, 0) + credits_to_add
    WHERE id = user_id_param RETURNING user_credits_points INTO new_credits;
    RETURN COALESCE(new_credits, 0);
END; $$;

CREATE OR REPLACE FUNCTION public.deduct_user_credits(user_id_param UUID, credits_to_deduct INTEGER)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE current_credits INTEGER; new_credits INTEGER;
BEGIN
    SELECT user_credits_points INTO current_credits FROM public.users WHERE id = user_id_param;
    IF current_credits IS NULL OR current_credits < credits_to_deduct THEN RETURN -1; END IF;
    UPDATE public.users SET user_credits_points = user_credits_points - credits_to_deduct
    WHERE id = user_id_param RETURNING user_credits_points INTO new_credits;
    RETURN new_credits;
END; $$;

-- =====================================================
-- 7. İNDEKSLER
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);
CREATE INDEX IF NOT EXISTS idx_ugc_tasks_user_id ON public.ugc_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_video_styles_is_active ON public.video_styles(is_active);
CREATE INDEX IF NOT EXISTS idx_slider_videos_is_active ON public.slider_videos(is_active);

-- =====================================================
-- TAMAMLANDI!
-- =====================================================
