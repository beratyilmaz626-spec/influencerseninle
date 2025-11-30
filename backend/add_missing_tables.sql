-- ORİJİNAL PROJENİN EKSİK TABLOLARI
-- users zaten var, sadece eksikleri ekliyoruz

-- 1. VIDEOS TABLOSU
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

CREATE POLICY "Users can view their own videos" ON videos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own videos" ON videos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own videos" ON videos FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own videos" ON videos FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 2. USER_CREDITS TABLOSU
CREATE TABLE IF NOT EXISTS user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  credits integer DEFAULT 3 NOT NULL CHECK (credits >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credits" ON user_credits FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own credits" ON user_credits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own credits" ON user_credits FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 3. CREDIT_TRANSACTIONS TABLOSU
CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('purchase', 'usage', 'refund', 'bonus')),
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions" ON credit_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own transactions" ON credit_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 4. SLIDER_VIDEOS TABLOSU
CREATE TABLE IF NOT EXISTS slider_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  video_style text DEFAULT 'fitness',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE slider_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active slider videos" ON slider_videos FOR SELECT USING (is_active = true);

-- 5. STRIPE_CUSTOMERS TABLOSU
CREATE TABLE IF NOT EXISTS stripe_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL UNIQUE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stripe customer" ON stripe_customers FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 6. STRIPE_ORDERS TABLOSU
CREATE TABLE IF NOT EXISTS stripe_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_payment_intent_id text NOT NULL UNIQUE,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL,
  credits_purchased integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON stripe_orders FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 7. STRIPE_SUBSCRIPTIONS TABLOSU
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL,
  plan_name text NOT NULL,
  status text NOT NULL,
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions" ON stripe_subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- İNDEKSLER
CREATE INDEX IF NOT EXISTS videos_user_id_idx ON videos(user_id);
CREATE INDEX IF NOT EXISTS videos_status_idx ON videos(status);
CREATE INDEX IF NOT EXISTS videos_created_at_idx ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS user_credits_user_id_idx ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS credit_transactions_user_id_idx ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS credit_transactions_created_at_idx ON credit_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS slider_videos_display_order_idx ON slider_videos(display_order);
CREATE INDEX IF NOT EXISTS stripe_customers_user_id_idx ON stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS stripe_customers_stripe_customer_id_idx ON stripe_customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS stripe_orders_user_id_idx ON stripe_orders(user_id);
CREATE INDEX IF NOT EXISTS stripe_subscriptions_user_id_idx ON stripe_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS stripe_subscriptions_stripe_subscription_id_idx ON stripe_subscriptions(stripe_subscription_id);

-- TRİGGERLAR
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_credits_updated_at BEFORE UPDATE ON user_credits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stripe_subscriptions_updated_at BEFORE UPDATE ON stripe_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ÖRNEK VERİLER

-- Admin için kredi ekle
INSERT INTO user_credits (user_id, credits) 
VALUES ('81d25da8-5563-45c1-bd44-1826d368187a', 100)
ON CONFLICT (user_id) DO UPDATE SET credits = 100;

-- Slider videolar ekle
INSERT INTO slider_videos (title, video_url, thumbnail_url, video_style, display_order) VALUES
('Fitness Workout', 'https://example.com/fitness.mp4', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 'fitness', 1),
('Product Showcase', 'https://example.com/product.mp4', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'product', 2),
('Brand Story', 'https://example.com/brand.mp4', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'cinematic', 3)
ON CONFLICT DO NOTHING;
