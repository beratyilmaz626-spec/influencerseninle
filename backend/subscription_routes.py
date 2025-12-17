"""Subscription and Video Creation Authorization Routes

Bu modül aylık abonelik bazlı yetkilendirme ve video oluşturma
limit kontrollerini içerir.

ABONELİK KURALLARI:
- SADECE aylık abonelik modeli (30 gün erişim)
- Ödeme sağlayıcı: IYZICO (Stripe kullanılmıyor)
- Fiyatlar USD
- Başlangıç: 20 video/ay, $10
- Profesyonel: 45 video/ay, $20 (premium templates, api_access)
- Kurumsal: 100 video/ay, $40 (tüm özellikler)

PERIOD KURALLARI:
- Ödeme başarılı -> current_period_start = now, current_period_end = now + 30 gün
- Aktif erişim varken yenileme -> current_period_end += 30 gün
- current_period_end < now -> status='inactive', video oluşturma kapalı

VIDEO LIMIT KURALLARI:
- SADECE completed videolar sayılır
- processing ve failed sayılmaz
- Failed video = hak iadesi (hak düşmez)
"""

from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime, timezone
import os
import httpx

# Router setup
subscription_router = APIRouter(prefix="/api/subscription", tags=["subscription"])

# Database (will be set from main app)
db = None

def set_subscription_db(database):
    global db
    db = database

# Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://yxoynfnyrietkisnbqwf.supabase.co")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

# Plan configurations - MUST MATCH frontend/src/config/subscription-plans.ts
PLAN_CONFIGS = {
    "starter": {
        "id": "starter",
        "name": "Başlangıç",
        "monthly_video_limit": 20,
        "features": ["hd_video", "no_watermark", "basic_templates", "email_support"]
    },
    "professional": {
        "id": "professional",
        "name": "Profesyonel",
        "monthly_video_limit": 45,
        "features": ["hd_video", "no_watermark", "basic_templates", "premium_templates", "priority_support", "api_access"]
    },
    "enterprise": {
        "id": "enterprise",
        "name": "Kurumsal",
        "monthly_video_limit": 100,
        "features": ["hd_video", "no_watermark", "basic_templates", "premium_templates", "dedicated_support", "api_access", "advanced_api", "white_label"]
    }
}

# Stripe Price ID to Plan ID mapping
STRIPE_PRICE_TO_PLAN = {
    "price_1SI8r5IXoILZ7benDrZEtPLb": "starter",
    "price_starter_monthly": "starter",
    "price_1SI93eIXoILZ7benaTtahoH7": "professional",
    "price_professional_monthly": "professional",
    "price_1SI995IXoILZ7benbXtYoVJb": "enterprise",
    "price_enterprise_monthly": "enterprise"
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
    """Count videos created by user in the given period"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{SUPABASE_URL}/rest/v1/videos",
                params={
                    "user_id": f"eq.{user_id}",
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


def get_plan_from_price_id(price_id: str) -> Optional[dict]:
    """Get plan config from Stripe price ID"""
    plan_id = STRIPE_PRICE_TO_PLAN.get(price_id)
    if plan_id:
        return PLAN_CONFIGS.get(plan_id)
    return None


def is_subscription_active(status: str) -> bool:
    """Check if subscription status is active"""
    return status in ["active", "trialing"]


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
    
    Performs ALL required checks:
    1. User authentication
    2. Active subscription status
    3. Photo uploaded (ZORUNLU)
    4. Monthly video limit not exceeded
    
    Error codes:
    - UNAUTHORIZED: User not authenticated
    - NO_ACTIVE_SUBSCRIPTION: No active subscription
    - PHOTO_REQUIRED: Photo not uploaded
    - MONTHLY_LIMIT_REACHED: Video limit exceeded
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
    
    # 2. CHECK: Active subscription?
    subscription = await get_user_subscription(user_id)
    
    if not subscription:
        raise HTTPException(
            status_code=402,
            detail={
                "code": "NO_ACTIVE_SUBSCRIPTION",
                "message": "Aktif bir aboneliğiniz bulunmuyor. Lütfen bir plan seçin."
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
    
    # 3. CHECK: Photo uploaded? (ZORUNLU)
    if not request.has_photo:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "PHOTO_REQUIRED",
                "message": "Video oluşturmak için en az 1 fotoğraf yüklemelisiniz."
            }
        )
    
    # 4. CHECK: Monthly limit
    price_id = subscription.get("price_id")
    plan = get_plan_from_price_id(price_id)
    
    if not plan:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_PLAN",
                "message": "Geçersiz abonelik planı."
            }
        )
    
    # Calculate period
    period_start_ts = subscription.get("current_period_start")
    if period_start_ts:
        period_start = datetime.fromtimestamp(period_start_ts, tz=timezone.utc)
    else:
        now = datetime.now(timezone.utc)
        period_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    period_end = datetime.now(timezone.utc)
    
    # Get usage
    videos_used = await get_videos_count_in_period(user_id, period_start, period_end)
    monthly_limit = plan["monthly_video_limit"]
    remaining = max(0, monthly_limit - videos_used)
    
    # Check if limit exceeded
    if remaining < request.video_count:
        raise HTTPException(
            status_code=403,
            detail={
                "code": "MONTHLY_LIMIT_REACHED",
                "message": f"Aylık video limitiniz ({monthly_limit} video) doldu. Yeni dönem başladığında tekrar video oluşturabilirsiniz veya planınızı yükseltin.",
                "remaining_videos": remaining,
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
