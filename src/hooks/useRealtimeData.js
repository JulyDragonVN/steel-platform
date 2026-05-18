// src/hooks/useRealtimeData.js
// Hook tổng quát: fetch + lắng nghe realtime từ một bảng Supabase.
// Tự động fallback sang dữ liệu tĩnh nếu Supabase chưa được cấu hình.

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const IS_SUPABASE_CONFIGURED =
  import.meta.env.VITE_SUPABASE_URL &&
  !import.meta.env.VITE_SUPABASE_URL.includes('YOUR_PROJECT');

/**
 * @param {string}   table        - Tên bảng Supabase (vd: 'tasks')
 * @param {Array}    fallbackData - Dữ liệu tĩnh dùng khi offline/chưa cấu hình
 * @param {object}   [options]
 * @param {string}   [options.select]  - Chuỗi select (vd: '*, users(*)')
 * @param {object}   [options.filter]  - { column, value } để lọc theo 1 cột
 * @param {string}   [options.orderBy] - Cột sắp xếp
 */
export function useRealtimeData(table, fallbackData = [], options = {}) {
  const { select = '*', filter, orderBy = 'created_at' } = options;

  const [data,    setData]    = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!IS_SUPABASE_CONFIGURED) {
      setData(fallbackData);
      setLoading(false);
      return;
    }

    // ── Fetch lần đầu ──────────────────────────────────────────
    async function fetchData() {
      setLoading(true);
      let query = supabase.from(table).select(select);
      if (filter) query = query.eq(filter.column, filter.value);
      if (orderBy) query = query.order(orderBy, { ascending: false });

      const { data: rows, error: err } = await query;
      if (err) {
        console.error(`[${table}] fetch error:`, err);
        setError(err.message);
        setData(fallbackData); // fallback nếu lỗi
      } else {
        setData(rows || []);
      }
      setLoading(false);
    }

    fetchData();

    // ── Realtime subscription ──────────────────────────────────
    const channel = supabase
      .channel(`realtime:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          const { eventType, new: newRow, old: oldRow } = payload;
          setData((prev) => {
            if (eventType === 'INSERT') return [newRow, ...prev];
            if (eventType === 'UPDATE') return prev.map((r) => (r.id === newRow.id ? newRow : r));
            if (eventType === 'DELETE') return prev.filter((r) => r.id !== oldRow.id);
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, filter?.value]);

  // ── Helpers CRUD ──────────────────────────────────────────────
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
