"""Subscription and Video Creation Authorization Routes

Bu modül aylık abonelik bazlı yetkilendirme ve video oluşturma
limit kontrollerini içerir.

ABONELİK KURALLARI:
- SADECE aylık abonelik modeli (30 gün erişim)
- Ödeme sağlayıcı: IYZICO (Stripe kullanılmıyor)
- Fiyatlar TL (Türk Lirası)
- Starter: 20 video/ay, 10 saniye, ₺949
- Professional: 45 video/ay, 15 saniye, ₺3.799 (premium templates, api_access)
- Business: 100 video/ay, 15 saniye, ₺8.549 (tüm özellikler)

PERIOD KURALLARI:
- Ödeme başarılı -> current_period_start = now, current_period_end = now + 30 gün
- Aktif erişim varken yenileme -> current_period_end += 30 gün
- current_period_end < now -> status='inactive', video oluşturma kapalı

VIDEO LIMIT KURALLARI:
- SADECE completed videolar sayılır
- processing ve failed sayılmaz
- Failed video = hak iadesi (hak düşmez)

VIDEO SÜRESİ KURALLARI:
- Starter: Maksimum 10 saniye
- Professional & Business: Maksimum 15 saniye
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime, timezone
import os
import httpx

# Router setup
subscription_router = APIRouter(prefix="/api/subscription", tags=["subscription"])

# Admin email
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "beratyilmaz626@gmail.com")

# Database (will be set from main app)
db = None

def set_subscription_db(database):
    global db
    db = database

# Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://yxoynfnyrietkisnbqwf.supabase.co")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

# Plan configurations - MUST MATCH frontend/src/config/subscription-plans.ts
# Fiyatlar TL, video süreleri saniye cinsinden
PLAN_CONFIGS = {
    "starter": {
        "id": "starter",
        "name": "Starter",
        "monthly_video_limit": 20,
        "max_video_duration": 10,  # saniye
        "price_try": 949,
        "price_usd": 27,
        "features": ["hd_video", "no_watermark", "basic_templates", "email_support", "video_10sec"]
    },
    "professional": {
        "id": "professional",
        "name": "Professional",
        "monthly_video_limit": 45,
        "max_video_duration": 15,  # saniye
        "price_try": 3799,
        "price_usd": 108,
        "features": ["hd_video", "no_watermark", "basic_templates", "premium_templates", "priority_support", "api_access", "video_15sec"]
    },
    "enterprise": {
        "id": "enterprise",
        "name": "Business",
        "monthly_video_limit": 100,
        "max_video_duration": 15,  # saniye
        "price_try": 8549,
        "price_usd": 244,
        "features": ["hd_video", "no_watermark", "basic_templates", "premium_templates", "dedicated_support", "api_access", "advanced_api", "white_label", "video_15sec"]
    }
}

# Plan ID mapping - Iyzico entegrasyonu için
PLAN_ID_MAPPING = {
    "starter": "starter",
    "professional": "professional",
    "enterprise": "enterprise",
    # Iyzico product ID'leri (ödeme entegrasyonu için)
    "iyzico_starter_monthly": "starter",
    "iyzico_professional_monthly": "professional",
    "iyzico_enterprise_monthly": "enterprise",
    # Legacy mappings
    "iyzico_starter": "starter",
    "iyzico_professional": "professional",
    "iyzico_enterprise": "enterprise",
    # Legacy Stripe price IDs (geriye dönük uyumluluk)
    "price_1SI8r5IXoILZ7benDrZEtPLb": "starter",
    "price_starter_monthly": "starter",
    "price_1SI93eIXoILZ7benaTtahoH7": "professional",
    "price_professional_monthly": "professional",
    "price_1SI995IXoILZ7benbXtYoVJb": "enterprise",
    "price_enterprise_monthly": "enterprise",
    # Gift plans
    "gift_1_video": "starter"
}

# Models
class VideoCreationRequest(BaseModel):
    has_photo: bool = Field(..., description="Fotoğraf yüklenmiş mi?")
    video_count: int = Field(default=1, description="Oluşturulacak video sayısı")

class VideoCreationResponse(BaseModel):
    allowed: bool
    reason: Optional[str] = None
    remaining_videos: int = 0
    plan_limit: int = 0
    current_plan: Optional[str] = None

class SubscriptionStatusResponse(BaseModel):
    has_active_subscription: bool
    plan_id: Optional[str] = None
    plan_name: Optional[str] = None
    status: Optional[str] = None
    monthly_video_limit: int = 0
    videos_used_this_month: int = 0
    remaining_videos: int = 0
    period_start: Optional[str] = None
    period_end: Optional[str] = None
    features: List[str] = []

class FeatureAccessResponse(BaseModel):
    has_access: bool
    feature_id: str
    reason: Optional[str] = None


async def get_supabase_user_from_token(authorization: str = Header(None)) -> Optional[dict]:
    """Extract user from Supabase JWT token"""
    if not authorization:
        return None
    
    try:
        # Remove 'Bearer ' prefix if present
        token = authorization.replace("Bearer ", "")
        
        # Verify token with Supabase
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SUPABASE_URL}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": SUPABASE_SERVICE_KEY or os.environ.get("VITE_SUPABASE_ANON_KEY", "")
                }
            )
            
            if response.status_code == 200:
                return response.json()
            return None
    except Exception as e:
        print(f"Token verification error: {e}")
        return None


async def get_user_subscription(user_id: str) -> Optional[dict]:
    """Get user's subscription from Supabase"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SUPABASE_URL}/rest/v1/stripe_user_subscriptions",
                params={"user_id": f"eq.{user_id}", "select": "*"},
                headers={
                    "apikey": SUPABASE_SERVICE_KEY or os.environ.get("VITE_SUPABASE_ANON_KEY", ""),
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY or os.environ.get('VITE_SUPABASE_ANON_KEY', '')}"
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                return data[0] if data else None
            return None
    except Exception as e:
        print(f"Subscription fetch error: {e}")
        return None


