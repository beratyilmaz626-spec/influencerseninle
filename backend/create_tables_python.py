"""
Python ile direkt Supabase'de tabloları oluştur (SQL Editor olmadan)
"""
from supabase import create_client
import os
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

SUPABASE_URL = "https://yxoynfnyrietkisnbqwf.supabase.co"
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# SQL'i parçalar halinde çalıştıracağız
SQLS = [
    # 1. Videos
    """
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
    )
    """,
    
    # 2. User Credits
    """
    CREATE TABLE IF NOT EXISTS public.user_credits (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL UNIQUE,
      credits integer DEFAULT 3 NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    )
    """,
    
    # 3. Credit Transactions
    """
    CREATE TABLE IF NOT EXISTS public.credit_transactions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      amount integer NOT NULL,
      transaction_type text NOT NULL,
      description text,
      created_at timestamptz DEFAULT now()
    )
    """,
    
    # 4. Slider Videos
    """
    CREATE TABLE IF NOT EXISTS public.slider_videos (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      title text NOT NULL,
      video_url text NOT NULL,
      thumbnail_url text,
      video_style text DEFAULT 'fitness',
      display_order integer DEFAULT 0,
      is_active boolean DEFAULT true,
      created_at timestamptz DEFAULT now()
    )
    """,
    
    # 5. Stripe Customers
    """
    CREATE TABLE IF NOT EXISTS public.stripe_customers (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL UNIQUE,
      stripe_customer_id text NOT NULL UNIQUE,
      email text NOT NULL,
      created_at timestamptz DEFAULT now()
    )
    """,
    
    # 6. Stripe Orders
    """
    CREATE TABLE IF NOT EXISTS public.stripe_orders (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL,
      stripe_payment_intent_id text NOT NULL UNIQUE,
      amount integer NOT NULL,
      currency text NOT NULL DEFAULT 'usd',
      status text NOT NULL,
      credits_purchased integer NOT NULL,
      created_at timestamptz DEFAULT now()
    )
    """,
    
    # 7. Stripe Subscriptions
    """
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
    )
    """
]

def execute_sql(sql):
    """SQL'i Supabase üzerinden çalıştır"""
    try:
        # RPC ile SQL çalıştır (eğer function varsa)
        # Alternatif: psycopg2 ile direkt bağlan
        import psycopg2
        
        conn = psycopg2.connect(
            host="db.yxoynfnyrietkisnbqwf.supabase.co",
            database="postgres",
            user="postgres",
            password="beratY881612",
            port="5432",
            sslmode='require',
            connect_timeout=10
        )
        
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        cursor.close()
        conn.close()
        
        return True
    except Exception as e:
        logger.error(f"SQL hatası: {str(e)[:100]}")
        return False


def main():
    logger.info("🔨 Tabloları oluşturuyorum...")
    
    for i, sql in enumerate(SQLS, 1):
        table_name = sql.split("public.")[1].split(" ")[0] if "public." in sql else f"Table{i}"
        logger.info(f"{i}. {table_name} oluşturuluyor...")
        
        if execute_sql(sql):
            logger.info(f"   ✅ {table_name} hazır")
        else:
            logger.error(f"   ❌ {table_name} oluşturulamadı")
    
    # Örnek verileri ekle
    logger.info("\n📝 Örnek veriler ekleniyor...")
    
    try:
        # Admin kredi
        supabase.table('user_credits').upsert({
            'user_id': '81d25da8-5563-45c1-bd44-1826d368187a',
            'credits': 100
        }, on_conflict='user_id').execute()
        logger.info("✅ Admin kredisi eklendi")
        
        # Slider videolar
        sliders = [
            {'title': 'Fitness Workout', 'video_url': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'thumbnail_url': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800', 'video_style': 'fitness', 'display_order': 1},
            {'title': 'Product Showcase', 'video_url': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'thumbnail_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'video_style': 'product', 'display_order': 2},
            {'title': 'Brand Story', 'video_url': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 'thumbnail_url': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 'video_style': 'cinematic', 'display_order': 3}
        ]
        
        for slider in sliders:
            try:
                supabase.table('slider_videos').insert(slider).execute()
            except:
                pass
        
        logger.info("✅ Slider videolar eklendi")
        
    except Exception as e:
        logger.warning(f"⚠️ Örnek veriler eklenemedi: {str(e)[:50]}")
    
    logger.info("\n✅ İşlem tamamlandı!")


if __name__ == "__main__":
    main()
