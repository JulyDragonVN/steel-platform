// src/hooks/useAuth.js — Demo login, không cần Supabase
import { useState, useCallback } from 'react';
import { DEMO_PASSWORDS } from '../data/constants';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);

  const loginDemo = useCallback((targetUser, password) => {
    if (password !== DEMO_PASSWORDS[targetUser.id]) {
      throw new Error('Mật khẩu không đúng. Vui lòng thử lại.');
    }
    setCurrentUser(targetUser);
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

  return {
    currentUser,
    loading: false,
    loginDemo,
    logout,
    isSupabaseMode: false,
  };
}
