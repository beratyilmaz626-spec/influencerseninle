import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import {
  PlanId,
  FeatureId,
  SUBSCRIPTION_PLANS,
  getPlanByStripePriceId,
  hasFeature as checkFeature,
  getMonthlyVideoLimit,
  getMaxVideoDuration,
} from '../config/subscription-plans';

interface SubscriptionData {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'inactive' | null;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
}

interface MonthlyUsage {
  videosCreated: number;
  periodStart: Date | null;
  periodEnd: Date | null;
}

// Banner dismiss state - persists until page refresh
let limitBannerDismissed = false;

export function useSubscriptionAccess() {
  const { user, userProfile, isAdmin, profileLoading } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [monthlyUsage, setMonthlyUsage] = useState<MonthlyUsage>({
    videosCreated: 0,
    periodStart: null,
    periodEnd: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [giftCredits, setGiftCredits] = useState<number>(0);

  // Hediye kredilerini getir
  const fetchGiftCredits = useCallback(async () => {
    if (!user) {
      console.log('🎁 fetchGiftCredits: Kullanıcı yok, 0 set ediliyor');
      setGiftCredits(0);
      return;
    }

    try {
      console.log('🎁 fetchGiftCredits: Kullanıcı ID:', user.id);
      
      const { data, error: creditsError } = await supabase
        .from('users')
        .select('user_credits_points')
        .eq('id', user.id)
        .single();

      console.log('🎁 fetchGiftCredits response:', { data, error: creditsError });

      if (creditsError) {
        console.error('🎁 fetchGiftCredits error:', creditsError);
        setGiftCredits(0);
        return;
      }
      
      if (data) {
        console.log('🎁 Hediye kredisi set ediliyor:', data.user_credits_points);
        setGiftCredits(data.user_credits_points || 0);
      }
    } catch (err) {
      console.error('🎁 Hediye kredi bilgisi alınamadı:', err);
      setGiftCredits(0);
    }
  }, [user?.id]); // Sadece user.id değiştiğinde yeniden oluştur

  // Abonelik bilgilerini getir
  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: subError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .maybeSingle();

      if (subError) throw subError;
      setSubscription(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Abonelik bilgisi alınamadı');
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, [user?.id]); // Sadece user.id değiştiğinde yeniden oluştur

  // Aylık kullanım bilgilerini getir
  const fetchMonthlyUsage = useCallback(async () => {
    if (!user || !subscription) {
      setMonthlyUsage({ videosCreated: 0, periodStart: null, periodEnd: null });
      return;
    }

    try {
      // Mevcut dönem başlangıç ve bitiş tarihleri
      const periodStart = subscription.current_period_start
        ? new Date(subscription.current_period_start * 1000)
        : new Date(new Date().setDate(1)); // Ayın başı
      
      const periodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : new Date(new Date().setMonth(new Date().getMonth() + 1, 0)); // Ayın sonu

      // Bu dönemde oluşturulan videoları say
      const { count, error: countError } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', periodStart.toISOString())
        .lte('created_at', periodEnd.toISOString());

      if (countError) throw countError;

      setMonthlyUsage({
        videosCreated: count || 0,
        periodStart,
        periodEnd,
      });
    } catch (err) {
      console.error('Aylık kullanım bilgisi alınamadı:', err);
    }
  }, [user, subscription]);

  // Ref to prevent multiple fetches
  const hasFetchedRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Only fetch if user changed or first mount
    if (user?.id && user.id !== userIdRef.current) {
      userIdRef.current = user.id;
      hasFetchedRef.current = false;
    }
    
    if (!hasFetchedRef.current && user) {
      hasFetchedRef.current = true;
      fetchSubscription();
      fetchGiftCredits();
    }
  }, [user?.id]); // Only depend on user.id, not the functions

  useEffect(() => {
    if (subscription) {
      fetchMonthlyUsage();
    }
  }, [subscription?.subscription_id]); // Only depend on subscription_id

  // Mevcut plan ID'sini al
  const getCurrentPlanId = useCallback((): PlanId | null => {
    if (!subscription?.price_id) return null;
    const plan = getPlanByStripePriceId(subscription.price_id);
    return plan?.id ?? null;
  }, [subscription]);

  // Period geçerli mi kontrol et (30 gün kuralı)
  const isPeriodValid = useCallback((): boolean => {
    if (!subscription?.current_period_end) return false;
    const periodEnd = new Date(subscription.current_period_end * 1000);
    const now = new Date();
    return now < periodEnd;
  }, [subscription]);

  // Abonelik aktif mi kontrol et (status + period)
  const isSubscriptionActive = useCallback((): boolean => {
    if (!subscription) return false;
    const statusActive = subscription.subscription_status === 'active' || 
                         subscription.subscription_status === 'trialing';
    // Status aktif VE period geçerli olmalı
    return statusActive && isPeriodValid();
  }, [subscription, isPeriodValid]);

  // Belirli bir özelliğe erişim var mı kontrol et
  const hasFeature = useCallback((featureId: FeatureId): boolean => {
    if (!isSubscriptionActive()) return false;
    const planId = getCurrentPlanId();
    if (!planId) return false;
    return checkFeature(planId, featureId);
  }, [isSubscriptionActive, getCurrentPlanId]);

  // Aylık video limiti
  const getVideoLimit = useCallback((): number => {
    // Admin için sınırsız (999 göster)
    if (isAdmin) return 999;
    
    const planId = getCurrentPlanId();
    if (!planId) return 0;
    return getMonthlyVideoLimit(planId);
  }, [isAdmin, getCurrentPlanId]);

  // Kalan video hakkı (abonelik + hediye kredisi)
  const getRemainingVideos = useCallback((): number => {
    // Admin için sınırsız
    if (isAdmin) return 999;
    
    // Önce abonelik limitini kontrol et
    const limit = getVideoLimit();
    const subscriptionRemaining = Math.max(0, limit - monthlyUsage.videosCreated);
    
    // Hediye kredisi varsa ekle
    return subscriptionRemaining + giftCredits;
  }, [isAdmin, getVideoLimit, monthlyUsage.videosCreated, giftCredits]);

  // Hediye kredisi var mı?
  const hasGiftCredits = useCallback((): boolean => {
    return giftCredits > 0;
  }, [giftCredits]);

  // Video oluşturabilir mi kontrol et
  // NOT: 1 video = 200 jeton gerektirir
  const VIDEO_COST_CHECK = 200;
  
  // Toplam loading durumu - hem profil hem abonelik yüklenene kadar bekle
  const isFullyLoaded = !profileLoading && !loading;
  
  // Efektif hediye kredisi - state veya userProfile'dan al
  const effectiveGiftCredits = giftCredits > 0 ? giftCredits : (userProfile?.user_credits_points || 0);
  
  const canCreateVideo = useCallback((): { allowed: boolean; reason?: string; useGiftCredits?: boolean } => {
    console.log('🔍 canCreateVideo çağrıldı:');
    console.log('  - profileLoading:', profileLoading);
    console.log('  - loading:', loading);
    console.log('  - isAdmin:', isAdmin);
    console.log('  - giftCredits (state):', giftCredits);
    console.log('  - userProfile?.user_credits_points:', userProfile?.user_credits_points);
    console.log('  - effectiveGiftCredits:', effectiveGiftCredits);
    
    // 0. Admin ise her zaman video oluşturabilir (jeton gerekmez) 
    // Admin kontrolü için profileLoading'in bitmesini bekle
    if (!profileLoading && isAdmin) {
      console.log('  → Admin, izin veriliyor');
      return { allowed: true, useGiftCredits: false };
    }
    
    // Loading durumunda bekle (profil veya abonelik yükleniyorsa)
    if (profileLoading || loading) {
      console.log('  → Loading, bekleniyor');
      return { allowed: false, reason: 'Yükleniyor...' };
    }
    
    // 1. Hediye kredisi varsa (en az 200 jeton), abonelik şart değil
    // Hem state'i hem userProfile'ı kontrol et
    const currentCredits = giftCredits > 0 ? giftCredits : (userProfile?.user_credits_points || 0);
    
    if (currentCredits >= VIDEO_COST_CHECK) {
      console.log('  → Hediye kredisi yeterli:', currentCredits);
      return { allowed: true, useGiftCredits: true };
    }
    
    // 1b. Hediye kredisi var ama yetersiz (200'den az)
    if (currentCredits > 0 && currentCredits < VIDEO_COST_CHECK) {
      console.log('  → Hediye kredisi yetersiz:', currentCredits);
      return {
        allowed: false,
        reason: `Video oluşturmak için ${VIDEO_COST_CHECK} jeton gerekli. Mevcut jetonun: ${currentCredits}. Lütfen bir plan seçin.`,
      };
    }
    
    // 2. Abonelik aktif mi?
    if (!isSubscriptionActive()) {
      console.log('  → Abonelik aktif değil ve hediye kredisi yok');
      return {
        allowed: false,
        reason: 'Aktif bir aboneliğiniz veya yeterli hediye jetonunuz bulunmuyor. Lütfen bir plan seçin.',
      };
    }

    // 3. Aylık limit aşıldı mı?
    const limit = getVideoLimit();
    const remaining = Math.max(0, limit - monthlyUsage.videosCreated);
    if (remaining <= 0) {
      console.log('  → Aylık limit aşıldı');
      return {
        allowed: false,
        reason: `Aylık video limitiniz (${limit} video) doldu. Yeni dönem başladığında tekrar video oluşturabilirsiniz veya planınızı yükseltin.`,
      };
    }

    console.log('  → İzin veriliyor (abonelik)');
    return { allowed: true, useGiftCredits: false };
  }, [profileLoading, loading, isAdmin, isSubscriptionActive, giftCredits, userProfile, getVideoLimit, monthlyUsage.videosCreated]);

  // Video oluşturma sonrası kullanımı güncelle
  // NOT: 1 video = 200 jeton tüketir
  const VIDEO_COST = 200; // Her video 200 jeton
  
  const incrementVideoUsage = useCallback(async (useGiftCredits: boolean = false): Promise<void> => {
    // Admin için kredi düşürme
    if (isAdmin) {
      return;
    }
    
    if (useGiftCredits && giftCredits >= VIDEO_COST) {
      // Hediye kredisini düş (200 jeton)
      const newCredits = giftCredits - VIDEO_COST;
      setGiftCredits(newCredits);
      
      // Veritabanını güncelle
      if (user) {
        await supabase
          .from('users')
          .update({ user_credits_points: newCredits })
          .eq('id', user.id);
      }
    } else {
      // Normal abonelik kullanımını artır
      setMonthlyUsage(prev => ({
        ...prev,
        videosCreated: prev.videosCreated + 1,
      }));
    }
  }, [isAdmin, giftCredits, user]);

  // Mevcut plan bilgilerini al
  const getCurrentPlan = useCallback(() => {
    const planId = getCurrentPlanId();
    if (!planId) return null;
    return SUBSCRIPTION_PLANS[planId];
  }, [getCurrentPlanId]);

  // Banner dismiss işlevi
  const dismissLimitBanner = useCallback(() => {
    limitBannerDismissed = true;
  }, []);

  const isLimitBannerDismissed = useCallback(() => {
    return limitBannerDismissed;
  }, []);

  // Abonelik durum kontrolü için helper
  const getSubscriptionStatusMessage = useCallback((): { type: 'error' | 'warning' | 'info' | 'success'; message: string } | null => {
    // DEBUG
    console.log('🔍 getSubscriptionStatusMessage çağrıldı:');
    console.log('  - profileLoading:', profileLoading);
    console.log('  - loading:', loading);
    console.log('  - isAdmin:', isAdmin);
    console.log('  - giftCredits (state):', giftCredits);
    console.log('  - userProfile?.user_credits_points:', userProfile?.user_credits_points);
    
    // Efektif kredi - hem state hem profile'dan kontrol
    const currentCredits = giftCredits > 0 ? giftCredits : (userProfile?.user_credits_points || 0);
    console.log('  - currentCredits:', currentCredits);
    
    // Profil veya abonelik yükleniyorsa banner gösterme
    if (profileLoading || loading) {
      console.log('  → loading, null döndürülüyor');
      return null;
    }
    
    // Admin için banner gösterme
    if (isAdmin) {
      console.log('  → isAdmin=true, null döndürülüyor (banner yok)');
      return null;
    }
    
    // Hediye kredisi varsa, pozitif mesaj göster
    // 200 jeton = 1 video, kaç video yapılabilir hesapla
    if (currentCredits >= 200) {
      const videosAvailable = Math.floor(currentCredits / 200);
      console.log('  → Yeterli hediye kredisi var:', currentCredits);
      return {
        type: 'success',
        message: `🎁 ${currentCredits} jeton hediye hakkın var! (${videosAvailable} video oluşturabilirsin)`,
      };
    }
    
    // Yetersiz hediye kredisi
    if (currentCredits > 0 && currentCredits < 200) {
      console.log('  → Yetersiz hediye kredisi:', currentCredits);
      return {
        type: 'warning',
        message: `⚠️ ${currentCredits} jetonun var ama 1 video için 200 jeton gerekli. Lütfen bir plan seç.`,
      };
    }
    
    if (!isSubscriptionActive()) {
      console.log('  → Abonelik aktif değil, hata mesajı gösteriliyor');
      return {
        type: 'error',
        message: 'Aktif bir aboneliğin veya yeterli hediye jetonun bulunmuyor. Video oluşturmak için bir plan seç.',
      };
    }
    
    const remaining = getRemainingVideos();
    const limit = getVideoLimit();
    
    if (remaining <= 0) {
      return {
        type: 'warning',
        message: `Bu dönemlik video hakkın bitti (${limit} video). Dönem yenilenince devam edebilirsin.`,
      };
    }
    
    if (remaining <= 3) {
      return {
        type: 'info',
        message: `Dikkat: Bu dönem sadece ${remaining} video hakkın kaldı.`,
      };
    }
    
    return null;
  }, [profileLoading, loading, isAdmin, isSubscriptionActive, getRemainingVideos, getVideoLimit, giftCredits, userProfile]);

  return {
    // State
    subscription,
    monthlyUsage,
    loading,
    profileLoading,
    isFullyLoaded,
    error,
    
    // Plan bilgileri
    currentPlan: getCurrentPlan(),
    currentPlanId: getCurrentPlanId(),
    
    // Admin durumu
    isAdmin,
    
    // Erişim kontrolleri
    isSubscriptionActive,
    isPeriodValid,
    hasFeature,
    canCreateVideo,
    hasGiftCredits,
    
    // Limitler
    videoLimit: getVideoLimit(),
    remainingVideos: getRemainingVideos(),
    videosUsed: monthlyUsage.videosCreated,
    giftCredits,
    // Video süresi (saniye) - Admin: 15sn, Hediye: 15sn, Starter: 10sn, Professional/Business: 15sn
    maxVideoDuration: isAdmin ? 15 : (giftCredits > 0 ? 15 : (getCurrentPlanId() ? getMaxVideoDuration(getCurrentPlanId()!) : 15)),
    
    // Aksiyonlar
    incrementVideoUsage,
    refetch: fetchSubscription,
    refetchGiftCredits: fetchGiftCredits,
    
    // Banner
    dismissLimitBanner,
    isLimitBannerDismissed,
    getSubscriptionStatusMessage,
  };
}
