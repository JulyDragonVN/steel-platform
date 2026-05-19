import { createClient } from '@supabase/supabase-js';

// ─── ĐIỀN THÔNG TIN SUPABASE CỦA BẠN VÀO ĐÂY ────────────────────────────────
// Lấy tại: https://supabase.com → Project Settings → API
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://rdpuzjexxcknmmiodhft.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_aKPt7HMvD_GaWCSItBuDGw_LzTWJNg1';
// ─────────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: { eventsPerSecond: 10 },
  },
});

export default supabase;
