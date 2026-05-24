// ============================================================
// STEELTEAM — Google Apps Script
// Hướng dẫn deploy:
// 1. Mở Google Sheets → Extensions → Apps Script
// 2. Xóa code cũ, paste toàn bộ file này vào
// 3. Deploy → New deployment → Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 4. Copy URL → dán vào VITE_SHEETS_API_URL trong Vercel
// ============================================================

const SHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();

// Tên các sheet tab
const SHEETS = {
  users:          'users',
  projects:       'projects',
  tasks:          'tasks',
  documents:      'documents',
  quality_issues: 'quality_issues',
  plugins:        'plugins',
  activity:       'activity',
};

// ── GET: đọc dữ liệu ─────────────────────────────────────────
function doGet(e) {
  try {
    const table = e.parameter.table;
    if (!table || !SHEETS[table]) {
      return jsonResponse({ error: 'Invalid table: ' + table });
    }
    const rows = getRows(table);
    return jsonResponse({ data: rows });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

// ── POST: ghi dữ liệu ────────────────────────────────────────
function doPost(e) {
  try {
    const body   = JSON.parse(e.postData.contents);
    const table  = body.table;
    const action = body.action; // insert | update | delete

    if (!table || !SHEETS[table]) {
      return jsonResponse({ error: 'Invalid table' });
    }

    if (action === 'insert') {
      const newRow = insertRow(table, body.row);
      return jsonResponse({ data: newRow });
    }
    if (action === 'update') {
      updateRow(table, body.id, body.changes);
      return jsonResponse({ success: true });
    }
    if (action === 'delete') {
      deleteRow(table, body.id);
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: 'Unknown action' });
  } catch (err) {
    return jsonResponse({ error: err.message });
  }
}

// ── Helpers ───────────────────────────────────────────────────
function getSheet(table) {
  const ss    = SpreadsheetApp.openById(SHEET_ID);
  let   sheet = ss.getSheetByName(table);
  if (!sheet) sheet = ss.insertSheet(table);
  return sheet;
}

function getRows(table) {
  const sheet  = getSheet(table);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0];
  return values.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
}

function insertRow(table, row) {
  const sheet   = getSheet(table);
  const values  = sheet.getDataRange().getValues();
  const headers = values.length > 0 ? values[0] : Object.keys(row);

  // Tạo header nếu sheet trống
  if (values.length === 0) {
    const allKeys = ['id', ...Object.keys(row).filter(k => k !== 'id')];
    sheet.appendRow(allKeys);
  }

  // Tạo ID mới
  const newId = Date.now().toString();
  const newRow = { id: newId, ...row, created_at: new Date().toISOString() };

  const rowValues = headers.map(h => newRow[h] !== undefined ? newRow[h] : '');
  sheet.appendRow(rowValues);
  return newRow;
}

function updateRow(table, id, changes) {
  const sheet   = getSheet(table);
  const values  = sheet.getDataRange().getValues();
  const headers = values[0];
  const idCol   = headers.indexOf('id');

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][idCol]) === String(id)) {
      Object.entries(changes).forEach(([key, val]) => {
        const col = headers.indexOf(key);
        if (col !== -1) sheet.getRange(i + 1, col + 1).setValue(val);
      });
      return;
    }
  }
}

function deleteRow(table, id) {
  const sheet   = getSheet(table);
  const values  = sheet.getDataRange().getValues();
  const headers = values[0];
  const idCol   = headers.indexOf('id');

  for (let i = values.length - 1; i >= 1; i--) {
    if (String(values[i][idCol]) === String(id)) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
