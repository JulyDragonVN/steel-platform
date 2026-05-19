import { useState, useEffect, useRef } from 'react';
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
  const fetchedRef  = useRef(false);
  const channelRef  = useRef(null);

  useEffect(() => {
    // Không dùng Supabase — dùng fallback ngay
    if (!ready) {
      setData(fallbackData);
      setLoading(false);
      return;
    }

    // Tránh fetch 2 lần do Strict Mode
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let alive = true;

    // 1. Fetch dữ liệu 1 lần
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
          setData(rows ?? fallbackData);
        }
      } catch (e) {
        if (alive) setData(fallbackData);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    // 2. Realtime — chỉ subscribe 1 lần, tên channel cố định theo bảng
    const chName = 'sub-' + table;

    // Xóa channel cũ nếu còn sót
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    try {
      const ch = supabase
        .channel(chName)
        .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
          if (!alive) return;
          setData((prev) => {
            const { eventType, new: n, old: o } = payload;
            if (eventType === 'INSERT') return [n, ...prev];
            if (eventType === 'UPDATE') return prev.map((r) => (r.id === n.id ? n : r));
            if (eventType === 'DELETE') return prev.filter((r) => r.id !== o.id);
            return prev;
          });
        })
        .subscribe();
      channelRef.current = ch;
    } catch (e) {
      // Realtime lỗi không ảnh hưởng đến dữ liệu đã fetch
      console.warn('[realtime ' + table + ']', e.message);
    }

    return () => {
      alive = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []); // chạy đúng 1 lần

  // ── CRUD ──────────────────────────────────────────────────────
  async function insert(row) {
    if (!ready) { setData((p) => [{ ...row, id: Date.now() }, ...p]); return; }
    const { data: r, error } = await supabase.from(table).insert(row).select().single();
    if (error) throw error;
    return r;
  }

  async function update(id, changes) {
    if (!ready) { setData((p) => p.map((r) => (r.id === id ? { ...r, ...changes } : r))); return; }
    const { error } = await supabase.from(table).update(changes).eq('id', id);
    if (error) throw error;
  }

  async function remove(id) {
    if (!ready) { setData((p) => p.filter((r) => r.id !== id)); return; }
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  }

  return { data, loading, insert, update, remove };
}