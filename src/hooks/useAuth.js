import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseReady } from '../lib/supabase';
import { DEMO_PASSWORDS } from '../data/constants';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseReady()) return;

    setLoading(true);
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        setCurrentUser(profile);
      }
      setLoading(false);
    }).catch(() => setLoading(false));

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

  async function fetchProfile(userId) {
    try {
      const { data } = await supabase.from('users').select('*').eq('id', userId).single();
      return data;
    } catch (_) { return null; }
  }

  const loginWithEmail = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data;
  }, []);

  const loginDemo = useCallback((targetUser, password) => {
    if (password !== DEMO_PASSWORDS[targetUser.id]) {
      throw new Error('Mật khẩu không đúng. Vui lòng thử lại.');
    }
    setCurrentUser(targetUser);
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseReady()) await supabase.auth.signOut();
    setCurrentUser(null);
  }, []);

  return {
    currentUser, loading,
    loginWithEmail, loginDemo, logout,
    isSupabaseMode: isSupabaseReady(),
  };
}
