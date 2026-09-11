# DataInsightPro

**DataInsightPro** is a browser-first analytics and business-intelligence toolkit for turning spreadsheets and business data into dashboards, charts, executive reports, calculations and reusable data-entry workflows.

## Live site

- Home: https://aaliofficialy.github.io/DataInsightPro/
- Data Analyzer: https://aaliofficialy.github.io/DataInsightPro/data-analysis.html
- Executive Dashboard: https://aaliofficialy.github.io/DataInsightPro/dashboard.html
- Form Builder: https://aaliofficialy.github.io/DataInsightPro/form-builder.html
- Entries: https://aaliofficialy.github.io/DataInsightPro/entries-v4.html
- Business Calculator: https://aaliofficialy.github.io/DataInsightPro/calculator.html
- Tools Hub: https://aaliofficialy.github.io/DataInsightPro/tools.html

## Core capabilities

### Executive Dashboard
- Excel, CSV, JSON, PDF, DOCX and image intake
- Automatic row/column profiling and numeric-field detection
- Date/time detection
- Global filtering
- Data-quality scoring
- Outlier/anomaly detection using IQR-based analysis
- Executive summary, findings, risks, opportunities and recommendations
- Multiple management charts
- Chart image export
- Executive report export workflow
- Local browser processing for uploaded data

### Data Analyzer
- Spreadsheet and CSV analysis
- Automatic dataset profiling
- Charts and management-focused insights
- Browser-side processing

### Business Calculator Suite
Includes percentage, profit/margin, discount, tax/VAT, ROI, CAGR, break-even, comparison, percentage change, commission, salary increase, loan payment and compound-interest calculators.

> Calculators are general-purpose planning tools. Tax and currency figures are not live rates unless explicitly connected to a current data source.

### Form Builder
- Create custom data-entry forms
- Text, email, number, date, long-text, dropdown and checkbox fields
- Required-field validation
- Live preview
- Shareable form links
- Local browser entry storage
- Optional Google Apps Script / Google Sheets integration
- View, edit and delete entries
- CSV, Excel, PDF and Word exports

Local mode does not require a server or database. Shared multi-device entry storage requires the optional Google Apps Script setup.

## Privacy model

The analytics and calculator workflows are designed to process data in the browser. Files selected for analysis are not uploaded by DataInsightPro's static GitHub Pages frontend. Users should still avoid entering confidential information into any third-party service they intentionally connect, such as Google Sheets or an external Apps Script endpoint.

## GitHub Pages deployment

The repository is configured for GitHub Pages deployment from the `main` branch using the workflow in `.github/workflows/pages.yml`.

Repository: https://github.com/aaliofficialy/DataInsightPro

Expected site URL:
https://aaliofficialy.github.io/DataInsightPro/

## Optional Google Sheets setup

The form builder works without Google Sheets. For shared entries across different devices:

1. Create a Google Sheet.
2. Deploy the supplied `google-apps-script.gs` as a Google Apps Script Web App.
3. Use the deployed `/exec` URL in the Form Builder.
4. Submit a test entry and use **Test Google Sheet**.

The local browser mode remains available if the shared backend is not configured.

## Technology

Static HTML/CSS/JavaScript, GitHub Pages, SheetJS, Chart.js, jsPDF, JSZip, Mammoth, Tesseract.js and PDF.js where required by the individual tools.
