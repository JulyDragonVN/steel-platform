import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const IS_SUPABASE_CONFIGURED =
  import.meta.env.VITE_SUPABASE_URL &&
  !import.meta.env.VITE_SUPABASE_URL.includes('YOUR_PROJECT');

// Lưu các channel đang dùng để tránh tạo trùng
const activeChannels = {};

export function useRealtimeData(table, fallbackData = [], options = {}) {
  const { select = '*', filter, orderBy = 'created_at' } = options;
  const [data,    setData]    = useState(fallbackData);
  const [loading, setLoading] = useState(IS_SUPABASE_CONFIGURED);
  const [error,   setError]   = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    if (!IS_SUPABASE_CONFIGURED) {
      setData(fallbackData);
      setLoading(false);
      return;
    }

    // Fetch dữ liệu
    async function fetchData() {
      setLoading(true);
      let query = supabase.from(table).select(select);
      if (filter) query = query.eq(filter.column, filter.value);
      if (orderBy) query = query.order(orderBy, { ascending: false });
      const { data: rows, error: err } = await query;
      if (!mountedRef.current) return;
      if (err) {
        setData(fallbackData);
      } else {
        setData(rows || []);
      }
      setLoading(false);
    }

    fetchData();

    // Xóa channel cũ của bảng này nếu có
    if (activeChannels[table]) {
      supabase.removeChannel(activeChannels[table]);
      delete activeChannels[table];
    }

    // Tạo channel mới
    const channelName = 'ch-' + table;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
        if (!mountedRef.current) return;
        const { eventType, new: newRow, old: oldRow } = payload;
        setData((prev) => {
          if (eventType === 'INSERT') return [newRow, ...prev];
          if (eventType === 'UPDATE') return prev.map((r) => (r.id === newRow.id ? newRow : r));
          if (eventType === 'DELETE') return prev.filter((r) => r.id !== oldRow.id);
          return prev;
        });
      })
      .subscribe();

    activeChannels[table] = channel;

    return () => {
      mountedRef.current = false;
      if (activeChannels[table]) {
        supabase.removeChannel(activeChannels[table]);
        delete activeChannels[table];
      }
    };
  }, [table]);

  async function insert(row) {
    if (!IS_SUPABASE_CONFIGURED) {
      setData((p) => [{ ...row, id: Date.now() }, ...p]);
      return;
    }
    await supabase.from(table).insert(row);
  }

  async function update(id, changes) {
    if (!IS_SUPABASE_CONFIGURED) {
      setData((p) => p.map((r) => (r.id === id ? { ...r, ...changes } : r)));
      return;
    }
    await supabase.from(table).update(changes).eq('id', id);
  }

  async function remove(id) {
    if (!IS_SUPABASE_CONFIGURED) {
      setData((p) => p.filter((r) => r.id !== id));
      return;
    }
    await supabase.from(table).delete().eq('id', id);
  }

  return { data, loading, error, insert, update, remove };
}