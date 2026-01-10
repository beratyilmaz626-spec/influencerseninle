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

-- =====================================================
-- 2. GÜVENLİK DÜZELTMELERİ - ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Users tablosu için RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi profillerini görebilir
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT
    USING (auth.uid()::text = id::text OR is_admin = true);

-- Kullanıcılar sadece kendi profillerini güncelleyebilir
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE
    USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

-- Service role tam erişim
DROP POLICY IF EXISTS "Service role has full access to users" ON users;
CREATE POLICY "Service role has full access to users" ON users
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- Videos tablosu için RLS
-- =====================================================

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi videolarını görebilir
DROP POLICY IF EXISTS "Users can view own videos" ON videos;
CREATE POLICY "Users can view own videos" ON videos
    FOR SELECT
    USING (auth.uid()::text = user_id::text);

-- Kullanıcılar video oluşturabilir
DROP POLICY IF EXISTS "Users can insert own videos" ON videos;
CREATE POLICY "Users can insert own videos" ON videos
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id::text);

-- Kullanıcılar kendi videolarını güncelleyebilir
DROP POLICY IF EXISTS "Users can update own videos" ON videos;
CREATE POLICY "Users can update own videos" ON videos
    FOR UPDATE
    USING (auth.uid()::text = user_id::text)
    WITH CHECK (auth.uid()::text = user_id::text);

-- Kullanıcılar kendi videolarını silebilir
DROP POLICY IF EXISTS "Users can delete own videos" ON videos;
CREATE POLICY "Users can delete own videos" ON videos
    FOR DELETE
    USING (auth.uid()::text = user_id::text);

-- Service role tam erişim (n8n webhook için gerekli)
DROP POLICY IF EXISTS "Service role has full access to videos" ON videos;
CREATE POLICY "Service role has full access to videos" ON videos
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- Video Styles tablosu için RLS
-- =====================================================

ALTER TABLE video_styles ENABLE ROW LEVEL SECURITY;

-- Herkes aktif stilleri görebilir
DROP POLICY IF EXISTS "Anyone can view active styles" ON video_styles;
CREATE POLICY "Anyone can view active styles" ON video_styles
    FOR SELECT
    USING (is_active = true);

-- Sadece admin stiller ekleyebilir/güncelleyebilir
DROP POLICY IF EXISTS "Service role can manage styles" ON video_styles;
CREATE POLICY "Service role can manage styles" ON video_styles
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- 3. EK GÜVENLİK - HASSAS VERİLERİ KORUMA
-- =====================================================

-- Password sütununu kaldır (Supabase Auth zaten şifreleri yönetiyor)
-- NOT: Bu komutu çalıştırmadan önce yedek alın!
-- ALTER TABLE users DROP COLUMN IF EXISTS password;

-- =====================================================
-- 4. PERFORMANS - VACUUM VE ANALYZE
-- =====================================================

-- Tablo istatistiklerini güncelle
ANALYZE users;
ANALYZE videos;
ANALYZE video_styles;

-- =====================================================
-- TAMAMLANDI!
-- =====================================================
