-- GÜVENLİ VERSİYON (DROP yok, sadece CREATE)

-- 1. VIDEOS TABLOSU
CREATE TABLE IF NOT EXISTS public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'processing',
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

-- 2. USER_CREDITS TABLOSU
CREATE TABLE IF NOT EXISTS public.user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  credits integer DEFAULT 3 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. CREDIT_TRANSACTIONS TABLOSU
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount integer NOT NULL,
  transaction_type text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- 4. SLIDER_VIDEOS TABLOSU
CREATE TABLE IF NOT EXISTS public.slider_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  video_style text DEFAULT 'fitness',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 5. STRIPE_CUSTOMERS TABLOSU
CREATE TABLE IF NOT EXISTS public.stripe_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL UNIQUE,
  email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 6. STRIPE_ORDERS TABLOSU
CREATE TABLE IF NOT EXISTS public.stripe_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  stripe_payment_intent_id text NOT NULL UNIQUE,
  amount integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL,
  credits_purchased integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 7. STRIPE_SUBSCRIPTIONS TABLOSU
CREATE TABLE IF NOT EXISTS public.stripe_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
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

-- İNDEKSLER
CREATE INDEX IF NOT EXISTS videos_user_id_idx ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS videos_status_idx ON public.videos(status);
CREATE INDEX IF NOT EXISTS videos_created_at_idx ON public.videos(created_at DESC);
CREATE INDEX IF NOT EXISTS user_credits_user_id_idx ON public.user_credits(user_id);
CREATE INDEX IF NOT EXISTS credit_transactions_user_id_idx ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS slider_videos_display_order_idx ON public.slider_videos(display_order);

-- TRİGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- TRİGGERLAR (DROP yok, CREATE OR REPLACE kullan)
CREATE OR REPLACE TRIGGER update_videos_updated_at 
  BEFORE UPDATE ON public.videos 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_user_credits_updated_at 
  BEFORE UPDATE ON public.user_credits 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_stripe_subscriptions_updated_at 
  BEFORE UPDATE ON public.stripe_subscriptions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ÖRNEK VERİLER

-- Admin için kredi ekle
INSERT INTO public.user_credits (user_id, credits) 
VALUES ('81d25da8-5563-45c1-bd44-1826d368187a', 100)
ON CONFLICT (user_id) DO UPDATE SET credits = 100;

-- Slider videolar ekle
INSERT INTO public.slider_videos (title, video_url, thumbnail_url, video_style, display_order, is_active) VALUES
('Fitness Workout', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 'fitness', 1, true),
('Product Showcase', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'product', 2, true),
('Brand Story', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'cinematic', 3, true)
ON CONFLICT DO NOTHING;

-- Admin için örnek kredi işlemleri
INSERT INTO public.credit_transactions (user_id, amount, transaction_type, description) VALUES
('81d25da8-5563-45c1-bd44-1826d368187a', 100, 'bonus', 'Hoş geldin bonusu'),
('81d25da8-5563-45c1-bd44-1826d368187a', -10, 'usage', 'Video oluşturma'),
('81d25da8-5563-45c1-bd44-1826d368187a', 50, 'purchase', 'Kredi paketi')
ON CONFLICT DO NOTHING;
