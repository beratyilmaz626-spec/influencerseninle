-- =====================================================
-- SUPABASE PERFORMANS VE GÜVENLİK DÜZELTMELERİ
-- Bu script'i Supabase Dashboard > SQL Editor'da çalıştırın
-- =====================================================

-- =====================================================
-- 1. PERFORMANS DÜZELTMELERİ - İNDEKSLER
-- =====================================================

-- Users tablosu için indeksler
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Videos tablosu için indeksler (en önemli)
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_user_status ON videos(user_id, status);

-- Video styles tablosu için indeksler
CREATE INDEX IF NOT EXISTS idx_video_styles_is_active ON video_styles(is_active);
CREATE INDEX IF NOT EXISTS idx_video_styles_order ON video_styles(order_index);

-- UGC Tasks tablosu için indeksler
CREATE INDEX IF NOT EXISTS idx_ugc_tasks_user_id ON ugc_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_ugc_tasks_created_at ON ugc_tasks(created_at DESC);

-- Slider videos tablosu için indeksler
CREATE INDEX IF NOT EXISTS idx_slider_videos_is_active ON slider_videos(is_active);
CREATE INDEX IF NOT EXISTS idx_slider_videos_order ON slider_videos(order_index);

-- =====================================================
-- 2. GÜVENLİK DÜZELTMELERİ - ROW LEVEL SECURITY (RLS)
-- =====================================================

-- =====================================================
-- 2.1 USERS TABLOSU İÇİN RLS
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Service role has full access to users" ON users;
DROP POLICY IF EXISTS "Admin can view all users" ON users;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON users;

-- Kullanıcılar kendi profillerini görebilir
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT
    USING (auth.uid()::text = id::text);

-- Admin kullanıcılar tüm profilleri görebilir
CREATE POLICY "Admin can view all users" ON users
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id::text = auth.uid()::text 
            AND u.is_admin = true
        )
    );

-- Kullanıcılar sadece kendi profillerini güncelleyebilir
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

-- Yeni kullanıcı kaydı için insert izni
CREATE POLICY "Allow insert for authenticated users" ON users
    FOR INSERT
    WITH CHECK (auth.uid()::text = id::text);

-- Service role tam erişim
CREATE POLICY "Service role has full access to users" ON users
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- 2.2 UGC_TASKS TABLOSU İÇİN RLS
-- =====================================================

ALTER TABLE ugc_tasks ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Users can view own tasks" ON ugc_tasks;
DROP POLICY IF EXISTS "Users can insert own tasks" ON ugc_tasks;
DROP POLICY IF EXISTS "Users can update own tasks" ON ugc_tasks;
DROP POLICY IF EXISTS "Users can delete own tasks" ON ugc_tasks;
DROP POLICY IF EXISTS "Service role has full access to ugc_tasks" ON ugc_tasks;

-- Kullanıcılar sadece kendi görevlerini görebilir
CREATE POLICY "Users can view own tasks" ON ugc_tasks
    FOR SELECT
    USING (auth.uid()::text = user_id::text);

-- Kullanıcılar görev oluşturabilir
CREATE POLICY "Users can insert own tasks" ON ugc_tasks
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id::text);

-- Kullanıcılar kendi görevlerini güncelleyebilir
CREATE POLICY "Users can update own tasks" ON ugc_tasks
    FOR UPDATE
    USING (auth.uid()::text = user_id::text)
    WITH CHECK (auth.uid()::text = user_id::text);

-- Kullanıcılar kendi görevlerini silebilir
CREATE POLICY "Users can delete own tasks" ON ugc_tasks
    FOR DELETE
    USING (auth.uid()::text = user_id::text);

-- Service role tam erişim
CREATE POLICY "Service role has full access to ugc_tasks" ON ugc_tasks
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- 2.3 TEST_TABLE TABLOSU İÇİN RLS (eğer kullanılıyorsa)
-- =====================================================

-- Test tablosu varsa RLS etkinleştir
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'test_table' AND table_schema = 'public') THEN
        ALTER TABLE test_table ENABLE ROW LEVEL SECURITY;
        
        -- Mevcut politikayı temizle
        DROP POLICY IF EXISTS "No public access to test_table" ON test_table;
        
        -- Sadece service role erişebilir (test amaçlı tablo)
        CREATE POLICY "No public access to test_table" ON test_table
            FOR ALL
            USING (auth.jwt() ->> 'role' = 'service_role');
    END IF;
END $$;

-- =====================================================
-- 2.4 SLIDER_VIDEOS TABLOSU İÇİN RLS DÜZELTMESİ
-- =====================================================

-- Mevcut çok geniş politikayı kaldır
DROP POLICY IF EXISTS "Kimliği doğrulanmış kullanıcılar slayt videolarını yönetebilir" ON slider_videos;
DROP POLICY IF EXISTS "Anyone can view active slider videos" ON slider_videos;
DROP POLICY IF EXISTS "Admin can manage slider videos" ON slider_videos;
DROP POLICY IF EXISTS "Service role has full access to slider_videos" ON slider_videos;

