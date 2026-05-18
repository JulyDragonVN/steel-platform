// src/hooks/useRealtimeData.js
import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const IS_SUPABASE_CONFIGURED =
  import.meta.env.VITE_SUPABASE_URL &&
  !import.meta.env.VITE_SUPABASE_URL.includes('YOUR_PROJECT');

export function useRealtimeData(table, fallbackData = [], options = {}) {
  const { select = '*', filter, orderBy = 'created_at' } = options;

  const [data,    setData]    = useState(fallbackData);
  const [loading, setLoading] = useState(IS_SUPABASE_CONFIGURED);
  const [error,   setError]   = useState(null);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) {
      setData(fallbackData);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      let query = supabase.from(table).select(select);
      if (filter) query = query.eq(filter.column, filter.value);
      if (orderBy) query = query.order(orderBy, { ascending: false });

      const { data: rows, error: err } = await query;
      if (cancelled) return;

      if (err) {
        console.error('[' + table + '] fetch error:', err);
        setError(err.message);
        setData(fallbackData);
      } else {
        setData(rows || []);
      }
      setLoading(false);
    }

    fetchData();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel('rt-' + table + '-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
        const { eventType, new: newRow, old: oldRow } = payload;
        setData((prev) => {
          if (eventType === 'INSERT') return [newRow, ...prev];
          if (eventType === 'UPDATE') return prev.map((r) => (r.id === newRow.id ? newRow : r));
          if (eventType === 'DELETE') return prev.filter((r) => r.id !== oldRow.id);
          return prev;
        });
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      cancelled = true;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  async function insert(row) {
    if (!IS_SUPABASE_CONFIGURED) {
      const newRow = { ...row, id: Date.now() };
      setData((p) => [newRow, ...p]);
      return newRow;
    }
    const { data: inserted, error: err } = await supabase.from(table).insert(row).select().single();
    if (err) throw new Error(err.message);
    return inserted;
  }

  async function update(id, changes) {
    if (!IS_SUPABASE_CONFIGURED) {
      setData((p) => p.map((r) => (r.id === id ? { ...r, ...changes } : r)));
      return;
    }
    const { error: err } = await supabase.from(table).update(changes).eq('id', id);
    if (err) throw new Error(err.message);
  }

  async function remove(id) {
    if (!IS_SUPABASE_CONFIGURED) {
      setData((p) => p.filter((r) => r.id !== id));
      return;
    }
    const { error: err } = await supabase.from(table).delete().eq('id', id);
    if (err) throw new Error(err.message);
  }

  return { data, loading, error, insert, update, remove };
}