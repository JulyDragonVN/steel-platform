import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeData(table, options = {}) {
  const { select = '*', filter, orderBy = 'created_at' } = options;
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let alive = true;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        let q = supabase.from(table).select(select);
        if (filter)  q = q.eq(filter.column, filter.value);
        if (orderBy) q = q.order(orderBy, { ascending: false });
        const { data: rows, error: err } = await q;
        if (!alive) return;
        if (err) throw err;
        setData(rows ?? []);
      } catch (e) {
        if (alive) setError(e.message || 'Lỗi tải dữ liệu');
      } finally {
        if (alive) setLoading(false);
      }
    }

    fetchData();

    const channel = supabase
      .channel(`realtime:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        if (alive) fetchData();
      })
      .subscribe();

    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
  }, [table]);

  async function insert(row) {
    const { data: r, error: err } = await supabase.from(table).insert(row).select().single();
    if (err) throw err;
    if (r) setData(p => [r, ...p]);
    return r;
  }

  async function update(id, changes) {
    setData(p => p.map(r => r.id === id ? { ...r, ...changes } : r));
    const { error: err } = await supabase.from(table).update(changes).eq('id', id);
    if (err) throw err;
  }

  async function remove(id) {
    setData(p => p.filter(r => r.id !== id));
    const { error: err } = await supabase.from(table).delete().eq('id', id);
    if (err) throw err;
  }

  return { data, loading, error, insert, update, remove };
}
