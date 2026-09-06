const SHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';

function doGet(e) {
  const p = e.parameter || {};
  if (p.action !== 'list') return json({ok:true,service:'DataInsightPro Forms'});
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(p.formId) || SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return json([]);
  const headers = values[0].map(String);
  return json(values.slice(1).filter(r=>r.some(v=>String(v).trim())).map((r,i)=>{
    const o={rowId:i+2,timestamp:r[0],data:{}};
    headers.slice(1).forEach((h,j)=>o.data[h]=r[j+1] ?? '');
    return o;
  }));
}

function doPost(e) {
  try {
    const p = JSON.parse(e.postData.contents || '{}');
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(p.formId);
    if (!sheet) { sheet=ss.insertSheet(p.formId); sheet.appendRow(['Submitted At', ...(p.fields||[])]); }
    if (p.action === 'create') {
      const headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
      const row = [new Date(), ...headers.slice(1).map(h=>p.data?.[h] ?? '')];
      sheet.appendRow(row);
      return json({ok:true});
    }
    if (p.action === 'update') {
      const headers=sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
      sheet.getRange(Number(p.rowId),1,1,headers.length).setValues([[new Date(),...headers.slice(1).map(h=>p.data?.[h] ?? '')]]);
      return json({ok:true});
    }
    if (p.action === 'delete') { sheet.deleteRow(Number(p.rowId)); return json({ok:true}); }
    return json({ok:false,error:'Unknown action'});
  } catch(err) { return json({ok:false,error:String(err)}); }
}
function json(x){return ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON);}
