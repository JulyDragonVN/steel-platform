import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) setCurrentUser(await fetchProfile(session.user.id));
      setLoading(false);
    }).catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) setCurrentUser(await fetchProfile(session.user.id));
        else setCurrentUser(null);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    try {
      const { data } = await supabase.from('users').select('*').eq('id', userId).single();
      return data ?? null;
    } catch { return null; }
  }

  const loginWithEmail = useCallback(async (email, password) => {
    if (!supabase) throw new Error('Supabase chưa được cấu hình.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    return data;
  }, []);

  const logout = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setCurrentUser(null);
  }, []);

  return { currentUser, loading, loginWithEmail, logout };
}
