import { useState, useEffect } from 'react';
import { fetchTable, insertRow, updateRow, deleteRow, isSheetsReady } from '../lib/sheetsApi';

export function useData(table, fallbackData = []) {
  const [data, setData] = useState(fallbackData);

  useEffect(() => {
    if (!isSheetsReady()) return;
    fetchTable(table).then(rows => {
      if (rows && rows.length > 0) setData(rows);
    });
  }, [table]);

  async function insert(row) {
    if (!isSheetsReady()) {
      const r = { ...row, id: Date.now().toString() };
      setData(p => [r, ...p]);
      return r;
    }
    const r = await insertRow(table, row);
    setData(p => [r, ...p]);
    return r;
  }

  async function update(id, changes) {
    setData(p => p.map(r => String(r.id) === String(id) ? { ...r, ...changes } : r));
    if (isSheetsReady()) await updateRow(table, id, changes);
  }

  async function remove(id) {
    setData(p => p.filter(r => String(r.id) !== String(id)));
    if (isSheetsReady()) await deleteRow(table, id);
  }

  return { data, insert, update, remove };
}
