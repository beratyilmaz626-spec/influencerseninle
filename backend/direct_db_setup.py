"""
HTTP istekleri ile Supabase Management API'ye SQL gönder
"""
import requests
import os
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

SUPABASE_URL = "https://yxoynfnyrietkisnbqwf.supabase.co"
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
PROJECT_REF = "yxoynfnyrietkisnbqwf"

SQL_SCRIPT = """
-- 1. Users Tablosu
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'client',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. UGC Tasks Tablosu
CREATE TABLE IF NOT EXISTS public.ugc_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    media_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. UGC Orders Tablosu
CREATE TABLE IF NOT EXISTS public.ugc_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    content_type TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending',
    deadline DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. UGC Media Tablosu
CREATE TABLE IF NOT EXISTS public.ugc_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.ugc_orders(id),
    media_url TEXT NOT NULL,
    file_type TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Logs Tablosu
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    details TEXT,
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin kullanıcı oluştur
INSERT INTO public.users (email, password, role)
VALUES ('beratyilmaz626@gmail.com', 'berat881612', 'admin')
ON CONFLICT (email) DO UPDATE SET role = 'admin';
"""


def execute_sql_via_postgrest():
    """PostgREST aracılığıyla SQL çalıştırmayı dene"""
    logger.info("🔧 PostgREST ile SQL çalıştırılıyor...")
    
    # Not: PostgREST direkt SQL execute etmez, sadece CRUD yapar
    # Bu yüzden Supabase Management API kullanmalıyız
    logger.warning("⚠️ PostgREST direkt SQL çalıştırmaz")
    return False


def create_sql_file():
    """SQL dosyasını oluştur ve kullanıcıya talimat ver"""
    sql_file = "/app/backend/migration.sql"
    
    with open(sql_file, 'w') as f:
        f.write(SQL_SCRIPT)
    
    logger.info(f"✅ SQL dosyası oluşturuldu: {sql_file}")
    return sql_file


def main():
    logger.info("=" * 60)
    logger.info("🚀 Supabase Direct Setup")
    logger.info("=" * 60)
    
    # SQL dosyasını oluştur
    sql_file = create_sql_file()
    
    logger.info("\n" + "=" * 60)
    logger.info("📋 MANUEL ADIMLAR (2 Dakika):")
    logger.info("=" * 60)
    logger.info("\n1️⃣ Supabase Dashboard'a git:")
    logger.info("   https://supabase.com/dashboard/project/yxoynfnyrietkisnbqwf/sql")
    logger.info("\n2️⃣ 'New query' butonuna tıkla")
    logger.info("\n3️⃣ Aşağıdaki SQL'i kopyala ve yapıştır:")
    logger.info("=" * 60)
    print(SQL_SCRIPT)
    logger.info("=" * 60)
    logger.info("\n4️⃣ 'Run' (Ctrl+Enter) butonuna tıkla")
    logger.info("\n5️⃣ Başarılı olunca bana 'tamam' yaz")
    logger.info("\n✅ SQL dosyası: {sql_file}")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()
