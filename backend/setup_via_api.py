"""
Supabase REST API ile tabloları oluştur
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging
from datetime import datetime
import requests

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

SUPABASE_URL = "https://yxoynfnyrietkisnbqwf.supabase.co"
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
ADMIN_EMAIL = "beratyilmaz626@gmail.com"
ADMIN_PASSWORD = "berat881612"

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def execute_sql_via_api(sql_query):
    """SQL'i Supabase Management API ile çalıştır"""
    # Not: Bu yöntem direkt SQL çalıştıramaz, PostgreSQL REST API kullanmalıyız
    # Alternatif: Supabase CLI kullanmalıyız veya manuel yapmalıyız
    logger.warning("⚠️ SQL direkt çalıştırılamıyor. Supabase Dashboard'dan manuel oluşturulmalı.")
    return False


def create_admin_user():
    """Admin kullanıcıyı oluştur (tablolar varsa)"""
    logger.info("👤 Admin kullanıcı oluşturuluyor...")
    
    try:
        # Önce kontrol et
        result = supabase.table('users').select('*').eq('email', ADMIN_EMAIL).execute()
        
        if result.data:
            admin = result.data[0]
            logger.info(f"✅ Admin zaten mevcut: {admin['email']}")
            
            # Rolünü güncelle
            if admin.get('role') != 'admin':
                supabase.table('users').update({'role': 'admin'}).eq('id', admin['id']).execute()
                logger.info("🔄 Admin rolü güncellendi")
            
            # Diğer adminleri sil
            other_admins = supabase.table('users').select('*').eq('role', 'admin').neq('email', ADMIN_EMAIL).execute()
            if other_admins.data:
                for other in other_admins.data:
                    supabase.table('users').delete().eq('id', other['id']).execute()
                    logger.info(f"🗑️  Diğer admin silindi: {other['email']}")
            
            return admin
        else:
            # Yeni admin oluştur
            new_admin = {
                'email': ADMIN_EMAIL,
                'password': ADMIN_PASSWORD,
                'role': 'admin',
                'created_at': datetime.utcnow().isoformat()
            }
            
            result = supabase.table('users').insert(new_admin).execute()
            logger.info(f"✅ Admin oluşturuldu: {ADMIN_EMAIL}")
            return result.data[0]
            
    except Exception as e:
        logger.error(f"❌ Hata: {str(e)}")
        
        # Eğer tablo yoksa, kullanıcıya SQL göster
        if "Could not find the table" in str(e):
            logger.info("\n" + "=" * 60)
            logger.info("📋 SUPABASE DASHBOARD'A GİT VE SQL EDITOR'A YAPIŞIR:")
            logger.info("=" * 60)
            print_sql_to_run()
            logger.info("=" * 60)
        
        return None


def print_sql_to_run():
    """Çalıştırılması gereken SQL'i ekrana bas"""
    sql = """
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
    print(sql)


def main():
    logger.info("=" * 60)
    logger.info("🚀 UGC Project Manager - API Setup")
    logger.info("=" * 60)
    
    # Admin oluşturmayı dene
    admin = create_admin_user()
    
    if admin:
        logger.info("=" * 60)
        logger.info("✅ Kanka her şey tamam, sistem hazır!")
        logger.info(f"👤 Admin: {ADMIN_EMAIL}")
        logger.info(f"🔑 Admin ID: {admin.get('id', 'N/A')}")
        logger.info("=" * 60)
    else:
        logger.info("\n📝 ŞİMDİ YAPMAN GEREKENLER:")
        logger.info("1. Yukarıdaki SQL'i kopyala")
        logger.info("2. https://supabase.com/dashboard/project/yxoynfnyrietkisnbqwf/sql")
        logger.info("3. New query → SQL'i yapıştır → Run")
        logger.info("4. Bana 'Tamam' de, admin'i kontrol edeyim")


if __name__ == "__main__":
    main()
