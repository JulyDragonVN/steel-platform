import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function isSupabaseReady() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  return !!(url && url.startsWith('https://') && !url.includes('YOUR_PROJECT'));
}

export function useRealtimeData(table, fallbackData = [], options = {}) {
  const { select = '*', filter, orderBy = 'created_at' } = options;
  const ready = isSupabaseReady();

  const [data,    setData]    = useState(fallbackData);
  const [loading, setLoading] = useState(ready);

  useEffect(() => {
    if (!ready) {
      setData(fallbackData);
      setLoading(false);
      return;
    }

    let alive = true;
    setLoading(true);

    (async () => {
      try {
        let query = supabase.from(table).select(select);
        if (filter)  query = query.eq(filter.column, filter.value);
        if (orderBy) query = query.order(orderBy, { ascending: false });

        const { data: rows, error } = await query;
        if (!alive) return;

        if (error) {
          console.warn('[' + table + ']', error.message);
          setData(fallbackData);
        } else {
          setData(rows && rows.length > 0 ? rows : fallbackData);
        }
      } catch (e) {
        if (alive) setData(fallbackData);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [table]);

  async function insert(row) {
    if (!ready) { setData((p) => [{ ...row, id: Date.now() }, ...p]); return; }
    const { data: r, error } = await supabase.from(table).insert(row).select().single();
    if (error) throw error;
    setData((p) => [r, ...p]);
    return r;
  }

  async function update(id, changes) {
    if (!ready) { setData((p) => p.map((r) => (r.id === id ? { ...r, ...changes } : r))); return; }
    const { error } = await supabase.from(table).update(changes).eq('id', id);
    if (error) throw error;
    setData((p) => p.map((r) => (r.id === id ? { ...r, ...changes } : r)));
  }

  async function remove(id) {
    if (!ready) { setData((p) => p.filter((r) => r.id !== id)); return; }
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    setData((p) => p.filter((r) => r.id !== id));
  }

  return { data, loading, insert, update, remove };
}