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
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [monthlyUsage, setMonthlyUsage] = useState<MonthlyUsage>({
    videosCreated: 0,
    periodStart: null,
    periodEnd: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        .from('stripe_user_subscriptions')
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
  }, [user]);

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

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  useEffect(() => {
    if (subscription) {
      fetchMonthlyUsage();
    }
  }, [subscription, fetchMonthlyUsage]);

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
    const planId = getCurrentPlanId();
    if (!planId) return 0;
    return getMonthlyVideoLimit(planId);
  }, [getCurrentPlanId]);

  // Kalan video hakkı
  const getRemainingVideos = useCallback((): number => {
    const limit = getVideoLimit();
    return Math.max(0, limit - monthlyUsage.videosCreated);
  }, [getVideoLimit, monthlyUsage.videosCreated]);

  // Video oluşturabilir mi kontrol et
  const canCreateVideo = useCallback((): { allowed: boolean; reason?: string } => {
    // Abonelik aktif mi?
    if (!isSubscriptionActive()) {
      return {
        allowed: false,
        reason: 'Aktif bir aboneliğiniz bulunmuyor. Lütfen bir plan seçin.',
      };
    }

    // Aylık limit aşıldı mı?
    const remaining = getRemainingVideos();
    if (remaining <= 0) {
      const planId = getCurrentPlanId();
      const limit = getVideoLimit();
      return {
        allowed: false,
        reason: `Aylık video limitiniz (${limit} video) doldu. Yeni dönem başladığında tekrar video oluşturabilirsiniz veya planınızı yükseltin.`,
      };
    }

    return { allowed: true };
  }, [isSubscriptionActive, getRemainingVideos, getCurrentPlanId, getVideoLimit]);

  // Video oluşturma sonrası kullanımı güncelle
  const incrementVideoUsage = useCallback(async (): Promise<void> => {
    setMonthlyUsage(prev => ({
      ...prev,
      videosCreated: prev.videosCreated + 1,
    }));
  }, []);

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
    if (loading) return null;
    
    if (!isSubscriptionActive()) {
      return {
        type: 'error',
        message: 'Aktif bir aboneliğin bulunmuyor. Video oluşturmak için bir plan seç.',
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
  }, [loading, isSubscriptionActive, getRemainingVideos, getVideoLimit]);

  return {
    // State
    subscription,
    monthlyUsage,
    loading,
    error,
    
    // Plan bilgileri
    currentPlan: getCurrentPlan(),
    currentPlanId: getCurrentPlanId(),
    
    // Erişim kontrolleri
    isSubscriptionActive,
    hasFeature,
    canCreateVideo,
    
    // Limitler
    videoLimit: getVideoLimit(),
    remainingVideos: getRemainingVideos(),
    videosUsed: monthlyUsage.videosCreated,
    
    // Aksiyonlar
    incrementVideoUsage,
    refetch: fetchSubscription,
    
    // Banner
    dismissLimitBanner,
    isLimitBannerDismissed,
    getSubscriptionStatusMessage,
  };
}