async def get_videos_count_in_period(user_id: str, period_start: datetime, period_end: datetime) -> int:
    """
    Count COMPLETED videos created by user in the given period.
    
    ÖNEMLI: SADECE status='completed' olan videolar sayılır!
    - processing videolar sayılmaz (henüz tamamlanmadı)
    - failed videolar sayılmaz (hak iadesi - kullanıcı hakkı yanmaz)
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SUPABASE_URL}/rest/v1/videos",
                params={
                    "user_id": f"eq.{user_id}",
                    "status": "eq.completed",  # SADECE completed videolar!
                    "created_at": f"gte.{period_start.isoformat()}",
                    "select": "count"
                },
                headers={
                    "apikey": SUPABASE_SERVICE_KEY or os.environ.get("VITE_SUPABASE_ANON_KEY", ""),
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY or os.environ.get('VITE_SUPABASE_ANON_KEY', '')}",
                    "Prefer": "count=exact"
                }
            )
            
            if response.status_code == 200:
                # Extract count from Content-Range header
                content_range = response.headers.get("content-range", "")
                if "/" in content_range:
                    return int(content_range.split("/")[1])
                return len(response.json())
            return 0
    except Exception as e:
        print(f"Video count error: {e}")
        return 0


async def get_user_gift_credits(user_id: str) -> int:
    """
    Get user's gift credits from users table.
    
    Hediye kredisi kontrolü - users tablosundaki user_credits_points
    """
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SUPABASE_URL}/rest/v1/users",
                params={
                    "id": f"eq.{user_id}",
                    "select": "user_credits_points"
                },
                headers={
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                if data:
                    return data[0].get("user_credits_points", 0) or 0
            return 0
    except Exception as e:
        print(f"Gift credits fetch error: {e}")
        return 0


def get_plan_from_price_id(price_id: str) -> Optional[dict]:
    """Get plan config from price/plan ID (Iyzico veya legacy Stripe)"""
    if not price_id:
        return None
    plan_id = PLAN_ID_MAPPING.get(price_id, price_id)
    return PLAN_CONFIGS.get(plan_id)


def is_subscription_active(status: str) -> bool:
    """Check if subscription status is active"""
    return status in ["active", "trialing"]


def is_period_valid(period_end_ts: Optional[int]) -> bool:
    """
    Check if the subscription period is still valid (30 gün kuralı).
    
    current_period_end < now -> erişim kapalı
    """
    if not period_end_ts:
        return False
    
    period_end = datetime.fromtimestamp(period_end_ts, tz=timezone.utc)
    now = datetime.now(timezone.utc)
    
    return now < period_end


async def check_race_condition(user_id: str, period_start: datetime, monthly_limit: int) -> bool:
    """
    Race condition kontrolü - paralel isteklerde sadece 1'i başarılı olmalı.
    
    Bu fonksiyon video sayısını atomik olarak kontrol eder.
    Eğer limit dolmuşsa False döner.
    """
    current_count = await get_videos_count_in_period(
        user_id, 
        period_start, 
        datetime.now(timezone.utc)
    )
    
    # Atomik kontrol - bir kez daha sayıyı kontrol et
    return current_count < monthly_limit


@subscription_router.get("/status", response_model=SubscriptionStatusResponse)
async def get_subscription_status(authorization: str = Header(None)):
    """
    Get user's subscription status and usage information.
    
    Returns:
    - Current plan information
    - Monthly video limit and usage
    - Remaining videos
    - Available features
    """
    # 1. Authenticate user
    user = await get_supabase_user_from_token(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="UNAUTHORIZED")
    
    user_id = user.get("id")
    
    # 2. Get subscription
    subscription = await get_user_subscription(user_id)
    
    if not subscription:
        return SubscriptionStatusResponse(
            has_active_subscription=False,
            monthly_video_limit=0,
            videos_used_this_month=0,
            remaining_videos=0,
            features=[]
        )
    
    # 3. Check if active
    status = subscription.get("subscription_status", "")
    if not is_subscription_active(status):
        return SubscriptionStatusResponse(
            has_active_subscription=False,
            status=status,
            monthly_video_limit=0,
            videos_used_this_month=0,
            remaining_videos=0,
            features=[]
        )
    
    # 4. Get plan info
    price_id = subscription.get("price_id")
    plan = get_plan_from_price_id(price_id)
    
    if not plan:
        return SubscriptionStatusResponse(
            has_active_subscription=False,
            status=status,
            monthly_video_limit=0,
            videos_used_this_month=0,
            remaining_videos=0,
            features=[]
        )
    
    # 5. Calculate period
    period_start_ts = subscription.get("current_period_start")
    period_end_ts = subscription.get("current_period_end")
    
    if period_start_ts:
        period_start = datetime.fromtimestamp(period_start_ts, tz=timezone.utc)
    else:
        # Fallback: beginning of current month
        now = datetime.now(timezone.utc)
        period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    if period_end_ts:
        period_end = datetime.fromtimestamp(period_end_ts, tz=timezone.utc)
    else:
        # Fallback: end of current month
        now = datetime.now(timezone.utc)
        if now.month == 12:
            period_end = now.replace(year=now.year + 1, month=1, day=1) 
        else:
            period_end = now.replace(month=now.month + 1, day=1)
    
    # 6. Get usage
    videos_used = await get_videos_count_in_period(user_id, period_start, period_end)
    monthly_limit = plan["monthly_video_limit"]
    remaining = max(0, monthly_limit - videos_used)
    
    return SubscriptionStatusResponse(
        has_active_subscription=True,
        plan_id=plan["id"],
        plan_name=plan["name"],
        status=status,
        monthly_video_limit=monthly_limit,
        videos_used_this_month=videos_used,
        remaining_videos=remaining,
        period_start=period_start.isoformat(),
        period_end=period_end.isoformat(),
        features=plan["features"]
    )


@subscription_router.post("/can-create-video", response_model=VideoCreationResponse)
async def can_create_video(
    request: VideoCreationRequest,
    authorization: str = Header(None)
):
    """
    Check if user can create a video.
    
    Performs ALL required checks IN ORDER:
    1. User authentication
    2. Gift credits OR Active subscription status + Period validity (30 gün)
    3. Photo uploaded (ZORUNLU)
    4. Monthly video limit not exceeded (SADECE completed videolar)
    5. Race condition protection
    
    Error codes:
    - UNAUTHORIZED: User not authenticated
    - NO_ACTIVE_SUBSCRIPTION: No active subscription or gift credits
    - SUBSCRIPTION_EXPIRED: Period ended (30 gün doldu)
    - PHOTO_REQUIRED: Photo not uploaded
    - MONTHLY_LIMIT_REACHED: Video limit exceeded
    
    NOT: Failed videolar hak düşürmez, sadece completed videolar sayılır.
    NOT: Hediye kredisi olan kullanıcılar abonelik olmadan da video oluşturabilir.
    """
    
    # 1. CHECK: User authenticated?
    user = await get_supabase_user_from_token(authorization)
    if not user:
        raise HTTPException(
            status_code=401,
            detail={
                "code": "UNAUTHORIZED",
                "message": "Oturum açmanız gerekiyor."
            }
        )
    
    user_id = user.get("id")
    
    # 2. CHECK: Gift credits first (öncelik hediye kredisinde)
    gift_credits = await get_user_gift_credits(user_id)
    use_gift_credits = gift_credits > 0
    
    if use_gift_credits:
        # Hediye kredisi var - abonelik kontrolü ATLA
        # 3. CHECK: Photo uploaded? (ZORUNLU - kesinlikle)
        if not request.has_photo:
            raise HTTPException(
                status_code=400,
                detail={
                    "code": "PHOTO_REQUIRED",
                    "message": "Video oluşturmak için en az 1 fotoğraf yüklemelisiniz."
                }
            )
        
        # Hediye kredisi ile video oluşturabilir!
        return VideoCreationResponse(
            allowed=True,
            remaining_videos=gift_credits - request.video_count,
            plan_limit=gift_credits,
            current_plan="Hediye Kredisi"
        )
    
    # Hediye kredisi yok - Abonelik kontrolü yap
    # 2b. CHECK: Active subscription?
    subscription = await get_user_subscription(user_id)
    
    if not subscription:
        raise HTTPException(
            status_code=402,
            detail={
                "code": "NO_ACTIVE_SUBSCRIPTION",
                "message": "Aktif bir aboneliğiniz veya hediye krediniz bulunmuyor. Lütfen bir plan seçin."
            }
        )
    
    status = subscription.get("subscription_status", "")
    if not is_subscription_active(status):
        raise HTTPException(
            status_code=402,
            detail={
                "code": "NO_ACTIVE_SUBSCRIPTION",
                "message": f"Aboneliğiniz aktif değil (durum: {status}). Lütfen aboneliğinizi yenileyin."
            }
        )
    
    # 2c. CHECK: Period validity (30 gün kuralı)
    period_end_ts = subscription.get("current_period_end")
    if not is_period_valid(period_end_ts):
        raise HTTPException(
            status_code=402,
            detail={
                "code": "SUBSCRIPTION_EXPIRED",
                "message": "Abonelik süreniz dolmuş. Devam etmek için aboneliğinizi yenileyin."
            }
        )
    
    # 3. CHECK: Photo uploaded? (ZORUNLU - kesinlikle)
    if not request.has_photo:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "PHOTO_REQUIRED",
                "message": "Video oluşturmak için en az 1 fotoğraf yüklemelisiniz."
            }
        )
    
    # 4. CHECK: Monthly limit (SADECE completed videolar sayılır)
    price_id = subscription.get("price_id") or subscription.get("plan_id")
    plan = get_plan_from_price_id(price_id)
    
    if not plan:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_PLAN",
                "message": "Geçersiz abonelik planı."
            }
        )
    
    # Calculate period (30 gün)
    period_start_ts = subscription.get("current_period_start")
    if period_start_ts:
        period_start = datetime.fromtimestamp(period_start_ts, tz=timezone.utc)
    else:
        now = datetime.now(timezone.utc)
        period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    period_end = datetime.now(timezone.utc)
    
    # Get usage - SADECE completed videolar sayılır!
    videos_used = await get_videos_count_in_period(user_id, period_start, period_end)
    monthly_limit = plan["monthly_video_limit"]
    remaining = max(0, monthly_limit - videos_used)
    
    # Check if limit exceeded
    if remaining < request.video_count:
        raise HTTPException(
            status_code=403,
            detail={
                "code": "MONTHLY_LIMIT_REACHED",
                "message": f"Bu dönemlik video hakkın bitti ({monthly_limit} video). Dönem yenilenince devam edebilirsin veya planını yükseltebilirsin.",
                "remaining_videos": remaining,
                "plan_limit": monthly_limit
            }
        )
    
    # 5. RACE CONDITION CHECK - Paralel isteklerde sadece 1'i başarılı olmalı
    if not await check_race_condition(user_id, period_start, monthly_limit):
        raise HTTPException(
            status_code=403,
            detail={
                "code": "MONTHLY_LIMIT_REACHED",
                "message": "Bu dönemlik video hakkın bitti. Dönem yenilenince devam edebilirsin.",
                "remaining_videos": 0,
                "plan_limit": monthly_limit
            }
        )
    
    # All checks passed!
    return VideoCreationResponse(
        allowed=True,
        remaining_videos=remaining - request.video_count,
        plan_limit=monthly_limit,
        current_plan=plan["name"]
    )


@subscription_router.get("/check-feature/{feature_id}", response_model=FeatureAccessResponse)
async def check_feature_access(
    feature_id: str,
    authorization: str = Header(None)
):
    """
    Check if user has access to a specific feature.
    
    Feature IDs:
    - hd_video
    - no_watermark
    - basic_templates
    - premium_templates (Profesyonel ve üstü)
    - email_support
    - priority_support
    - dedicated_support
    - api_access (Profesyonel ve üstü)
    - advanced_api (Kurumsal)
    - white_label (Kurumsal)
    """
    
    # 1. Authenticate
    user = await get_supabase_user_from_token(authorization)
    if not user:
        raise HTTPException(status_code=401, detail="UNAUTHORIZED")
    
    user_id = user.get("id")
    
    # 2. Get subscription
    subscription = await get_user_subscription(user_id)
    
    if not subscription:
        return FeatureAccessResponse(
            has_access=False,
            feature_id=feature_id,
            reason="Aktif abonelik bulunamadı."
        )
    
    # 3. Check status
    status = subscription.get("subscription_status", "")
    if not is_subscription_active(status):
        return FeatureAccessResponse(
            has_access=False,
            feature_id=feature_id,
            reason="Abonelik aktif değil."
        )
    
    # 4. Get plan and check feature
    price_id = subscription.get("price_id")
    plan = get_plan_from_price_id(price_id)
    
    if not plan:
        return FeatureAccessResponse(
            has_access=False,
            feature_id=feature_id,
            reason="Geçersiz plan."
        )
    
    has_feature = feature_id in plan["features"]
    
    if not has_feature:
        return FeatureAccessResponse(
            has_access=False,
            feature_id=feature_id,
            reason=f"Bu özellik {plan['name']} paketinde bulunmuyor. Lütfen planınızı yükseltin."
        )
    
    return FeatureAccessResponse(
        has_access=True,
        feature_id=feature_id
    )


@subscription_router.get("/plans")
async def get_all_plans():
    """Get all available subscription plans"""
    return {
        "plans": list(PLAN_CONFIGS.values())
    }


# ============================================
# ADMIN ENDPOINTS - Hediye Token Sistemi
# ============================================

class GiftTokenRequest(BaseModel):
    user_email: str = Field(..., description="Kullanıcı email adresi")
    video_count: int = Field(default=1, description="Hediye edilecek video sayısı")

class GiftTokenResponse(BaseModel):
    success: bool
    message: str
    user_email: Optional[str] = None
    gift_videos: int = 0
    total_videos: int = 0

class UserListItem(BaseModel):
    id: str
    email: str
    credits: int = 0


@subscription_router.post("/admin/gift-token", response_model=GiftTokenResponse)
async def gift_token_to_user(request: GiftTokenRequest, authorization: str = Header(None)):
    """
    Admin endpoint: Kullanıcıya hediye video hakkı ver.
    
    Bu endpoint:
    1. Admin yetkisini kontrol eder
    2. Kullanıcıyı email ile bulur
    3. users tablosundaki user_credits_points'i artırır
    """
    # 1. Admin yetkisi kontrolü
    admin_user = await get_supabase_user_from_token(authorization)
    if not admin_user:
        raise HTTPException(status_code=401, detail="Oturum açmanız gerekiyor.")
    
    admin_email = admin_user.get("email", "")
    ADMIN_EMAILS = ["beratyilmaz626@gmail.com"]
    
    if admin_email not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Bu işlem için admin yetkisi gerekiyor.")
    
    try:
        async with httpx.AsyncClient() as client:
            # 2. Kullanıcıyı users tablosunda bul
            user_response = await client.get(
                f"{SUPABASE_URL}/rest/v1/users",
                params={
                    "email": f"eq.{request.user_email}",
                    "select": "id,email,user_credits_points"
                },
                headers={
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
                }
            )
            
            users_data = user_response.json() if user_response.status_code == 200 else []
            
            # Eğer users tablosunda bulunamazsa, auth.users'dan ara ve oluştur
            if not users_data:
                auth_response = await client.get(
                    f"{SUPABASE_URL}/auth/v1/admin/users",
                    headers={
                        "apikey": SUPABASE_SERVICE_KEY,
                        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
                    }
                )
                
                auth_user = None
                if auth_response.status_code == 200:
                    all_users = auth_response.json().get("users", [])
                    for u in all_users:
                        if u.get("email", "").lower() == request.user_email.lower():
                            auth_user = u
                            break
                
                if not auth_user:
                    raise HTTPException(
                        status_code=404,
                        detail=f"'{request.user_email}' email adresine sahip kullanıcı bulunamadı."
                    )
                
                # users tablosunda yeni kayıt oluştur
                now = datetime.now(timezone.utc).isoformat()
                insert_response = await client.post(
                    f"{SUPABASE_URL}/rest/v1/users",
                    json={
                        "id": auth_user["id"],
                        "email": auth_user["email"],
                        "password": "supabase_auth_managed",
                        "role": "user",
                        "is_admin": False,
                        "user_credits_points": request.video_count,
                        "created_at": now
                    },
                    headers={
                        "apikey": SUPABASE_SERVICE_KEY,
                        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                        "Content-Type": "application/json",
                        "Prefer": "return=representation"
                    }
                )
                
                if insert_response.status_code in [200, 201]:
                    return GiftTokenResponse(
                        success=True,
                        message=f"'{auth_user['email']}' kullanıcısına {request.video_count} video hakkı hediye edildi.",
                        user_email=auth_user["email"],
                        gift_videos=request.video_count,
                        total_videos=request.video_count
                    )
                else:
                    raise HTTPException(500, f"Kullanıcı oluşturma hatası: {insert_response.text}")
            
            # 3. Mevcut kredileri güncelle
            user = users_data[0]
            current_credits = user.get("user_credits_points", 0) or 0
            new_total = current_credits + request.video_count
            
            update_response = await client.patch(
                f"{SUPABASE_URL}/rest/v1/users",
                params={"email": f"eq.{request.user_email}"},
                json={"user_credits_points": new_total},
                headers={
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                }
            )
            
            if update_response.status_code not in [200, 204]:
                raise HTTPException(500, f"Kredi güncelleme hatası: {update_response.text}")
            
            return GiftTokenResponse(
                success=True,
                message=f"'{user['email']}' kullanıcısına {request.video_count} video hakkı eklendi.",
                user_email=user["email"],
                gift_videos=request.video_count,
                total_videos=new_total
            )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Gift token error: {e}")
        raise HTTPException(500, f"Hediye verme hatası: {str(e)}")


@subscription_router.get("/admin/users", response_model=List[UserListItem])
async def get_all_users_for_admin(authorization: str = Header(None)):
    """Admin için tüm kullanıcıları listele"""
    # Admin yetkisi kontrolü
    admin_user = await get_supabase_user_from_token(authorization)
    if not admin_user:
        raise HTTPException(status_code=401, detail="Oturum açmanız gerekiyor.")
    
    admin_email = admin_user.get("email", "")
    ADMIN_EMAILS = ["beratyilmaz626@gmail.com"]
    
    if admin_email not in ADMIN_EMAILS:
        raise HTTPException(status_code=403, detail="Bu işlem için admin yetkisi gerekiyor.")
    
    try:
        async with httpx.AsyncClient() as client:
            # Auth'dan tüm kullanıcıları getir
            auth_response = await client.get(
                f"{SUPABASE_URL}/auth/v1/admin/users",
                headers={
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
                }
            )
            
            if auth_response.status_code != 200:
                return []
            
            auth_users = auth_response.json().get("users", [])
            
            # users tablosundan kredileri getir
            users_response = await client.get(
                f"{SUPABASE_URL}/rest/v1/users",
                params={"select": "id,email,user_credits_points"},
                headers={
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}"
                }
            )
            
            users_credits = {}
            if users_response.status_code == 200:
                for u in users_response.json():
                    users_credits[u["id"]] = u.get("user_credits_points", 0) or 0
            
            # Kullanıcı listesi oluştur
            result = []
            for u in auth_users:
                result.append(UserListItem(
                    id=u["id"],
                    email=u.get("email", ""),
                    credits=users_credits.get(u["id"], 0)
                ))
            
            return result
    
    except Exception as e:
        print(f"Get users error: {e}")
        return []
