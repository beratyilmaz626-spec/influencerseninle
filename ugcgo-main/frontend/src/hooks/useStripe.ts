import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface CheckoutSessionData {
  sessionId: string;
  url: string;
}

export function useStripe() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const createCheckoutSession = async (
    priceId: string,
    mode: 'payment' | 'subscription' = 'subscription'
  ): Promise<CheckoutSessionData | null> => {
    console.log('🔐 createCheckoutSession başladı', { priceId, mode, hasSession: !!session });
    
    if (!session?.access_token) {
      console.error('❌ User not authenticated - session yok!');
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📡 Supabase Edge Function çağrılıyor...');
      
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: priceId,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/pricing`,
          mode,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log('📬 Supabase response:', { data, error });

      if (error) {
        console.error('❌ Supabase error:', error);
        throw new Error(error.message);
      }

      console.log('✅ Checkout session oluşturuldu:', data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create checkout session';
      console.error('❌ Catch block:', errorMessage, err);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const redirectToCheckout = async (priceId: string, mode: 'payment' | 'subscription' = 'subscription') => {
    console.log('🚀 redirectToCheckout başladı', { priceId, mode, session });
    
    const sessionData = await createCheckoutSession(priceId, mode);
    
    console.log('📦 Supabase response:', sessionData);
    
    if (sessionData?.url) {
      console.log('✅ Stripe URL alındı, yönlendiriliyor:', sessionData.url);
      window.location.href = sessionData.url;
    } else {
      console.error('❌ Stripe URL alınamadı!', { sessionData, error });
    }
  };

  return {
    loading,
    error,
    createCheckoutSession,
    redirectToCheckout,
  };
}