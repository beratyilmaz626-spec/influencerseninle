-- ========================================
-- COMPLETE SCHEMA SETUP FOR SUPABASE
-- ========================================
-- This script creates all required tables, functions, triggers, and sample data
-- Based on original migration files from ugcgo-main project
-- ========================================

-- ========================================
-- 1. CREATE VIDEOS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  duration text DEFAULT '0:00',
  views integer DEFAULT 0,
  product_url text,
  product_name text,
  selected_style text,
  selected_voice text,
  script_content text,
  video_url text,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Videos RLS Policies
CREATE POLICY "Authenticated users can view all videos"
  ON videos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert videos"
  ON videos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos"
  ON videos FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos"
  ON videos FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Service role full access on videos"
  ON videos FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Videos Indexes
CREATE INDEX IF NOT EXISTS videos_user_id_idx ON videos(user_id);
CREATE INDEX IF NOT EXISTS videos_status_idx ON videos(status);
CREATE INDEX IF NOT EXISTS videos_created_at_idx ON videos(created_at DESC);

-- Videos Update Trigger
CREATE OR REPLACE FUNCTION update_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_videos_updated_at_trigger
  BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_videos_updated_at();

-- ========================================
-- 2. CREATE SLIDER_VIDEOS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS slider_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE slider_videos ENABLE ROW LEVEL SECURITY;

-- Slider Videos RLS Policies
CREATE POLICY "Authenticated users can manage slider videos"
  ON slider_videos FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can view active slider videos"
  ON slider_videos FOR SELECT TO public USING (is_active = true);

-- Slider Videos Indexes
CREATE INDEX IF NOT EXISTS slider_videos_order_idx ON slider_videos (order_index ASC, created_at DESC);

-- Slider Videos Update Trigger
CREATE OR REPLACE FUNCTION update_slider_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_slider_videos_updated_at_trigger
  BEFORE UPDATE ON slider_videos
  FOR EACH ROW EXECUTE FUNCTION update_slider_videos_updated_at();

-- ========================================
-- 3. CREATE USER_CREDITS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credits integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- User Credits RLS Policies
CREATE POLICY "Users can view their own credits"
  ON user_credits FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all credits"
  ON user_credits FOR ALL TO service_role USING (true) WITH CHECK (true);

-- User Credits Indexes
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);

-- User Credits Update Trigger
CREATE OR REPLACE FUNCTION update_user_credits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_credits_updated_at_trigger
  BEFORE UPDATE ON user_credits
  FOR EACH ROW EXECUTE FUNCTION update_user_credits_updated_at();

-- ========================================
-- 4. CREATE CREDIT_TRANSACTIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount integer NOT NULL,
  type text NOT NULL CHECK (type IN ('purchase', 'signup_bonus', 'video_creation', 'refund')),
  description text NOT NULL,
  stripe_order_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Credit Transactions RLS Policies
CREATE POLICY "Users can view their own transactions"
  ON credit_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all transactions"
  ON credit_transactions FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Credit Transactions Indexes
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_stripe_order_id ON credit_transactions(stripe_order_id) WHERE stripe_order_id IS NOT NULL;

-- ========================================
-- 5. CREATE STRIPE TABLES
-- ========================================

-- Stripe Customers Table
CREATE TABLE IF NOT EXISTS stripe_customers (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  customer_id text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz DEFAULT NULL
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own customer data"
  ON stripe_customers FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Stripe Subscription Status Enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stripe_subscription_status') THEN
    CREATE TYPE stripe_subscription_status AS ENUM (
      'not_started', 'incomplete', 'incomplete_expired', 'trialing',
      'active', 'past_due', 'canceled', 'unpaid', 'paused'
    );
  END IF;
END $$;

-- Stripe Subscriptions Table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  customer_id text UNIQUE NOT NULL,
  subscription_id text DEFAULT NULL,
  price_id text DEFAULT NULL,
  current_period_start bigint DEFAULT NULL,
  current_period_end bigint DEFAULT NULL,
  cancel_at_period_end boolean DEFAULT false,
  payment_method_brand text DEFAULT NULL,
  payment_method_last4 text DEFAULT NULL,
  status stripe_subscription_status NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz DEFAULT NULL
);

ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription data"
  ON stripe_subscriptions FOR SELECT TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM stripe_customers
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    ) AND deleted_at IS NULL
  );

-- Stripe Order Status Enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stripe_order_status') THEN
    CREATE TYPE stripe_order_status AS ENUM ('pending', 'completed', 'canceled');
  END IF;
END $$;

-- Stripe Orders Table
CREATE TABLE IF NOT EXISTS stripe_orders (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  checkout_session_id text NOT NULL,
  payment_intent_id text NOT NULL,
  customer_id text NOT NULL,
  amount_subtotal bigint NOT NULL,
  amount_total bigint NOT NULL,
  currency text NOT NULL,
  payment_status text NOT NULL,
  status stripe_order_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  deleted_at timestamptz DEFAULT NULL
);

ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order data"
  ON stripe_orders FOR SELECT TO authenticated
  USING (
    customer_id IN (
      SELECT customer_id FROM stripe_customers
      WHERE user_id = auth.uid() AND deleted_at IS NULL
    ) AND deleted_at IS NULL
  );

