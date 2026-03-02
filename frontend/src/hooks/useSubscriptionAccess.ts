import { useState, useEffect, useCallback, useMemo } from 'react';
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

// Global caches
let _subCache: { id: string; data: SubscriptionData | null } | null = null;
let _creditsCache: { id: string; credits: number } | null = null;
let _usageCache: { id: string; usage: MonthlyUsage } | null = null;
let _bannerDismissed = false;

export function useSubscriptionAccess() {
  const { user, userProfile, isAdmin, profileLoading } = useAuth();
  const userId = user?.id ?? null;

  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [monthlyUsage, setMonthlyUsage] = useState<MonthlyUsage>({ videosCreated: 0, periodStart: null, periodEnd: null });
  const [loading, setLoading] = useState(true);
  const [giftCredits, setGiftCredits] = useState<number>(0);

  // Fetch subscription once per user
  useEffect(() => {
    if (!userId) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    // Use cache if available
    if (_subCache?.id === userId) {
      setSubscription(_subCache.data);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      try {
        const { data } = await supabase.from('user_subscriptions').select('*').maybeSingle();
        _subCache = { id: userId, data };
        setSubscription(data);
      } catch (e) {
        console.error('Sub fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [userId]);

  // Fetch credits once per user
  useEffect(() => {
    if (!userId) {
      setGiftCredits(0);
      return;
    }

    if (_creditsCache?.id === userId) {
      setGiftCredits(_creditsCache.credits);
      return;
    }

    const fetch = async () => {
      try {
        const { data } = await supabase.from('users').select('user_credits_points').eq('id', userId).single();
        const credits = data?.user_credits_points || 0;
        _creditsCache = { id: userId, credits };
        setGiftCredits(credits);
      } catch (e) {
        console.error('Credits fetch error:', e);
      }
    };
    fetch();
  }, [userId]);

  // Fetch usage once per user
  useEffect(() => {
    if (!userId || !subscription?.subscription_id) {
      setMonthlyUsage({ videosCreated: 0, periodStart: null, periodEnd: null });
      return;
    }

    if (_usageCache?.id === userId) {
      setMonthlyUsage(_usageCache.usage);
      return;
    }

    const fetch = async () => {
      try {
        const periodStart = subscription.current_period_start
          ? new Date(subscription.current_period_start * 1000)
          : new Date(new Date().setDate(1));
        const periodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : new Date(new Date().setMonth(new Date().getMonth() + 1, 0));

        const { count } = await supabase
          .from('videos')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', periodStart.toISOString())
          .lte('created_at', periodEnd.toISOString());

        const usage = { videosCreated: count || 0, periodStart, periodEnd };
        _usageCache = { id: userId, usage };
        setMonthlyUsage(usage);
      } catch (e) {
        console.error('Usage fetch error:', e);
      }
    };
    fetch();
  }, [userId, subscription?.subscription_id, subscription?.current_period_start, subscription?.current_period_end]);

  // Computed values
  const currentPlanId = useMemo((): PlanId | null => {
    if (!subscription?.price_id) return null;
    return getPlanByStripePriceId(subscription.price_id)?.id ?? null;
  }, [subscription?.price_id]);

  const isSubscriptionActive = useMemo((): boolean => {
    if (!subscription) return false;
    const statusOk = subscription.subscription_status === 'active' || subscription.subscription_status === 'trialing';
    const periodOk = subscription.current_period_end ? new Date() < new Date(subscription.current_period_end * 1000) : false;
    return statusOk && periodOk;
  }, [subscription]);

  const videoLimit = useMemo(() => {
    if (isAdmin) return 999;
    if (!currentPlanId) return 0;
    return getMonthlyVideoLimit(currentPlanId);
  }, [isAdmin, currentPlanId]);

  const userCredits = userProfile?.user_credits_points ?? 0;
  const effectiveCredits = giftCredits > 0 ? giftCredits : userCredits;

  const remainingVideos = useMemo(() => {
    if (isAdmin) return 999;
    return Math.max(0, videoLimit - monthlyUsage.videosCreated) + effectiveCredits;
  }, [isAdmin, videoLimit, monthlyUsage.videosCreated, effectiveCredits]);

  const VIDEO_COST = 100; // Her video 100 kredi

  const canCreateVideo = useCallback((): { allowed: boolean; reason?: string; useGiftCredits?: boolean } => {
    if (isAdmin) return { allowed: true, useGiftCredits: false };
    if (profileLoading || loading) return { allowed: false, reason: 'Yükleniyor...' };
    if (effectiveCredits >= VIDEO_COST) return { allowed: true, useGiftCredits: true };
    if (effectiveCredits > 0 && effectiveCredits < VIDEO_COST) {
      return { allowed: false, reason: `Video için ${VIDEO_COST} jeton gerekli. Mevcut: ${effectiveCredits}` };
    }
    if (!isSubscriptionActive) {
      return { allowed: false, reason: 'Aktif abonelik veya yeterli jeton bulunmuyor.' };
    }
    const remaining = Math.max(0, videoLimit - monthlyUsage.videosCreated);
    if (remaining <= 0) {
      return { allowed: false, reason: `Aylık limit (${videoLimit}) doldu.` };
    }
    return { allowed: true, useGiftCredits: false };
  }, [isAdmin, profileLoading, loading, effectiveCredits, isSubscriptionActive, videoLimit, monthlyUsage.videosCreated]);

  const incrementVideoUsage = useCallback(async (useGift: boolean = false) => {
    if (isAdmin) return;
    if (useGift && giftCredits >= VIDEO_COST) {
      const newCredits = giftCredits - VIDEO_COST;
      setGiftCredits(newCredits);
      _creditsCache = userId ? { id: userId, credits: newCredits } : null;
      if (userId) {
        await supabase.from('users').update({ user_credits_points: newCredits }).eq('id', userId);
      }
    } else {
      setMonthlyUsage(prev => ({ ...prev, videosCreated: prev.videosCreated + 1 }));
    }
  }, [isAdmin, giftCredits, userId]);

  const hasFeature = useCallback((f: FeatureId) => {
    if (!isSubscriptionActive || !currentPlanId) return false;
    return checkFeature(currentPlanId, f);
  }, [isSubscriptionActive, currentPlanId]);

  const hasGiftCredits = useCallback(() => effectiveCredits > 0, [effectiveCredits]);

  const dismissLimitBanner = useCallback(() => { _bannerDismissed = true; }, []);
  const isLimitBannerDismissed = useCallback(() => _bannerDismissed, []);

  const getSubscriptionStatusMessage = useCallback(() => {
    if (profileLoading || loading) return null;
    if (isAdmin) return null;
    if (effectiveCredits >= VIDEO_COST) {
      return { type: 'success' as const, message: `🎁 ${effectiveCredits} jeton hediye hakkın var!` };
    }
    if (effectiveCredits > 0 && effectiveCredits < VIDEO_COST) {
      return { type: 'warning' as const, message: `⚠️ ${effectiveCredits} jetonun var ama ${VIDEO_COST} gerekli.` };
    }
    if (!isSubscriptionActive) {
      return { type: 'error' as const, message: 'Aktif abonelik veya yeterli jeton bulunmuyor.' };
    }
    if (remainingVideos <= 0) {
      return { type: 'warning' as const, message: `Bu dönemlik video hakkın bitti.` };
    }
    if (remainingVideos <= 3) {
      return { type: 'info' as const, message: `Sadece ${remainingVideos} video hakkın kaldı.` };
    }
    return null;
  }, [profileLoading, loading, isAdmin, effectiveCredits, isSubscriptionActive, remainingVideos]);

  const refetch = useCallback(async () => {
    _subCache = null;
    _creditsCache = null;
    _usageCache = null;
    setLoading(true);
    // Re-trigger effects by changing state
  }, []);

  return {
    subscription,
    monthlyUsage,
    loading,
    profileLoading,
    isFullyLoaded: !profileLoading && !loading,
    error: null,
    currentPlan: currentPlanId ? SUBSCRIPTION_PLANS[currentPlanId] : null,
    currentPlanId,
    isAdmin,
    isSubscriptionActive: useCallback(() => isSubscriptionActive, [isSubscriptionActive]),
    isPeriodValid: useCallback(() => {
      if (!subscription?.current_period_end) return false;
      return new Date() < new Date(subscription.current_period_end * 1000);
    }, [subscription?.current_period_end]),
    hasFeature,
    canCreateVideo,
    hasGiftCredits,
    videoLimit,
    remainingVideos,
    videosUsed: monthlyUsage.videosCreated,
    giftCredits: effectiveCredits,
    maxVideoDuration: 15, // Her zaman 15 saniye - tüm kullanıcılar için sabit
    incrementVideoUsage,
    refetch,
    refetchGiftCredits: refetch,
    dismissLimitBanner,
    isLimitBannerDismissed,
    getSubscriptionStatusMessage,
  };
}
