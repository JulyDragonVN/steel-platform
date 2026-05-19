import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useRealtimeData(table, options = {}) {
  const { select = '*', filter, orderBy = 'created_at' } = options;
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Chuyển filter thành chuỗi JSON để làm dependency an toàn cho useEffect
  const filterString = filter ? JSON.stringify(filter) : '';

  useEffect(() => {
    let alive = true;
    
    // 1. Khởi tạo Channel riêng biệt
    const channel = supabase.channel(`realtime_${table}_${Date.now()}`);

    async function fetchData() {
      if (!alive) return;
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

    // Chạy lấy dữ liệu lần đầu
    fetchData();

    // 2. Thiết lập lắng nghe sự kiện TRƯỚC
    channel.on(
      'postgres_changes', 
      { event: '*', schema: 'public', table: table }, 
      () => {
        if (alive) fetchData();
      }
    );

    // 3. Cuối cùng mới kích hoạt kết nối .subscribe()
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`Realtime connected to table: ${table}`);
      }
    });

    // 4. Hàm dọn dẹp bắt buộc để tránh trùng lặp kênh lắng nghe
    return () => {
      alive = false;
      supabase.removeChannel(channel);
    };
    
    // Thêm các dependency chuẩn để useEffect biết chính xác khi nào cần chạy lại
  }, [table, select, filterString, orderBy]);

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