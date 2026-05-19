import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isSupabaseMode = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!isSupabaseMode) {
  console.warn(
    'Missing Supabase env variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
    'Login will require demo fallback or env configuration.'
  );
}

export const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_ANON_KEY ?? '');
