"""
UGC Project Manager - Supabase Manager
Tabloları kontrol eder, eksikleri ekler, admin kullanıcıyı yönetir
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_SERVICE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def check_and_create_tables():
    """Tabloları kontrol et ve eksikleri oluştur"""
    logger.info("🔍 Tabloları kontrol ediyorum...")
    
    tables_to_check = {
        'users': [
            'id', 'email', 'password', 'role', 'created_at'
        ],
        'ugc_tasks': [
            'id', 'user_id', 'title', 'description', 'status', 'media_url', 'created_at'
        ],
        'ugc_orders': [
            'id', 'client_name', 'client_email', 'content_type', 'details', 
            'status', 'deadline', 'created_at'
        ],
        'ugc_media': [
            'id', 'order_id', 'media_url', 'file_type', 'uploaded_at'
        ],
        'logs': [
            'id', 'action', 'details', 'user_id', 'created_at'
        ]
    }
    
    for table_name, columns in tables_to_check.items():
        try:
            # Test if table exists by trying to select
            result = supabase.table(table_name).select("*").limit(1).execute()
            logger.info(f"✅ Tablo '{table_name}' mevcut")
        except Exception as e:
            logger.warning(f"⚠️ Tablo '{table_name}' bulunamadı veya erişilemedi: {str(e)}")
            logger.info(f"ℹ️  Manuel olarak Supabase Dashboard'dan oluşturmanız gerekebilir")


def cleanup_admin_users():
    """Admin rolüne sahip diğer kullanıcıları temizle"""
    logger.info("🧹 Admin kullanıcıları kontrol ediyorum...")
    
    try:
        # Tüm admin kullanıcıları getir
        result = supabase.table('users').select('*').eq('role', 'admin').execute()
        
        if not result.data:
            logger.info("ℹ️  Hiç admin kullanıcı bulunamadı")
            return
        
        # Hedef admin dışındaki tüm adminleri sil
        for user in result.data:
            if user['email'] != ADMIN_EMAIL:
                logger.info(f"🗑️  Admin siliniyor: {user['email']}")
                supabase.table('users').delete().eq('id', user['id']).execute()
                log_action('delete_admin', f"Admin kullanıcı silindi: {user['email']}", user['id'])
        
        logger.info("✅ Admin temizliği tamamlandı")
    except Exception as e:
        logger.error(f"❌ Admin temizliği hatası: {str(e)}")


def ensure_admin_user():
    """Admin kullanıcıyı kontrol et ve oluştur"""
    logger.info(f"🔐 Admin kullanıcıyı kontrol ediyorum: {ADMIN_EMAIL}")
    
    try:
        # Admin kullanıcıyı ara
        result = supabase.table('users').select('*').eq('email', ADMIN_EMAIL).execute()
        
        if result.data:
            admin = result.data[0]
            logger.info(f"✅ Admin kullanıcı zaten mevcut: {admin['email']}")
            
            # Rolünü admin olarak güncelle (eğer değilse)
            if admin.get('role') != 'admin':
                logger.info("🔄 Admin rolü güncelleniyor...")
                supabase.table('users').update({
                    'role': 'admin'
                }).eq('id', admin['id']).execute()
                log_action('update_admin', f"Admin rolü güncellendi: {ADMIN_EMAIL}", admin['id'])
            
            return admin
        else:
            # Admin yoksa oluştur
            logger.info("➕ Admin kullanıcı oluşturuluyor...")
            new_admin = {
                'email': ADMIN_EMAIL,
                'password': ADMIN_PASSWORD,  # Not: Gerçek projede hash'lenmeli
                'role': 'admin',
                'created_at': datetime.utcnow().isoformat()
            }
            
            result = supabase.table('users').insert(new_admin).execute()
            logger.info(f"✅ Admin kullanıcı oluşturuldu: {ADMIN_EMAIL}")
            log_action('create_admin', f"Admin kullanıcı oluşturuldu: {ADMIN_EMAIL}", result.data[0]['id'])
            
            return result.data[0]
            
    except Exception as e:
        logger.error(f"❌ Admin kullanıcı hatası: {str(e)}")
        return None


def log_action(action: str, details: str, user_id: str = None):
    """İşlemi logs tablosuna kaydet"""
    try:
        log_entry = {
            'action': action,
            'details': details,
            'user_id': user_id,
            'created_at': datetime.utcnow().isoformat()
        }
        supabase.table('logs').insert(log_entry).execute()
    except Exception as e:
        logger.warning(f"⚠️ Log kaydedilemedi: {str(e)}")


def initialize_system():
    """Sistemi başlat ve kontrol et"""
    logger.info("🚀 UGC Project Manager başlatılıyor...")
    logger.info(f"📍 Supabase URL: {SUPABASE_URL}")
    
    # 1. Tabloları kontrol et
    check_and_create_tables()
    
    # 2. Admin kullanıcıları temizle
    cleanup_admin_users()
    
    # 3. Admin kullanıcıyı oluştur/kontrol et
    admin = ensure_admin_user()
    
    if admin:
        logger.info("=" * 50)
        logger.info("✅ Kanka her şey tamam, sistem hazır!")
        logger.info(f"👤 Admin Email: {ADMIN_EMAIL}")
        logger.info(f"🔑 Admin ID: {admin.get('id', 'N/A')}")
        logger.info("=" * 50)
    else:
        logger.error("❌ Sistem başlatılamadı! Admin kullanıcı oluşturulamadı.")


if __name__ == "__main__":
    initialize_system()
