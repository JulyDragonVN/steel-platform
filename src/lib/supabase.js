import { createClient } from '@supabase/supabase-js';

<<<<<<< HEAD
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
=======
const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL      || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = supabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
>>>>>>> 20d39a1046e1bac1f2bec6617a7382cae8ec7832
