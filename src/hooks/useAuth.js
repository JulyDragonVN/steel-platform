// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { DEMO_PASSWORDS } from '../data/constants';
import { FALLBACK_USERS } from '../data/fallback';

const IS_SUPABASE_CONFIGURED =
  import.meta.env.VITE_SUPABASE_URL &&
  !import.meta.env.VITE_SUPABASE_URL.includes('YOUR_PROJECT');

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);

  // ── Khởi tạo: kiểm tra session hiện tại ─────────────────────
  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setCurrentUser(profile);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setCurrentUser(profile);
        } else {
          setCurrentUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Lấy profile từ bảng users ────────────────────────────────
  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('fetchProfile error:', error);
      return null;
    }
    return data;
  }

  // ── Login thật qua Supabase Auth ─────────────────────────────
  const loginWithEmail = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data;
  }, []);

  // ── Login demo (fallback khi chưa cấu hình Supabase) ─────────
  const loginDemo = useCallback((targetUser, password) => {
    if (password !== DEMO_PASSWORDS[targetUser.id]) {
      throw new Error('Mật khẩu không đúng. Vui lòng thử lại.');
    }
    setCurrentUser(targetUser);
  }, []);

  // ── Logout ────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    if (IS_SUPABASE_CONFIGURED) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  }, []);

  return {
    currentUser,
    loading,
    loginWithEmail,
    loginDemo,
    logout,
    isSupabaseMode: IS_SUPABASE_CONFIGURED,
  };
}
