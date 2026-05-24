// src/hooks/useSheetsData.js
// Thay thế hoàn toàn useRealtimeData — không cần Supabase
import { useState, useEffect } from 'react';
import { fetchTable, insertRow, updateRow, deleteRow, isSheetsReady } from '../lib/sheetsApi';

export function useSheetsData(table, fallbackData = []) {
  const [data, setData] = useState(fallbackData);

  useEffect(() => {
    if (!isSheetsReady()) return; // dùng fallback
    fetchTable(table).then(rows => {
      if (rows && rows.length > 0) setData(rows);
    });
  }, [table]);

  async function insert(row) {
    if (!isSheetsReady()) {
      const newRow = { ...row, id: Date.now().toString() };
      setData(p => [newRow, ...p]);
      return newRow;
    }
    const newRow = await insertRow(table, row);
    setData(p => [newRow, ...p]);
    return newRow;
  }

  async function update(id, changes) {
    setData(p => p.map(r => String(r.id) === String(id) ? { ...r, ...changes } : r));
    await updateRow(table, id, changes);
  }

  async function remove(id) {
    setData(p => p.filter(r => String(r.id) !== String(id)));
    await deleteRow(table, id);
  }

  return { data, loading: false, insert, update, remove };
}
