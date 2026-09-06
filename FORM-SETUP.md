# DataInsightPro Custom Forms — Google Sheets Setup

1. Create/open the Google Sheet that should receive form entries.
2. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/SHEET_ID/edit`.
3. Open Google Apps Script and create a project.
4. Paste the contents of `google-apps-script.gs` into the project.
5. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with your Sheet ID.
6. Deploy → New deployment → Web app.
7. Execute as: **Me**. Who has access: **Anyone**.
8. Copy the `/exec` Web App URL.
9. Open DataInsightPro → **Form Builder**.
10. Add/remove fields, choose required fields, enter the Google Sheet URL/ID and paste the Apps Script Web App URL.
11. Click **Save & Generate Link**. Share the generated `form.html?...` link with any PC.
12. Everyone using that link submits into the same Google Sheet. Use **Entries** to refresh, edit mistakes, delete incorrect rows, and export CSV, Excel, PDF or Word.

### Important
A normal Google Sheet URL is not itself a public form API. The Apps Script Web App is the secure bridge that receives form submissions and writes rows into the selected spreadsheet.

For a different form, the script automatically creates a sheet tab using that form's unique ID. Keep the spreadsheet accessible to the Apps Script owner.
