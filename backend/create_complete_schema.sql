-- COMPLETE UGC VIDEO PLATFORM SCHEMA
-- Tüm eksik tabloları oluştur + örnek veriler ekle

-- 1. Video Styles (video tarzları)
CREATE TABLE IF NOT EXISTS public.video_styles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Videos (video içerikleri)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    style_id UUID REFERENCES public.video_styles(id),
    status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    duration INTEGER,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Slider Videos (ana sayfada gösterilen videolar)
CREATE TABLE IF NOT EXISTS public.slider_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Credits (kullanıcı kredileri)
CREATE TABLE IF NOT EXISTS public.user_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) UNIQUE,
    credits INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Credit Transactions (kredi işlemleri)
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    amount INTEGER NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('purchase', 'usage', 'refund', 'bonus')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Subscriptions (abonelikler)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    plan_name TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
    credits_per_month INTEGER DEFAULT 0,
    price DECIMAL(10,2),
    start_date TIMESTAMPTZ DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler ekle
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_style_id ON public.videos(style_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);
CREATE INDEX IF NOT EXISTS idx_slider_videos_order ON public.slider_videos(display_order);
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON public.user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);

-- ÖRNEK VERİLER EKLE

-- Video Styles (5 farklı stil)
INSERT INTO public.video_styles (name, description, thumbnail_url, is_active) VALUES
('Minimalist', 'Sade ve modern video stili', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', true),
('Dinamik', 'Hareketli ve enerjik video stili', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400', true),
('Profesyonel', 'Kurumsal ve profesyonel görünüm', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400', true),
('Yaratıcı', 'Özgün ve yaratıcı tasarım', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', true),
('Retro', 'Nostaljik ve vintage stil', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400', true)
ON CONFLICT DO NOTHING;

-- Slider Videos (ana sayfa videoları)
INSERT INTO public.slider_videos (title, video_url, thumbnail_url, display_order, is_active) VALUES
('Ürün Tanıtım Videosu', 'https://example.com/video1.mp4', 'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?w=800', 1, true),
('Marka Hikayesi', 'https://example.com/video2.mp4', 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800', 2, true),
('Müşteri Yorumları', 'https://example.com/video3.mp4', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800', 3, true)
ON CONFLICT DO NOTHING;

-- UGC Orders (örnek siparişler)
INSERT INTO public.ugc_orders (client_name, client_email, content_type, details, status, deadline) VALUES
('Ahmet Yılmaz', 'ahmet@example.com', 'Ürün Tanıtım', 'Yeni ürün lansmanı için video', 'pending', CURRENT_DATE + 7),
('Zeynep Kaya', 'zeynep@example.com', 'Sosyal Medya', 'Instagram reels içeriği', 'in_production', CURRENT_DATE + 5),
('Mehmet Demir', 'mehmet@example.com', 'Reklam', 'YouTube reklam kampanyası', 'completed', CURRENT_DATE - 2)
ON CONFLICT DO NOTHING;

-- UGC Tasks (örnek görevler) - Admin user için
INSERT INTO public.ugc_tasks (user_id, title, description, status, media_url) VALUES
('81d25da8-5563-45c1-bd44-1826d368187a', 'Video Edit - Proje A', 'Ürün tanıtım videosu düzenleme', 'in_progress', NULL),
('81d25da8-5563-45c1-bd44-1826d368187a', 'Script Yazımı - Proje B', 'Sosyal medya içeriği için script', 'completed', 'https://example.com/script.pdf'),
('81d25da8-5563-45c1-bd44-1826d368187a', 'Müşteri Görüşmesi - Proje C', 'Brief toplantısı ve içerik planlama', 'pending', NULL)
ON CONFLICT DO NOTHING;

-- Admin için kredi ekle
INSERT INTO public.user_credits (user_id, credits) VALUES
('81d25da8-5563-45c1-bd44-1826d368187a', 100)
ON CONFLICT (user_id) DO UPDATE SET credits = 100;

-- Kredi işlemleri ekle
INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description) VALUES
('81d25da8-5563-45c1-bd44-1826d368187a', 100, 'bonus', 'Hoş geldin bonusu'),
('81d25da8-5563-45c1-bd44-1826d368187a', -10, 'usage', 'Video oluşturma'),
('81d25da8-5563-45c1-bd44-1826d368187a', 50, 'purchase', 'Kredi paketi satın alma')
ON CONFLICT DO NOTHING;

-- Log kayıtları ekle
INSERT INTO public.logs (action, details, user_id) VALUES
('user_login', 'Admin kullanıcı giriş yaptı', '81d25da8-5563-45c1-bd44-1826d368187a'),
('video_created', 'Yeni video oluşturuldu', '81d25da8-5563-45c1-bd44-1826d368187a'),
('order_created', 'Yeni sipariş alındı', '81d25da8-5563-45c1-bd44-1826d368187a'),
('credits_purchased', '50 kredi satın alındı', '81d25da8-5563-45c1-bd44-1826d368187a')
ON CONFLICT DO NOTHING;
