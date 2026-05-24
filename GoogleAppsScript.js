// ============================================================
// STEELTEAM — Google Apps Script
// Hướng dẫn:
// 1. Mở Google Sheets → Extensions → Apps Script
// 2. Paste toàn bộ code này vào, xóa code cũ
// 3. Deploy → New deployment → Web app
//    Execute as: Me | Who has access: Anyone
// 4. Copy URL → thêm vào Vercel: VITE_SHEETS_API_URL
// ============================================================

function doGet(e) {
  try {
    const table = e.parameter.table;
    if (!table) return json({ error: 'Missing table' });
    return json({ data: getRows(table) });
  } catch(err) { return json({ error: err.message }); }
}

function doPost(e) {
  try {
    const body   = JSON.parse(e.postData.contents);
    const table  = body.table;
    const action = body.action;
    if (!table) return json({ error: 'Missing table' });
    if (action === 'insert') return json({ data: insertRow(table, body.row) });
    if (action === 'update') { updateRow(table, body.id, body.changes); return json({ success: true }); }
    if (action === 'delete') { deleteRow(table, body.id); return json({ success: true }); }
    return json({ error: 'Unknown action' });
  } catch(err) { return json({ error: err.message }); }
}

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function getRows(table) {
  const sheet = getSheet(table);
  const vals  = sheet.getDataRange().getValues();
  if (vals.length < 2) return [];
  const headers = vals[0];
  return vals.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
}

function insertRow(table, row) {
  const sheet   = getSheet(table);
  const vals    = sheet.getDataRange().getValues();
  var   headers = vals.length > 0 ? vals[0] : null;
  if (!headers || vals.length === 0) {
    headers = ['id', ...Object.keys(row).filter(k => k !== 'id'), 'created_at'];
    sheet.appendRow(headers);
  }
  const newRow = { id: Date.now().toString(), ...row, created_at: new Date().toISOString() };
  sheet.appendRow(headers.map(h => newRow[h] !== undefined ? newRow[h] : ''));
  return newRow;
}

function updateRow(table, id, changes) {
  const sheet   = getSheet(table);
  const vals    = sheet.getDataRange().getValues();
  const headers = vals[0];
  const idCol   = headers.indexOf('id');
  for (var i = 1; i < vals.length; i++) {
    if (String(vals[i][idCol]) === String(id)) {
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
  const vals    = sheet.getDataRange().getValues();
  const headers = vals[0];
  const idCol   = headers.indexOf('id');
  for (var i = vals.length - 1; i >= 1; i--) {
    if (String(vals[i][idCol]) === String(id)) { sheet.deleteRow(i + 1); return; }
  }
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
