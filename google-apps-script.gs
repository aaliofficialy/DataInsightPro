const SHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const DEFAULT_SHEET_NAME = 'DataInsightPro';

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'health') return respond({ok:true,service:'DataInsightPro Forms'} , p.callback);
  if (p.action !== 'list') return respond({ok:true,service:'DataInsightPro Forms'}, p.callback);
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(p.formId) || ss.getSheetByName(DEFAULT_SHEET_NAME) || ss.getSheets()[0];
    if (!sheet) return respond([], p.callback);
    const values = sheet.getDataRange().getValues();
    if (values.length < 2) return respond([], p.callback);
    const headers = values[0].map(String);
    const out = values.slice(1).map((r,i)=>{
      const o={rowId:i+2,timestamp:r[0],data:{}};
      headers.slice(1).forEach((h,j)=>o.data[h]=r[j+1] == null ? '' : String(r[j+1]));
      return o;
    }).filter(r=>Object.values(r.data).some(v=>String(v).trim()));
    return respond(out, p.callback);
  } catch(err) { return respond({ok:false,error:String(err)}, p.callback); }
}

function doPost(e) {
  try {
    const p = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (!SHEET_ID || SHEET_ID.indexOf('PASTE_') === 0) return json({ok:false,error:'Set SHEET_ID in google-apps-script.gs first.'});
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(p.formId);
    if (!sheet) {
      sheet = ss.insertSheet(p.formId || DEFAULT_SHEET_NAME);
      sheet.appendRow(['Submitted At', ...(p.fields || [])]);
    }
    if (p.action === 'create') {
      const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
      const row = [new Date(), ...headers.slice(1).map(h=>p.data && p.data[h] != null ? String(p.data[h]) : '')];
      sheet.appendRow(row);
      return json({ok:true});
    }
    if (p.action === 'update') {
      const rowNo = Number(p.rowId);
      if (rowNo < 2 || rowNo > sheet.getLastRow()) return json({ok:false,error:'Entry not found.'});
      const headers=sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
      sheet.getRange(rowNo,1,1,headers.length).setValues([[new Date(), ...headers.slice(1).map(h=>p.data && p.data[h] != null ? String(p.data[h]) : '')]]);
      return json({ok:true});
    }
    if (p.action === 'delete') {
      const rowNo=Number(p.rowId);
      if (rowNo < 2 || rowNo > sheet.getLastRow()) return json({ok:false,error:'Entry not found.'});
      sheet.deleteRow(rowNo);
      return json({ok:true});
    }
    return json({ok:false,error:'Unknown action'});
  } catch(err) { return json({ok:false,error:String(err)}); }
}

function json(x){return ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON);}
function respond(x, callback){
  const text = JSON.stringify(x);
  if (callback) return ContentService.createTextOutput(callback+'('+text+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);
}
