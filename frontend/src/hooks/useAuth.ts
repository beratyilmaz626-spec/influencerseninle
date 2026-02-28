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

  // Check if current user is admin
  const isAdmin = userProfile?.is_admin || false;

  // Kullanıcı profilini getir
  const fetchUserProfile = useCallback(async (userId: string) => {
    // Skip if already fetched for this user
    if (profileFetchedRef.current === userId) {
      return;
    }
    profileFetchedRef.current = userId;
    
    setProfileLoading(true);
    console.log('👤 fetchUserProfile başladı, userId:', userId);
    try {
      if (!supabase) {
        console.error('Supabase client not initialized. Please check environment variables.');
        setProfileLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('👤 Supabase users query result:', { data, error });

      if (error) {
        throw error;
      }

      // Eğer kullanıcı profili bulunamazsa, yeni bir profil oluştur
      if (!data) {
        console.log('👤 Kullanıcı profili bulunamadı, yeni oluşturuluyor...');
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const newProfile = {
            id: userId,
            email: userData.user.email || '',
            full_name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || 'Kullanıcı',
            company_name: null,
            country: 'Türkiye',
            is_admin: userData.user.email === 'ogun.karabulut@hotmail.com' || userData.user.email === 'beratyilmaz626@gmail.com',
            user_credits_points: 200  // Yeni kullanıcılara 200 jeton hediye (1 video = 200 jeton)
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('users')
            .upsert(newProfile, { onConflict: 'id' })
            .select()
            .single();

          if (createError) throw createError;
          console.log('✅ Yeni kullanıcı oluşturuldu, 200 jeton hediye edildi:', createdProfile);
          setUserProfile(createdProfile);
          setProfileLoading(false);
          return;
        }
      }

      console.log('👤 userProfile set ediliyor:', data);
      console.log('👤 is_admin:', data?.is_admin);
      console.log('👤 user_credits_points:', data?.user_credits_points);
      setUserProfile(data || null);
    } catch (error) {
      console.error('Kullanıcı profili getirilemedi:', error);
      profileFetchedRef.current = null; // Allow retry on error
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    // Get initial session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        }
        setLoading(false);
      });

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
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