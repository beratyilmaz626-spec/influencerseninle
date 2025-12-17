import { useState, useEffect, useCallback } from 'react';
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

  // Abonelik aktif mi kontrol et
  const isSubscriptionActive = useCallback((): boolean => {
    if (!subscription) return false;
    return subscription.subscription_status === 'active' || 
           subscription.subscription_status === 'trialing';
  }, [subscription]);

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
  };
}
