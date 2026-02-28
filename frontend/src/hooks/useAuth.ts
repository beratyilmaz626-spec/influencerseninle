import { useState, useEffect, useRef, useCallback } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase, Database } from '../lib/supabase';

type UserProfile = Database['public']['Tables']['users']['Row'];

// Global flag to prevent multiple initializations across re-renders
let globalAuthInitialized = false;
let globalUserId: string | null = null;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Check if current user is admin
  const isAdmin = userProfile?.is_admin || (userProfile as any)?.role === 'admin' || false;

  // Fetch user profile - only once per user
  const fetchUserProfile = useCallback(async (userId: string) => {
    // Skip if already fetched for this user globally
    if (globalUserId === userId) {
      return;
    }
    
    globalUserId = userId;
    setProfileLoading(true);
    
    try {
      if (!supabase) {
        setProfileLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        // Create new user profile
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const newProfile = {
            id: userId,
            email: userData.user.email || '',
            full_name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || 'Kullanıcı',
            company_name: null,
            country: 'Türkiye',
            is_admin: userData.user.email === 'ogun.karabulut@hotmail.com' || userData.user.email === 'beratyilmaz626@gmail.com',
            user_credits_points: 200
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('users')
            .upsert(newProfile, { onConflict: 'id' })
            .select()
            .single();

          if (createError) throw createError;
          setUserProfile(createdProfile);
          setProfileLoading(false);
          return;
        }
      }

      setUserProfile(data || null);
    } catch (error) {
      console.error('Profile fetch failed:', error);
      globalUserId = null; // Allow retry on error
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    // Strict single initialization using global flag
    if (globalAuthInitialized) {
      setLoading(false);
      return;
    }
    globalAuthInitialized = true;
    
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session once
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        fetchUserProfile(initialSession.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes - ONLY handle real sign in/out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, newSession) => {
      // CRITICAL: Only process actual authentication changes
      // Ignore: TOKEN_REFRESHED, INITIAL_SESSION, MFA events
      if (event === 'SIGNED_IN') {
        // Only update if this is a real sign in (not just a token refresh)
        if (!session && newSession) {
          setSession(newSession);
          setUser(newSession.user);
          if (newSession.user && globalUserId !== newSession.user.id) {
            fetchUserProfile(newSession.user.id);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setUserProfile(null);
        globalUserId = null;
      }
      // Explicitly ignore: TOKEN_REFRESHED, USER_UPDATED, PASSWORD_RECOVERY, etc.
    });

    return () => {
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase connection not available' } };
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    if (!supabase) {
      return { error: { message: 'Supabase connection not available' } };
    }

    try {
      // Reset global state on sign out
      globalAuthInitialized = false;
      globalUserId = null;
      
      const { error } = await supabase.auth.signOut();
      
      // Force clear local state
      setSession(null);
      setUser(null);
      setUserProfile(null);
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase connection not available' } };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (!error && data.session) {
        // Immediately update state on successful sign in
        setSession(data.session);
        setUser(data.user);
        if (data.user) {
          fetchUserProfile(data.user.id);
        }
      }
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !supabase) {
      return { error: { message: 'Not authenticated' } };
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setUserProfile(data);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return {
    user,
    session,
    userProfile,
    isAdmin,
    loading,
    profileLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    fetchUserProfile,
  };
}
