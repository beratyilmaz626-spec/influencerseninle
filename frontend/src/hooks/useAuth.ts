import { useState, useEffect, useRef, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Database } from '../lib/supabase';

type UserProfile = Database['public']['Tables']['users']['Row'];

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Prevent multiple profile fetches
  const profileFetchedRef = useRef<string | null>(null);
  const authInitializedRef = useRef(false);

  // Check if current user is admin - check both is_admin and role fields
  const isAdmin = userProfile?.is_admin || (userProfile as any)?.role === 'admin' || false;

  // Kullanıcı profilini getir
  const fetchUserProfile = useCallback(async (userId: string) => {
    // Skip if already fetched for this user
    if (profileFetchedRef.current === userId) {
      return;
    }
    
    profileFetchedRef.current = userId;
    setProfileLoading(true);
    
    try {
      if (!supabase) {
        console.error('Supabase client not initialized');
        setProfileLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      // Eğer kullanıcı profili bulunamazsa, yeni bir profil oluştur
      if (!data) {
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
      console.error('User profile fetch failed:', error);
      profileFetchedRef.current = null; // Allow retry on error
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    // Run only once
    if (authInitializedRef.current) return;
    authInitializedRef.current = true;
    
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes - but only process significant changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only handle actual auth state changes, not token refreshes
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          if (profileFetchedRef.current !== session.user.id) {
            fetchUserProfile(session.user.id);
          }
        } else {
          setUserProfile(null);
          profileFetchedRef.current = null;
        }
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      if (!supabase) {
        return { data: null, error: { message: 'Supabase connection not available' } };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
        }
      });
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      if (!supabase) {
        return { error: { message: 'Supabase connection not available' } };
      }

      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!supabase) {
        return { data: null, error: { message: 'Supabase connection not available' } };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      console.error('❌ updateProfile: Kullanıcı oturumu bulunamadı');
      return { error: { message: 'Kullanıcı oturumu bulunamadı' } };
    }
    if (!supabase) {
      console.error('❌ updateProfile: Supabase connection not available');
      return { error: { message: 'Supabase connection not available' } };
    }

    try {
      console.log('📝 updateProfile: Güncelleniyor...', { userId: user.id, updates });
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('❌ updateProfile Hata:', error);
        throw error;
      }
      
      console.log('✅ updateProfile Başarılı:', data);
      setUserProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error('❌ updateProfile Catch:', error);
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