import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL     = import.meta.env.VITE_SUPABASE_URL     || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(
  SUPABASE_URL     || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder',
);

export function isSupabaseReady() {
  return !!(
    SUPABASE_URL &&
    SUPABASE_URL.startsWith('https://') &&
    !SUPABASE_URL.includes('placeholder') &&
    SUPABASE_ANON_KEY &&
    SUPABASE_ANON_KEY !== 'placeholder'
  );
}
