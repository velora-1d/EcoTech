/**
 * Helper Ekspor Dokumen Sisi Klien (Client-Side Document Export Helper)
 * Tanpa dependensi eksternal (mengikuti Ponytail Rules).
 */

export function downloadExcel(htmlTableContent: string, filename: string = "laporan.xls") {
  if (typeof window === "undefined") return;

  const template = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Laporan Eco Tech</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        table { border-collapse: collapse; width: 100%; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        th { background-color: #10b981; color: white; font-weight: bold; padding: 10px; border: 1px solid #e2e8f0; text-align: left; }
        td { padding: 8px; border: 1px solid #e2e8f0; color: #334155; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .bg-gray { background-color: #f8fafc; }
        .title { font-size: 18px; font-weight: bold; color: #0f172a; margin-bottom: 5px; }
        .subtitle { font-size: 12px; color: #64748b; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      ${htmlTableContent}
    </body>
    </html>
  `;

  const blob = new Blob([template], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadWord(htmlContent: string, filename: string = "laporan.doc") {
  if (typeof window === "undefined") return;

  const template = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8" />
      <title>Laporan Eco Tech</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Georgia', serif; line-height: 1.6; color: #1e293b; padding: 20px; }
        h1 { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #10b981; padding-bottom: 5px; }
        h2 { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: bold; color: #1e293b; margin-top: 20px; }
        p { margin-bottom: 10px; font-size: 14px; }
        table { border-collapse: collapse; width: 100%; margin-top: 15px; margin-bottom: 15px; }
        th { background-color: #f1f5f9; color: #0f172a; font-weight: bold; padding: 8px; border: 1px solid #cbd5e1; text-align: left; }
        td { padding: 8px; border: 1px solid #cbd5e1; font-size: 13px; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .bg-light { background-color: #f8fafc; }
        .kpi-container { margin-bottom: 20px; }
        .kpi-card { border: 1px solid #e2e8f0; padding: 10px; margin-bottom: 5px; background-color: #f8fafc; }
        .kpi-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
        .kpi-value { font-size: 18px; font-weight: bold; color: #10b981; }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  const blob = new Blob([template], { type: "application/msword;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function triggerPrint() {
  if (typeof window !== "undefined") {
    window.print();
  }
}
