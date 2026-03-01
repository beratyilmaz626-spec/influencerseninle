import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, Database } from '../lib/supabase';

type UserProfile = Database['public']['Tables']['users']['Row'];

// Global singleton state - prevents re-renders
let _user: User | null = null;
let _session: Session | null = null;
let _userProfile: UserProfile | null = null;
let _initialized = false;
let _listeners: Set<() => void> = new Set();

const notify = () => _listeners.forEach(l => l());

// Initialize once
const init = async () => {
  if (_initialized || !supabase) return;
  _initialized = true;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    _session = session;
    _user = session?.user ?? null;

    if (_user) {
      const { data } = await supabase.from('users').select('*').eq('id', _user.id).maybeSingle();
      _userProfile = data;
    }

    notify();
  } catch (e) {
    console.error('Auth init error:', e);
  }
};

export function useAuth() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const listener = () => forceUpdate({});
    _listeners.add(listener);

    if (!_initialized) init();

    return () => { _listeners.delete(listener); };
  }, []);

  const isAdmin = _userProfile?.is_admin || (_userProfile as any)?.role === 'admin' || false;

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return { data: null, error: { message: 'Not connected' } };

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (!error && data.session) {
        _session = data.session;
        _user = data.user;

        if (data.user) {
          const { data: profile } = await supabase.from('users').select('*').eq('id', data.user.id).maybeSingle();
          _userProfile = profile;
        }

        notify();
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) return { data: null, error: { message: 'Not connected' } };

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
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
      _initialized = false;

      notify();

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
        notify();
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    if (_user && supabase) {
      const { data } = await supabase.from('users').select('*').eq('id', _user.id).maybeSingle();
      _userProfile = data;
      notify();
    }
  }, []);

  return {
    user: _user,
    session: _session,
    userProfile: _userProfile,
    isAdmin,
    loading: !_initialized,
    profileLoading: false,
    signUp,
    signIn,
    signOut,
    updateProfile,
    fetchUserProfile,
  };
}
