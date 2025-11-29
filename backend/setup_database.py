"""
Supabase PostgreSQL veritabanına tabloları oluştur
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Supabase PostgreSQL connection
DB_HOST = "db.yxoynfnyrietkisnbqwf.supabase.co"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "beratY881612"
DB_PORT = "5432"

# SQL for creating tables
CREATE_TABLES_SQL = """
-- 1. Users Tablosu
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'client')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. UGC Tasks Tablosu
CREATE TABLE IF NOT EXISTS public.ugc_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
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
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_production', 'completed', 'cancelled')),
    deadline DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. UGC Media Tablosu
CREATE TABLE IF NOT EXISTS public.ugc_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.ugc_orders(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    file_type TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Logs Tablosu
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    details TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_ugc_tasks_user_id ON public.ugc_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_ugc_orders_status ON public.ugc_orders(status);
CREATE INDEX IF NOT EXISTS idx_ugc_media_order_id ON public.ugc_media(order_id);
CREATE INDEX IF NOT EXISTS idx_logs_user_id ON public.logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs(created_at DESC);
"""

# SQL for creating admin user
CREATE_ADMIN_SQL = """
INSERT INTO public.users (email, password, role, created_at)
VALUES ('beratyilmaz626@gmail.com', 'berat881612', 'admin', NOW())
ON CONFLICT (email) DO UPDATE SET role = 'admin';
"""

def create_database_connection():
    """PostgreSQL bağlantısı oluştur"""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT,
            sslmode='require'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        logger.info(f"✅ PostgreSQL bağlantısı başarılı: {DB_HOST}")
        return conn
    except Exception as e:
        logger.error(f"❌ Bağlantı hatası: {str(e)}")
        return None


def create_tables(conn):
    """Tabloları oluştur"""
    try:
        cursor = conn.cursor()
        logger.info("🔨 Tablolar oluşturuluyor...")
        
        # Execute table creation SQL
        cursor.execute(CREATE_TABLES_SQL)
        
        logger.info("✅ Tablolar başarıyla oluşturuldu!")
        cursor.close()
        return True
    except Exception as e:
        logger.error(f"❌ Tablo oluşturma hatası: {str(e)}")
        return False


def create_admin_user(conn):
    """Admin kullanıcıyı oluştur"""
    try:
        cursor = conn.cursor()
        logger.info("👤 Admin kullanıcı oluşturuluyor...")
        
        # İlk önce diğer adminleri sil
        cursor.execute("""
            DELETE FROM public.users 
            WHERE role = 'admin' AND email != 'beratyilmaz626@gmail.com'
        """)
        deleted = cursor.rowcount
        if deleted > 0:
            logger.info(f"🗑️  {deleted} adet başka admin kullanıcı silindi")
        
        # Admin oluştur veya güncelle
        cursor.execute(CREATE_ADMIN_SQL)
        
        logger.info("✅ Admin kullanıcı hazır: beratyilmaz626@gmail.com")
        cursor.close()
        return True
    except Exception as e:
        logger.error(f"❌ Admin oluşturma hatası: {str(e)}")
        return False


def verify_tables(conn):
    """Tabloları doğrula"""
    try:
        cursor = conn.cursor()
        
        tables = ['users', 'ugc_tasks', 'ugc_orders', 'ugc_media', 'logs']
        logger.info("🔍 Tablolar kontrol ediliyor...")
        
        for table in tables:
            cursor.execute(f"""
                SELECT COUNT(*) FROM information_schema.tables 
                WHERE table_schema = 'public' AND table_name = '{table}'
            """)
            exists = cursor.fetchone()[0]
            
            if exists:
                cursor.execute(f"SELECT COUNT(*) FROM public.{table}")
                count = cursor.fetchone()[0]
                logger.info(f"  ✅ {table}: {count} kayıt")
            else:
                logger.warning(f"  ❌ {table}: Tablo yok!")
        
        cursor.close()
        return True
    except Exception as e:
        logger.error(f"❌ Doğrulama hatası: {str(e)}")
        return False


def main():
    """Ana kurulum fonksiyonu"""
    logger.info("=" * 60)
    logger.info("🚀 UGC Project Manager - Database Setup")
    logger.info("=" * 60)
    
    # 1. Bağlantı
    conn = create_database_connection()
    if not conn:
        logger.error("❌ Veritabanı bağlantısı kurulamadı!")
        return
    
    # 2. Tabloları oluştur
    if not create_tables(conn):
        logger.error("❌ Tablolar oluşturulamadı!")
        conn.close()
        return
    
    # 3. Admin kullanıcıyı oluştur
    if not create_admin_user(conn):
        logger.error("❌ Admin kullanıcı oluşturulamadı!")
        conn.close()
        return
    
    # 4. Doğrula
    verify_tables(conn)
    
    # 5. Kapat
    conn.close()
    
    logger.info("=" * 60)
    logger.info("✅ Kanka her şey tamam, sistem hazır!")
    logger.info("👤 Admin: beratyilmaz626@gmail.com")
    logger.info("🔑 Şifre: berat881612")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()
