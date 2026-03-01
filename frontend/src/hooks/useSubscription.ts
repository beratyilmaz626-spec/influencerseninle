import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { getProductByPriceId } from '../stripe-config';

interface Subscription {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

// Global cache to prevent multiple fetches
let _subscriptionCache: { userId: string; data: Subscription | null } | null = null;

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const userId = user?.id;

  const fetchSubscription = async () => {
    if (!userId) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    // Return cached data if available for same user
    if (_subscriptionCache?.userId === userId) {
      setSubscription(_subscriptionCache.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      // Cache the result
      _subscriptionCache = { userId, data };
      setSubscription(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const getActiveProduct = () => {
    if (!subscription?.price_id) return null;
    return getProductByPriceId(subscription.price_id);
  };

  const isActive = () => subscription?.subscription_status === 'active';
  const isPastDue = () => subscription?.subscription_status === 'past_due';
  const isCanceled = () => subscription?.subscription_status === 'canceled';

  return {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
    getActiveProduct,
    isActive,
    isPastDue,
    isCanceled,
  };
}
