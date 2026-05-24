const API_URL = import.meta.env.VITE_SHEETS_API_URL || '';

export function isSheetsReady() {
  return !!(API_URL && API_URL.startsWith('https://script.google.com'));
}

export async function fetchTable(table) {
  if (!isSheetsReady()) return null;
  try {
    const res = await fetch(API_URL + '?table=' + table);
    const json = await res.json();
    return json.data || null;
  } catch (e) {
    return null;
  }
}

export async function insertRow(table, row) {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ table, action: 'insert', row }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data;
}

export async function updateRow(table, id, changes) {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ table, action: 'update', id, changes }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}

export async function deleteRow(table, id) {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({ table, action: 'delete', id }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
}