-- Herkes aktif slider videolarını görebilir (public gösterim için)
CREATE POLICY "Anyone can view active slider videos" ON slider_videos
    FOR SELECT
    USING (is_active = true);

-- Sadece admin kullanıcılar slider videolarını yönetebilir
CREATE POLICY "Admin can manage slider videos" ON slider_videos
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id::text = auth.uid()::text 
            AND u.is_admin = true
        )
    );

-- Service role tam erişim
CREATE POLICY "Service role has full access to slider_videos" ON slider_videos
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- 2.5 VIDEOS TABLOSU İÇİN RLS
-- =====================================================

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Users can view own videos" ON videos;
DROP POLICY IF EXISTS "Users can insert own videos" ON videos;
DROP POLICY IF EXISTS "Users can update own videos" ON videos;
DROP POLICY IF EXISTS "Users can delete own videos" ON videos;
DROP POLICY IF EXISTS "Service role has full access to videos" ON videos;

-- Kullanıcılar sadece kendi videolarını görebilir
CREATE POLICY "Users can view own videos" ON videos
    FOR SELECT
    USING (auth.uid()::text = user_id::text);

-- Kullanıcılar video oluşturabilir
CREATE POLICY "Users can insert own videos" ON videos
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id::text);

-- Kullanıcılar kendi videolarını güncelleyebilir
CREATE POLICY "Users can update own videos" ON videos
    FOR UPDATE
    USING (auth.uid()::text = user_id::text)
    WITH CHECK (auth.uid()::text = user_id::text);

-- Kullanıcılar kendi videolarını silebilir
CREATE POLICY "Users can delete own videos" ON videos
    FOR DELETE
    USING (auth.uid()::text = user_id::text);

-- Service role tam erişim (n8n webhook için gerekli)
CREATE POLICY "Service role has full access to videos" ON videos
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- 2.6 VIDEO_STYLES TABLOSU İÇİN RLS
-- =====================================================

ALTER TABLE video_styles ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle
DROP POLICY IF EXISTS "Anyone can view active styles" ON video_styles;
DROP POLICY IF EXISTS "Admin can manage styles" ON video_styles;
DROP POLICY IF EXISTS "Service role can manage styles" ON video_styles;

-- Herkes aktif stilleri görebilir
CREATE POLICY "Anyone can view active styles" ON video_styles
    FOR SELECT
    USING (is_active = true);

-- Admin kullanıcılar stilleri yönetebilir
CREATE POLICY "Admin can manage styles" ON video_styles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users u 
            WHERE u.id::text = auth.uid()::text 
            AND u.is_admin = true
        )
    );

-- Service role tam erişim
CREATE POLICY "Service role can manage styles" ON video_styles
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- 3. FONKSİYONLAR İÇİN GÜVENLİK - SEARCH_PATH DÜZELTMESİ
-- =====================================================

-- update_videos_updated_at fonksiyonunu güvenli hale getir
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

-- update_slider_videos_updated_at fonksiyonunu güvenli hale getir
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

-- update_user_credits_updated_at fonksiyonunu güvenli hale getir
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

-- add_user_credits fonksiyonunu güvenli hale getir
CREATE OR REPLACE FUNCTION public.add_user_credits(user_id_param UUID, credits_to_add INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_credits INTEGER;
BEGIN
    UPDATE users 
    SET user_credits_points = COALESCE(user_credits_points, 0) + credits_to_add
    WHERE id = user_id_param
    RETURNING user_credits_points INTO new_credits;
    
    RETURN COALESCE(new_credits, 0);
END;
$$;

-- deduct_user_credits fonksiyonunu güvenli hale getir
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
    SELECT user_credits_points INTO current_credits FROM users WHERE id = user_id_param;
    
    IF current_credits IS NULL OR current_credits < credits_to_deduct THEN
        RETURN -1; -- Yetersiz kredi
    END IF;
    
    UPDATE users 
    SET user_credits_points = user_credits_points - credits_to_deduct
    WHERE id = user_id_param
    RETURNING user_credits_points INTO new_credits;
    
    RETURN new_credits;
END;
$$;

-- update_video_styles_updated_at fonksiyonunu güvenli hale getir
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

-- Tablo istatistiklerini güncelle
ANALYZE users;
ANALYZE videos;
ANALYZE video_styles;
ANALYZE ugc_tasks;
ANALYZE slider_videos;

-- =====================================================
-- 5. EK NOTLAR
-- =====================================================

-- HaveIBeenPwned şifre kontrolü için:
-- Supabase Dashboard > Authentication > Settings > Security
-- "Enable leaked password protection" seçeneğini aktifleştirin.
-- Bu işlem SQL ile yapılamaz, Dashboard üzerinden yapılmalıdır.

-- =====================================================
-- TAMAMLANDI!
-- =====================================================
-- Bu script'i çalıştırdıktan sonra:
-- 1. Supabase Dashboard'da "Linter" bölümünü kontrol edin
-- 2. Performans ve güvenlik uyarılarının azaldığını doğrulayın
-- 3. HaveIBeenPwned kontrolünü Dashboard'dan aktifleştirin
-- =====================================================
