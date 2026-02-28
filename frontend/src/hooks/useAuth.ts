import { useState, useEffect, useRef, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Database } from '../lib/supabase';

type UserProfile = Database['public']['Tables']['users']['Row'];

// Singleton pattern - hook dışında global state
let _user: User | null = null;
let _session: Session | null = null;
let _userProfile: UserProfile | null = null;
let _isInitialized = false;
let _listeners: Set<() => void> = new Set();

// Notify all listeners
const notifyListeners = () => {
  _listeners.forEach(listener => listener());
};

// Initialize auth once globally
const initializeAuth = async () => {
  if (_isInitialized || !supabase) return;
  _isInitialized = true;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    _session = session;
    _user = session?.user ?? null;
    
    if (_user) {
      await fetchProfile(_user.id);
    }
    
    notifyListeners();
  } catch (error) {
    console.error('Auth init error:', error);
  }
};

// Fetch profile
const fetchProfile = async (userId: string) => {
  if (!supabase) return;
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      // Create new profile
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

        const { data: createdProfile } = await supabase
          .from('users')
          .upsert(newProfile, { onConflict: 'id' })
          .select()
          .single();

        _userProfile = createdProfile;
      }
    } else {
      _userProfile = data;
    }
    
    notifyListeners();
  } catch (error) {
    console.error('Profile fetch error:', error);
  }
};

// Setup auth listener once
let _authListenerSetup = false;
const setupAuthListener = () => {
  if (_authListenerSetup || !supabase) return;
  _authListenerSetup = true;

  supabase.auth.onAuthStateChange((event, session) => {
    // ONLY handle real sign in/out - ignore everything else
    if (event === 'SIGNED_OUT') {
      _user = null;
      _session = null;
      _userProfile = null;
      _isInitialized = false;
      notifyListeners();
    }
  });
};

export function useAuth() {
  const [, forceUpdate] = useState({});
  const mountedRef = useRef(true);

  // Subscribe to global state changes
  useEffect(() => {
    mountedRef.current = true;
    
    const listener = () => {
      if (mountedRef.current) {
        forceUpdate({});
      }
    };
    
    _listeners.add(listener);
    
    // Initialize on first mount
    if (!_isInitialized) {
      initializeAuth();
      setupAuthListener();
    }

    return () => {
      mountedRef.current = false;
      _listeners.delete(listener);
    };
  }, []);

  const isAdmin = _userProfile?.is_admin || (_userProfile as any)?.role === 'admin' || false;

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) return { data: null, error: { message: 'Not connected' } };
    
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return { data: null, error: { message: 'Not connected' } };

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (!error && data.session) {
        _session = data.session;
        _user = data.user;
        _isInitialized = true;
        
        if (data.user) {
          await fetchProfile(data.user.id);
        }
        
        notifyListeners();
      }
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return { error: { message: 'Not connected' } };

    try {
      const { error } = await supabase.auth.signOut();
      
      _user = null;
      _session = null;
      _userProfile = null;
      _isInitialized = false;
      
      notifyListeners();
      
      return { error };
    } catch (error) {
      return { error };
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!_user || !supabase) return { error: { message: 'Not authenticated' } };

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', _user.id)
        .select()
        .single();

      if (!error && data) {
        _userProfile = data;
        notifyListeners();
      }
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (_user) {
      await fetchProfile(_user.id);
    }
  }, []);

  return {
    user: _user,
    session: _session,
    userProfile: _userProfile,
    isAdmin,
    loading: !_isInitialized,
    profileLoading: false,
    signUp,
    signIn,
    signOut,
    updateProfile,
    fetchUserProfile: refreshProfile,
  };
}
