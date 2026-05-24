// src/lib/sheetsApi.js
// Giao tiếp với Google Apps Script Web App

const API_URL = import.meta.env.VITE_SHEETS_API_URL || '';

export function isSheetsReady() {
  return !!(API_URL && API_URL.startsWith('https://script.google.com'));
}

// Đọc toàn bộ 1 bảng
export async function fetchTable(table) {
  if (!isSheetsReady()) return null;
  try {
    const res  = await fetch(`${API_URL}?table=${table}`);
    const json = await res.json();
    return json.data || null;
  } catch (e) {
    console.warn('[sheets] fetch error:', e.message);
    return null;
  }
}

// Thêm 1 dòng
export async function insertRow(table, row) {
  if (!isSheetsReady()) return null;
  const res  = await fetch(API_URL, {
    method: 'POST',
    body:   JSON.stringify({ table, action: 'insert', row }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

// Cập nhật 1 dòng
export async function updateRow(table, id, changes) {
  if (!isSheetsReady()) return;
  const res  = await fetch(API_URL, {
    method: 'POST',
    body:   JSON.stringify({ table, action: 'update', id, changes }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}

// Xóa 1 dòng
export async function deleteRow(table, id) {
  if (!isSheetsReady()) return;
  const res  = await fetch(API_URL, {
    method: 'POST',
    body:   JSON.stringify({ table, action: 'delete', id }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}
