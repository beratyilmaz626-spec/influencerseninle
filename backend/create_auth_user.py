"""
Supabase Auth'da admin kullanıcı oluştur
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
ADMIN_EMAIL = "beratyilmaz626@gmail.com"
ADMIN_PASSWORD = "berat881612"

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def create_admin_auth_user():
    """Supabase Auth'da admin kullanıcıyı oluştur"""
    logger.info("🔐 Supabase Auth'da admin kullanıcı oluşturuluyor...")
    
    try:
        # Admin kullanıcıyı oluştur (service role ile)
        response = supabase.auth.admin.create_user({
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD,
            "email_confirm": True,  # Email onayı atlansın
            "user_metadata": {
                "role": "admin",
                "full_name": "Admin User"
            }
        })
        
        logger.info(f"✅ Auth kullanıcı oluşturuldu!")
        logger.info(f"   User ID: {response.user.id}")
        logger.info(f"   Email: {response.user.email}")
        
        # users tablosunu güncelle (auth user id ile)
        user_data = {
            "id": response.user.id,
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD,  # Hashlenmeli ama basitlik için düz
            "role": "admin"
        }
        
        supabase.table('users').upsert(user_data, on_conflict='id').execute()
        logger.info("✅ users tablosu senkronize edildi")
        
        return response.user
        
    except Exception as e:
        error_msg = str(e)
        
        if "User already registered" in error_msg:
            logger.info("ℹ️  Kullanıcı zaten mevcut, giriş yapılabilir")
            
            # Mevcut auth user'ı bul
            users = supabase.auth.admin.list_users()
            for user in users:
                if user.email == ADMIN_EMAIL:
                    logger.info(f"✅ Mevcut kullanıcı bulundu: {user.id}")
                    return user
        else:
            logger.error(f"❌ Hata: {error_msg}")
        
        return None


def test_login():
    """Admin ile giriş testi"""
    logger.info("\n🧪 Giriş testi yapılıyor...")
    
    try:
        response = supabase.auth.sign_in_with_password({
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        
        logger.info("✅ GİRİŞ BAŞARILI!")
        logger.info(f"   Access Token: {response.session.access_token[:50]}...")
        logger.info(f"   User ID: {response.user.id}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Giriş hatası: {str(e)}")
        return False


def main():
    logger.info("=" * 60)
    logger.info("🚀 Supabase Auth Admin Kurulumu")
    logger.info("=" * 60)
    
    # 1. Auth kullanıcıyı oluştur
    user = create_admin_auth_user()
    
    if not user:
        logger.error("❌ Auth kullanıcı oluşturulamadı!")
        return
    
    # 2. Giriş testi
    login_success = test_login()
    
    if login_success:
        logger.info("\n" + "=" * 60)
        logger.info("✅ KANKA HER ŞEY TAMAM!")
        logger.info("\n📝 Giriş Bilgileri:")
        logger.info(f"   Email: {ADMIN_EMAIL}")
        logger.info(f"   Şifre: {ADMIN_PASSWORD}")
        logger.info("\n🌐 Giriş URL:")
        logger.info("   Frontend'e git ve giriş yap!")
        logger.info("=" * 60)
    else:
        logger.error("\n❌ Giriş testi başarısız!")


if __name__ == "__main__":
    main()
