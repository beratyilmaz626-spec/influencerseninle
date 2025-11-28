import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

interface UserCredits {
  id: string;
  user_id: string;
  credits: number;
  created_at: string;
  updated_at: string;
}

interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'purchase' | 'signup_bonus' | 'video_creation' | 'refund';
  description: string;
  stripe_order_id: string | null;
  created_at: string;
}

export function useCredits() {
  const [credits, setCredits] = useState<number>(0);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userProfile } = useAuth();

  const fetchCredits = async () => {
    if (!user) {
      setCredits(0);
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch fresh user data to get current credits
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_credits_points')
        .eq('id', user.id)
        .single();

      if (userError) {
        throw userError;
      }

      setCredits(userData?.user_credits_points || 0);

      // Fetch credit transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transactionsError) {
        throw transactionsError;
      }

      setTransactions(transactionsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch credits');
      console.error('Error fetching credits:', err);
    } finally {
      setLoading(false);
    }
  };

  const deductCredits = async (amount: number, description: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      // Check current credits
      const currentCredits = userProfile?.user_credits_points || 0;

      if (currentCredits < amount) {
        throw new Error('Yetersiz kredi. Lütfen kredi satın alın.');
      }
      
      // Update credits in users table
      const newCredits = currentCredits - amount;
      const { error: updateError } = await supabase
        .from('users')
        .update({ user_credits_points: newCredits })
        .eq('id', user.id);

      if (updateError) {
        throw updateError;
      }

      // Insert transaction record
      const { error: transactionError } = await supabase
        .from('credit_transactions')
        .insert({
          user_id: user.id,
          amount: -amount,
          type: 'video_creation',
          description: description
        });

      if (transactionError) {
        throw transactionError;
      }

      // Refresh credits after deduction
      await fetchCredits();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deduct credits';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const hasEnoughCredits = (amount: number = 1) => {
    return (userProfile?.user_credits_points || 0) >= amount;
  };

  useEffect(() => {
    fetchCredits();
  }, [user, userProfile]);

  return {
    credits,
    transactions,
    loading,
    error,
    fetchCredits,
    deductCredits,
    hasEnoughCredits,
  };
}