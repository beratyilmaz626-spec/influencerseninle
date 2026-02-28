import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

  // Refs for preventing infinite loops
  const hasFetchedRef = useRef(false);
  const userIdRef = useRef<string | null>(null);
  const subscriptionIdRef = useRef<string | null>(null);

  // Memoized user ID for stable reference
  const userId = user?.id ?? null;
  const subscriptionId = subscription?.subscription_id ?? null;
  const priceId = subscription?.price_id ?? null;
  const periodEnd = subscription?.current_period_end ?? null;
  const subscriptionStatus = subscription?.subscription_status ?? null;
  const userCredits = userProfile?.user_credits_points ?? 0;

  // Fetch gift credits
  useEffect(() => {
    if (!userId) {
      setGiftCredits(0);
      return;
    }

    const fetchGiftCredits = async () => {
      try {
        const { data, error: creditsError } = await supabase
          .from('users')
          .select('user_credits_points')
          .eq('id', userId)
          .single();

        if (creditsError) {
          console.error('Gift credits error:', creditsError);
          setGiftCredits(0);
          return;
        }
        
        if (data) {
          setGiftCredits(data.user_credits_points || 0);
        }
      } catch (err) {
        console.error('Gift credit fetch failed:', err);
        setGiftCredits(0);
      }
    };

    // Only fetch once per user
    if (userIdRef.current !== userId) {
      userIdRef.current = userId;
      fetchGiftCredits();
    }
  }, [userId]);

  // Fetch subscription
  useEffect(() => {
    if (!userId) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
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
        setError(err instanceof Error ? err.message : 'Subscription fetch failed');
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch once per user
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchSubscription();
    }
  }, [userId]);

  // Fetch monthly usage when subscription changes
  useEffect(() => {
    if (!userId || !subscriptionId) {
      setMonthlyUsage({ videosCreated: 0, periodStart: null, periodEnd: null });
      return;
    }

    // Skip if already fetched for this subscription
    if (subscriptionIdRef.current === subscriptionId) {
      return;
    }
    subscriptionIdRef.current = subscriptionId;

    const fetchMonthlyUsage = async () => {
      try {
        const periodStart = subscription?.current_period_start
          ? new Date(subscription.current_period_start * 1000)
          : new Date(new Date().setDate(1));
        
        const periodEndDate = subscription?.current_period_end
          ? new Date(subscription.current_period_end * 1000)
          : new Date(new Date().setMonth(new Date().getMonth() + 1, 0));

        const { count, error: countError } = await supabase
          .from('videos')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', periodStart.toISOString())
          .lte('created_at', periodEndDate.toISOString());

        if (countError) throw countError;

        setMonthlyUsage({
          videosCreated: count || 0,
          periodStart,
          periodEnd: periodEndDate,
        });
      } catch (err) {
        console.error('Monthly usage fetch failed:', err);
      }
    };

    fetchMonthlyUsage();
  }, [userId, subscriptionId, subscription?.current_period_start, subscription?.current_period_end]);

  // Memoized computed values - these don't cause re-renders
  const currentPlanId = useMemo((): PlanId | null => {
    if (!priceId) return null;
    const plan = getPlanByStripePriceId(priceId);
    return plan?.id ?? null;
  }, [priceId]);

  const isPeriodValid = useMemo((): boolean => {
    if (!periodEnd) return false;
    const end = new Date(periodEnd * 1000);
    return new Date() < end;
  }, [periodEnd]);

  const isSubscriptionActive = useMemo((): boolean => {
    if (!subscription) return false;
    const statusActive = subscriptionStatus === 'active' || subscriptionStatus === 'trialing';
    return statusActive && isPeriodValid;
  }, [subscription, subscriptionStatus, isPeriodValid]);

  const videoLimit = useMemo((): number => {
    if (isAdmin) return 999;
    if (!currentPlanId) return 0;
    return getMonthlyVideoLimit(currentPlanId);
  }, [isAdmin, currentPlanId]);

  const currentPlan = useMemo(() => {
    if (!currentPlanId) return null;
    return SUBSCRIPTION_PLANS[currentPlanId];
  }, [currentPlanId]);

  const effectiveCredits = useMemo(() => {
    return giftCredits > 0 ? giftCredits : userCredits;
  }, [giftCredits, userCredits]);

  const remainingVideos = useMemo((): number => {
    if (isAdmin) return 999;
    const subscriptionRemaining = Math.max(0, videoLimit - monthlyUsage.videosCreated);
    return subscriptionRemaining + effectiveCredits;
  }, [isAdmin, videoLimit, monthlyUsage.videosCreated, effectiveCredits]);

  const isFullyLoaded = !profileLoading && !loading;

  // Feature check function
  const hasFeature = useCallback((featureId: FeatureId): boolean => {
    if (!isSubscriptionActive) return false;
    if (!currentPlanId) return false;
    return checkFeature(currentPlanId, featureId);
  }, [isSubscriptionActive, currentPlanId]);

  // Has gift credits check
  const hasGiftCredits = useCallback((): boolean => {
    return effectiveCredits > 0;
  }, [effectiveCredits]);

  // Video cost constant
  const VIDEO_COST = 200;

  // Can create video check - uses memoized values
  const canCreateVideo = useCallback((): { allowed: boolean; reason?: string; useGiftCredits?: boolean } => {
    // Admin check
    if (!profileLoading && isAdmin) {
      return { allowed: true, useGiftCredits: false };
    }
    
    // Loading state
    if (profileLoading || loading) {
      return { allowed: false, reason: 'Yükleniyor...' };
    }
    
    // Check gift credits
    if (effectiveCredits >= VIDEO_COST) {
      return { allowed: true, useGiftCredits: true };
    }
    
    // Insufficient credits
    if (effectiveCredits > 0 && effectiveCredits < VIDEO_COST) {
      return {
        allowed: false,
        reason: `Video oluşturmak için ${VIDEO_COST} jeton gerekli. Mevcut jetonun: ${effectiveCredits}. Lütfen bir plan seçin.`,
      };
    }
    
    // Check subscription
    if (!isSubscriptionActive) {
      return {
        allowed: false,
        reason: 'Aktif bir aboneliğiniz veya yeterli hediye jetonunuz bulunmuyor. Lütfen bir plan seçin.',
      };
    }

    // Check monthly limit
    const remaining = Math.max(0, videoLimit - monthlyUsage.videosCreated);
    if (remaining <= 0) {
      return {
        allowed: false,
        reason: `Aylık video limitiniz (${videoLimit} video) doldu. Yeni dönem başladığında tekrar video oluşturabilirsiniz veya planınızı yükseltin.`,
      };
    }

    return { allowed: true, useGiftCredits: false };
  }, [profileLoading, loading, isAdmin, effectiveCredits, isSubscriptionActive, videoLimit, monthlyUsage.videosCreated]);

  // Increment video usage
  const incrementVideoUsage = useCallback(async (useGiftCreditsParam: boolean = false): Promise<void> => {
    if (isAdmin) return;
    
    if (useGiftCreditsParam && giftCredits >= VIDEO_COST) {
      const newCredits = giftCredits - VIDEO_COST;
      setGiftCredits(newCredits);
      
      if (userId) {
        await supabase
          .from('users')
          .update({ user_credits_points: newCredits })
          .eq('id', userId);
      }
    } else {
      setMonthlyUsage(prev => ({
        ...prev,
        videosCreated: prev.videosCreated + 1,
      }));
    }
  }, [isAdmin, giftCredits, userId]);

  // Banner dismiss
  const dismissLimitBanner = useCallback(() => {
    limitBannerDismissed = true;
  }, []);

  const isLimitBannerDismissed = useCallback(() => {
    return limitBannerDismissed;
  }, []);

  // Get subscription status message
  const getSubscriptionStatusMessage = useCallback((): { type: 'error' | 'warning' | 'info' | 'success'; message: string } | null => {
    // Loading state - no banner
    if (profileLoading || loading) {
      return null;
    }
    
    // Admin - no banner
    if (isAdmin) {
      return null;
    }
    
    // Sufficient gift credits
    if (effectiveCredits >= VIDEO_COST) {
      const videosAvailable = Math.floor(effectiveCredits / VIDEO_COST);
      return {
        type: 'success',
        message: `🎁 ${effectiveCredits} jeton hediye hakkın var! (${videosAvailable} video oluşturabilirsin)`,
      };
    }
    
    // Insufficient gift credits
    if (effectiveCredits > 0 && effectiveCredits < VIDEO_COST) {
      return {
        type: 'warning',
        message: `⚠️ ${effectiveCredits} jetonun var ama 1 video için ${VIDEO_COST} jeton gerekli. Lütfen bir plan seç.`,
      };
    }
    
    // No active subscription
    if (!isSubscriptionActive) {
      return {
        type: 'error',
        message: 'Aktif bir aboneliğin veya yeterli hediye jetonun bulunmuyor. Video oluşturmak için bir plan seç.',
      };
    }
    
    const remaining = remainingVideos;
    
    if (remaining <= 0) {
      return {
        type: 'warning',
        message: `Bu dönemlik video hakkın bitti (${videoLimit} video). Dönem yenilenince devam edebilirsin.`,
      };
    }
    
    if (remaining <= 3) {
      return {
        type: 'info',
        message: `Dikkat: Bu dönem sadece ${remaining} video hakkın kaldı.`,
      };
    }
    
    return null;
  }, [profileLoading, loading, isAdmin, effectiveCredits, isSubscriptionActive, remainingVideos, videoLimit]);

  // Refetch functions
  const refetch = useCallback(async () => {
    hasFetchedRef.current = false;
    setLoading(true);
    try {
      const { data, error: subError } = await supabase
        .from('user_subscriptions')
        .select('*')
        .maybeSingle();

      if (subError) throw subError;
      setSubscription(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscription fetch failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchGiftCredits = useCallback(async () => {
    if (!userId) return;
    try {
      const { data, error: creditsError } = await supabase
        .from('users')
        .select('user_credits_points')
        .eq('id', userId)
        .single();

      if (!creditsError && data) {
        setGiftCredits(data.user_credits_points || 0);
      }
    } catch (err) {
      console.error('Gift credit refetch failed:', err);
    }
  }, [userId]);

  // Max video duration
  const maxVideoDuration = useMemo(() => {
    if (isAdmin) return 15;
    if (effectiveCredits > 0) return 15;
    if (currentPlanId) return getMaxVideoDuration(currentPlanId);
    return 15;
  }, [isAdmin, effectiveCredits, currentPlanId]);

  return {
    // State
    subscription,
    monthlyUsage,
    loading,
    profileLoading,
    isFullyLoaded,
    error,
    
    // Plan info
    currentPlan,
    currentPlanId,
    
    // Admin status
    isAdmin,
    
    // Access controls - return functions that return memoized values
    isSubscriptionActive: useCallback(() => isSubscriptionActive, [isSubscriptionActive]),
    isPeriodValid: useCallback(() => isPeriodValid, [isPeriodValid]),
    hasFeature,
    canCreateVideo,
    hasGiftCredits,
    
    // Limits
    videoLimit,
    remainingVideos,
    videosUsed: monthlyUsage.videosCreated,
    giftCredits: effectiveCredits,
    maxVideoDuration,
    
    // Actions
    incrementVideoUsage,
    refetch,
    refetchGiftCredits,
    
    // Banner
    dismissLimitBanner,
    isLimitBannerDismissed,
    getSubscriptionStatusMessage,
  };
}
