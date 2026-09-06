const SHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'DataInsightPro';

function getSheet_() {
  if (!SHEET_ID || SHEET_ID === 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE') {
    throw new Error('Set SHEET_ID before deploying this Web App.');
  }
  const ss = SpreadsheetApp.openById(SHEET_ID);
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet) {
  const headers = ['Timestamp', 'Row ID', 'Form ID', 'Form Title', 'Data JSON'];
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function json_(value, callback) {
  const text = JSON.stringify(value);
  if (callback) {
    return ContentService.createTextOutput(callback + '(' + text + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(text)
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  try {
    const p = (e && e.parameter) || {};
    const callback = p.callback || '';
    const action = p.action || 'health';

    if (action === 'health') {
      getSheet_();
      return json_({ ok: true, service: 'DataInsightPro Google Sheets Bridge' }, callback);
    }

    if (action === 'list') {
      const sheet = getSheet_();
      ensureHeaders_(sheet);
      const values = sheet.getDataRange().getValues();
      if (values.length <= 1) return json_([], callback);

      const rows = values.slice(1).map(function(row) {
        let data = {};
        try { data = row[4] ? JSON.parse(row[4]) : {}; } catch (err) {}
        return {
          timestamp: row[0] instanceof Date ? row[0].toISOString() : String(row[0] || ''),
          rowId: String(row[1] || ''),
          formId: String(row[2] || ''),
          formTitle: String(row[3] || ''),
          data: data
        };
      }).filter(function(r) {
        return !p.formId || r.formId === p.formId;
      });

      return json_(rows, callback);
    }

    return json_({ ok: false, error: 'Unknown action.' }, callback);
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) }, (e && e.parameter && e.parameter.callback) || '');
  }
}

function doPost(e) {
  try {
    const raw = e && e.postData && e.postData.contents ? e.postData.contents : '';
    const p = (e && e.parameter) || {};
    const body = raw ? JSON.parse(raw) : (p.payload ? JSON.parse(p.payload) : p);
    const action = body.action || 'create';
    const sheet = getSheet_();
    ensureHeaders_(sheet);

    if (action === 'create') {
      const rowId = 'row_' + Utilities.getUuid();
      sheet.appendRow([
        new Date(),
        rowId,
        body.formId || '',
        body.formTitle || '',
        JSON.stringify(body.data || {})
      ]);
      return json_({ ok: true, action: 'create', rowId: rowId });
    }

    if (action === 'update') {
      const rowId = String(body.rowId || '');
      if (!rowId) throw new Error('Missing rowId.');
      const last = sheet.getLastRow();
      if (last < 2) throw new Error('No entries found.');
      const ids = sheet.getRange(2, 2, last - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === rowId) {
          sheet.getRange(i + 2, 5).setValue(JSON.stringify(body.data || {}));
          return json_({ ok: true, action: 'update', rowId: rowId });
        }
      }
      throw new Error('Entry not found.');
    }

    if (action === 'delete') {
      const rowId = String(body.rowId || '');
      if (!rowId) throw new Error('Missing rowId.');
      const last = sheet.getLastRow();
      if (last < 2) throw new Error('No entries found.');
      const ids = sheet.getRange(2, 2, last - 1, 1).getValues();
      for (let i = 0; i < ids.length; i++) {
        if (String(ids[i][0]) === rowId) {
          sheet.deleteRow(i + 2);
          return json_({ ok: true, action: 'delete', rowId: rowId });
        }
      }
      throw new Error('Entry not found.');
    }

    return json_({ ok: false, error: 'Unknown action.' });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}
