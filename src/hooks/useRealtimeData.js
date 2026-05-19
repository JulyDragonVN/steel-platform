import { useState, useEffect } from 'react';
import { supabase, isSupabaseReady } from '../lib/supabase';

export function useRealtimeData(table, fallbackData = [], options = {}) {
  const { select = '*', filter, orderBy = 'created_at' } = options;
  const [data, setData] = useState(fallbackData);

  useEffect(() => {
    if (!isSupabaseReady()) return; // dùng fallback, không fetch

    let alive = true;
    (async () => {
      try {
        let q = supabase.from(table).select(select);
        if (filter)  q = q.eq(filter.column, filter.value);
        if (orderBy) q = q.order(orderBy, { ascending: false });
        const { data: rows } = await q;
        if (alive && rows && rows.length > 0) setData(rows);
      } catch (_) {}
    })();

    return () => { alive = false; };
  }, [table]);

  async function insert(row) {
    if (!isSupabaseReady()) { setData(p => [{ ...row, id: Date.now() }, ...p]); return; }
    const { data: r } = await supabase.from(table).insert(row).select().single();
    if (r) setData(p => [r, ...p]);
    return r;
  }

  async function update(id, changes) {
    setData(p => p.map(r => r.id === id ? { ...r, ...changes } : r));
    if (!isSupabaseReady()) return;
    await supabase.from(table).update(changes).eq('id', id);
  }

  async function remove(id) {
    setData(p => p.filter(r => r.id !== id));
    if (!isSupabaseReady()) return;
    await supabase.from(table).delete().eq('id', id);
  }

  return { data, loading: false, insert, update, remove };
}