-- ========================================
-- 6. ADD is_admin COLUMN TO USERS TABLE
-- ========================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_credits_points integer DEFAULT 2;

-- ========================================
-- 7. CREDIT MANAGEMENT FUNCTIONS
-- ========================================

-- Function to add credits to user
CREATE OR REPLACE FUNCTION add_user_credits(
  p_user_id uuid,
  p_amount integer,
  p_type text,
  p_description text,
  p_stripe_order_id text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_credits (user_id, credits)
  VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    credits = user_credits.credits + p_amount,
    updated_at = now();

  INSERT INTO credit_transactions (user_id, amount, type, description, stripe_order_id)
  VALUES (p_user_id, p_amount, p_type, p_description, p_stripe_order_id);
END;
$$;

-- Function to deduct credits from user
CREATE OR REPLACE FUNCTION deduct_user_credits(
  p_user_id uuid,
  p_amount integer,
  p_type text,
  p_description text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits integer;
BEGIN
  SELECT credits INTO current_credits
  FROM user_credits
  WHERE user_id = p_user_id;

  IF current_credits IS NULL OR current_credits < p_amount THEN
    RETURN false;
  END IF;

  UPDATE user_credits
  SET credits = credits - p_amount, updated_at = now()
  WHERE user_id = p_user_id;

  INSERT INTO credit_transactions (user_id, amount, type, description)
  VALUES (p_user_id, -p_amount, p_type, p_description);

  RETURN true;
END;
$$;

-- ========================================
-- 8. USER PROFILE FUNCTION
-- ========================================
CREATE OR REPLACE FUNCTION get_user_profile(user_id uuid)
RETURNS TABLE (
  id uuid,
  email text,
  full_name text,
  company_name text,
  country text,
  created_at timestamptz,
  updated_at timestamptz,
  is_admin boolean,
  user_credits_points integer
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  IF auth.uid() != user_id THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT 
    u.id, u.email, u.full_name, u.company_name, u.country,
    u.created_at, u.updated_at, u.is_admin, u.user_credits_points
  FROM users u
  WHERE u.id = user_id;
END;
$$;

-- ========================================
-- 9. CREATE VIDEO_STYLES TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS video_styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  style_id text NOT NULL UNIQUE,
  name text NOT NULL,
  image text,
  prompt text NOT NULL,
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  category jsonb,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE video_styles ENABLE ROW LEVEL SECURITY;

-- Video Styles RLS Policies
CREATE POLICY "Public can view active video styles"
  ON video_styles FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Authenticated users can view all video styles"
  ON video_styles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Service role can manage video styles"
  ON video_styles FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Video Styles Indexes
CREATE INDEX IF NOT EXISTS video_styles_order_idx ON video_styles (order_index ASC);
CREATE INDEX IF NOT EXISTS video_styles_style_id_idx ON video_styles (style_id);
CREATE INDEX IF NOT EXISTS video_styles_is_active_idx ON video_styles (is_active);

-- Video Styles Update Trigger
CREATE OR REPLACE FUNCTION update_video_styles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_video_styles_updated_at_trigger
  BEFORE UPDATE ON video_styles
  FOR EACH ROW EXECUTE FUNCTION update_video_styles_updated_at();

-- ========================================
-- 10. UPDATE EXISTING ADMIN USER
-- ========================================
UPDATE users 
SET is_admin = true, user_credits_points = 2
WHERE email = 'beratyilmaz626@gmail.com';

-- ========================================
-- 11. SAMPLE DATA - VIDEO STYLES
-- ========================================
INSERT INTO video_styles (id, style_id, name, image, prompt, order_index, is_active, category, description)
VALUES 
  ('003f93d2-a6dd-4398-a243-551a112c422e', 'Jib UP', 'Jib UP', '/jib-up.mp4', 'Kamera aşağıdan yukarıya doğru yükselir, kişiyi veya ürünü dramatik biçimde ortaya çıkarır. Sinematik ışık ve yumuşak geçiş.', 15, true, '["Giyim","Yemek"]', 'Tavsiye Edilen Ürünler: Gözlük, Üst giyim, çanta'),
  ('4494f010-e798-447f-92a5-a9c741af7e06', 'Sunglasses', 'Sunglasses', '/sunglasses.mp4', 'Güneş gözlüğü takan kişi, parlak gün ışığında poz veriyor. Lenslerde yansıyan manzara, stil ve özgüven vurgusu.', 13, true, '["Ürün"]', NULL),
  ('485387ce-104e-416a-a518-975dab05f16d', 'Luxury', 'Luxury', '/yacht.mp4', 'Lüks atmosfer: altın tonlar, zarif detaylar, pahalı aksesuarlar. Şık giyim, yavaş kamera hareketi, elit his.', 14, true, '["Ürün"]', NULL),
  ('558d317b-ee20-4340-bd15-e82aa575a225', 'business', 'Explosion', '/explosion.mp4', 'Bir patlama anı — arka planda alev ve duman, önde sakin duran kişi veya araç. Dramatik, sinematik ışıklandırma.', 6, true, '["Ürün"]', NULL),
  ('69ec1ccf-65cd-429e-af43-88180e08c9b4', 'beauty', 'Giant Grab', '/giant-crab.mp4', 'Gerçeküstü bir animasyon: dev bir el, minik bir ürünü nazikçe yakalar. Kamera aşağıdan bakar, büyüklük farkı vurgulanır. Elin hareketi zarif, ışık sıcak tonlarda.', 5, true, '["Ürün"]', NULL),
  ('72b9aa55-4e6c-48c0-9f06-c4fd42a98647', 'lifestyle', '3D Rotation', '/3d-rotation.mp4', 'Bir kişi veya nesne 360 derece dönerek gösterilir. Gölge ve ışık detaylarıyla hacim vurgulanır.', 10, true, '["Ürün"]', NULL),
  ('7b56ed08-691e-4a03-b5ee-ccac23665c08', 'travel', 'Dance', '/dance.mp4', 'Işıklı stüdyoda dans eden kişi, enerjik hareketler, ritmik tempo. Kıyafet ve saçların hareketi vurgulanır.', 7, true, '["Ürün","Sağlık"]', 'Tavsiye Edilen Ürünler: Saç ürünleri, giyim'),
  ('859676b7-1e3e-47a2-b14a-ee0003d35187', 'nature', 'Timelapse', '/timelapse.mp4', 'Gün batımında insanların hareket ettiği hızlı çekim sahnesi, enerjik atmosfer.', 3, true, '["Ürün"]', NULL),
  ('85c4e125-a7d1-4538-9140-19fd051dde22', 'sports', 'Selfie', '/selfie.mp4', 'Rahat bir ortamda doğal bir selfie, samimi ifade, güneş gözlüğüyle dış mekanda.', 1, true, '["Ürün"]', NULL),
  ('87395192-c860-44ad-bc1e-0335a5583399', 'Group', 'Group', '/group.mp4', 'Bir grup insan birlikte poz verir, gülümser veya eğlenceli bir an paylaşır. Doğal, samimi atmosfer.', 12, true, '["Ürün"]', NULL),
  ('a48ee7c8-b68f-45ea-ae71-4f1184a2032e', 'fashion', 'Close Up', '/close-up-2.mp4', 'Close Up', 2, true, '["Giyim"]', 'Moda ürünü yakın plan çekim, kumaş detayları ve doku odaklı kadraj.'),
  ('cb2cbef9-0bc4-496d-b2b9-3f4b5f9bf2fc', 'fitness', 'Fish Eye', '/fisheye.mp4', 'Balıkgözü lens efektiyle çekim, abartılı perspektif, renkli arka plan, eğlenceli pozlar.', 9, true, '["Ürün"]', NULL),
  ('cf11c642-fe14-4d64-aac4-58b9f90d6348', 'street-style', 'Fit Check', '/fit-check.mp4', 'Sokak tarzı kıyafet tanıtımı, tam boy çekim, kullanıcı ürün kutusunu açıyor ve giyiyor.', 1, true, '["Giyim","Aksesuar"]', 'Tavsiye Edilen Ürünler: Her türlü giyim ve aksesuar ürünleri'),
  ('de8ae7a1-dfb1-45d0-914d-3d81d3435d2b', 'food', '360°', '/360.mp4', '360°', 4, true, '["Giyim","Aksesuar","Güzellik"]', 'Yüz ve aksesuarları öne çıkaran 360 derece dönen çekim, doğal ışıkla güzellik odaklı.'),
  ('f6a381fd-b329-4681-93ea-e4c68598f79c', 'home', 'Plate Check', '/plate-check.mp4', 'Bir masa başında tabaktaki yemeği inceleyen kişi. Gün ışığı, sıcak tonlar, iştah açıcı detaylar.', 11, true, '["Yemek"]', 'Tavsiye Edilen Ürünler: Her türlü yiyecek ve içecek'),
  ('fac8bb44-50b1-4ea5-9067-1a75aa40bdaf', 'technology', 'Eating', '/eating.mp4', 'Şık bir kişi yemek yerken kameraya bakar. Komik ama stil sahibi bir atmosfer, yakın plan çekim.', 8, true, '["Ürün"]', NULL)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 12. SAMPLE DATA - SLIDER VIDEOS
-- ========================================
INSERT INTO slider_videos (title, video_url, thumbnail_url, order_index, is_active)
VALUES 
  ('Örnek Video 1', 'https://example.com/video1.mp4', 'https://example.com/thumb1.jpg', 1, true),
  ('Örnek Video 2', 'https://example.com/video2.mp4', 'https://example.com/thumb2.jpg', 2, true),
  ('Örnek Video 3', 'https://example.com/video3.mp4', 'https://example.com/thumb3.jpg', 3, true)
ON CONFLICT DO NOTHING;

-- ========================================
-- SETUP COMPLETE
-- ========================================
