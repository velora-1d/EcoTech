"use client";

import { downloadExcel, downloadWord, triggerPrint } from "@/lib/export";

type KPIProps = {
  totalPointsCirculating: number;
  averagePointsPerUser: number;
  disposalSuccessRate: number;
  redemptionRate: number;
  complaintResolvedRate: number;
  topProvince?: string;
  topRegency?: string;
  topDistrict?: string;
};

type TrashSummaryProps = {
  categoryKey: string;
  count: number;
  totalPoints: number;
}[];

type RewardSummaryProps = {
  title: string;
  provider: string;
  redemptionCount: number;
  stock: number;
}[];

type UserSummaryProps = {
  name: string;
  email: string;
  points: number;
}[];

export default function ExportButtons({
  kpis,
  trashSummary,
  rewardSummary,
  userSummary
}: {
  kpis: KPIProps;
  trashSummary: TrashSummaryProps;
  rewardSummary: RewardSummaryProps;
  userSummary: UserSummaryProps;
}) {
  
  // Hasilkan template HTML untuk Excel
  function generateExcelContent() {
    return `
      <table>
        <tr><td colspan="3" class="title">LAPORAN EKSEKUTIF ECO TECH</td></tr>
        <tr><td colspan="3" class="subtitle">Tanggal Ekspor: ${new Date().toLocaleDateString("id-ID")}</td></tr>
        <tr><td></td></tr>
        
        <!-- KPI METRICS -->
        <tr><th colspan="3">METRIK KINERJA UTAMA (KPI)</th></tr>
        <tr class="bg-gray"><td>Total Saldo Poin Pengguna</td><td class="text-right font-bold">${kpis.totalPointsCirculating}</td><td>pts</td></tr>
        <tr><td>Rata-rata Poin per Pengguna</td><td class="text-right font-bold">${kpis.averagePointsPerUser}</td><td>pts</td></tr>
        <tr class="bg-gray"><td>Rasio Persetujuan Setoran Sampah</td><td class="text-right font-bold">${kpis.disposalSuccessRate}</td><td>%</td></tr>
        <tr><td>Persentase Penukaran Poin (Redemption)</td><td class="text-right font-bold">${kpis.redemptionRate}</td><td>%</td></tr>
        <tr class="bg-gray"><td>Tingkat Penyelesaian Pengaduan</td><td class="text-right font-bold">${kpis.complaintResolvedRate}</td><td>%</td></tr>
        <tr><td></td></tr>
        
        <!-- KPI REGIONAL -->
        <tr><th colspan="3">WILAYAH KONTRIBUSI TERAKTIF</th></tr>
        <tr class="bg-gray"><td>Provinsi Teraktif</td><td colspan="2" class="font-bold">${kpis.topProvince || "Tidak Ada"}</td></tr>
        <tr><td>Kabupaten/Kota Teraktif</td><td colspan="2" class="font-bold">${kpis.topRegency || "Tidak Ada"}</td></tr>
        <tr class="bg-gray"><td>Kecamatan Teraktif</td><td colspan="2" class="font-bold">${kpis.topDistrict || "Tidak Ada"}</td></tr>
        <tr><td></td></tr>

        <!-- REKAPITULASI SAMPAH -->
        <tr><th colspan="3">REKAPITULASI SAMPAH TERKUMPUL</th></tr>
        <tr class="bg-gray"><td class="font-bold">Kategori Sampah</td><td class="text-right font-bold">Kuantitas Disetor</td><td class="text-right font-bold">Total Poin Dihasilkan</td></tr>
        ${trashSummary.map(t => `
          <tr>
            <td style="text-transform: capitalize;">${t.categoryKey}</td>
            <td class="text-right">${t.count} unit</td>
            <td class="text-right">${t.totalPoints} pts</td>
          </tr>
        `).join("")}
        <tr><td></td></tr>

        <!-- VOUCHER POPULER -->
        <tr><th colspan="3">REWARDS / VOUCHER HADIAH TERPOPULER</th></tr>
        <tr class="bg-gray"><td class="font-bold">Nama Reward / Provider</td><td class="text-right font-bold">Jumlah Ditukarkan</td><td class="text-right font-bold">Sisa Stok</td></tr>
        ${rewardSummary.map(r => `
          <tr>
            <td>${r.title} (${r.provider})</td>
            <td class="text-right">${r.redemptionCount}x</td>
            <td class="text-right">${r.stock} unit</td>
          </tr>
        `).join("")}
        <tr><td></td></tr>

        <!-- TOP KONTRIBUTOR -->
        <tr><th colspan="3">KONTRIBUTOR PENGGUNA TERATAS</th></tr>
        <tr class="bg-gray"><td class="font-bold">Nama Pengguna</td><td class="font-bold">Email</td><td class="text-right font-bold">Total Saldo Poin</td></tr>
        ${userSummary.map(u => `
          <tr>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td class="text-right">${u.points} pts</td>
          </tr>
        `).join("")}
      </table>
    `;
  }

  // Hasilkan template HTML untuk Word
  function generateWordContent() {
    return `
      <h1>LAPORAN KINERJA EKSEKUTIF - ECO TECH</h1>
      <p>Tanggal Laporan: <strong>${new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
      <p>Laporan ini menyajikan ringkasan indikator kinerja utama (KPI), rekapitulasi setoran sampah, popularitas penukaran hadiah, dan pengguna teraktif.</p>
      
      <h2>1. INDIKATOR KINERJA UTAMA (KPI) & ANALISIS WILAYAH</h2>
      <div class="kpi-container">
        <div class="kpi-card">
          <div class="kpi-title">Total Saldo Poin Aktif Pengguna</div>
          <div class="kpi-value">${kpis.totalPointsCirculating} pts</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Rata-rata Poin per Pengguna</div>
          <div class="kpi-value">${kpis.averagePointsPerUser} pts</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Rasio Persetujuan Setoran Sampah</div>
          <div class="kpi-value">${kpis.disposalSuccessRate}%</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Rasio Penukaran Poin (Redemption Rate)</div>
          <div class="kpi-value">${kpis.redemptionRate}%</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Penyelesaian Pengaduan Sungai & Sampah</div>
          <div class="kpi-value">${kpis.complaintResolvedRate}%</div>
        </div>
        <div class="kpi-card" style="border-left: 4px solid #10b981;">
          <div class="kpi-title">Provinsi Teraktif</div>
          <div class="kpi-value">${kpis.topProvince || "Tidak Ada"}</div>
        </div>
        <div class="kpi-card" style="border-left: 4px solid #3b82f6;">
          <div class="kpi-title">Kabupaten/Kota Teraktif</div>
          <div class="kpi-value">${kpis.topRegency || "Tidak Ada"}</div>
        </div>
        <div class="kpi-card" style="border-left: 4px solid #f59e0b;">
          <div class="kpi-title">Kecamatan Teraktif</div>
          <div class="kpi-value">${kpis.topDistrict || "Tidak Ada"}</div>
        </div>
      </div>

      <h2>2. REKAPITULASI VOLUME SAMPAH TERKUMPUL</h2>
      <table>
        <thead>
          <tr>
            <th>Kategori Sampah</th>
            <th class="text-right">Jumlah Setoran</th>
            <th class="text-right">Total Poin yang Diberikan</th>
          </tr>
        </thead>
        <tbody>
          ${trashSummary.map(t => `
            <tr>
              <td style="text-transform: capitalize; font-weight: bold;">${t.categoryKey}</td>
              <td class="text-right">${t.count} unit</td>
              <td class="text-right" style="color: #10b981;">+${t.totalPoints} pts</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <h2>3. DATA REWARDS & VOUCHER POPULER</h2>
      <table>
        <thead>
          <tr>
            <th>Judul Voucher (Merchant)</th>
            <th class="text-right">Frekuensi Penukaran</th>
            <th class="text-right">Stok Gudang Tersisa</th>
          </tr>
        </thead>
        <tbody>
          ${rewardSummary.map(r => `
            <tr>
              <td><strong>${r.title}</strong> (${r.provider})</td>
              <td class="text-right">${r.redemptionCount} kali</td>
              <td class="text-right">${r.stock} unit</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <h2>4. KONTRIBUTOR TERAKTIF</h2>
      <table>
        <thead>
          <tr>
            <th>Nama Pengguna</th>
            <th>Email</th>
            <th class="text-right">Saldo Poin Saat Ini</th>
          </tr>
        </thead>
        <tbody>
          ${userSummary.map(u => `
            <tr>
              <td><strong>${u.name}</strong></td>
              <td>${u.email}</td>
              <td class="text-right" style="font-weight: bold; color: #10b981;">${u.points} pts</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }

  return (
    <div className="flex flex-wrap gap-3 mt-6 print:hidden">
      <button
        onClick={() => downloadExcel(generateExcelContent(), "Laporan_EcoTech.xls")}
        className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/10 transition active:scale-95"
      >
        🟢 Ekspor ke Excel (.XLS)
      </button>
      
      <button
        onClick={() => downloadWord(generateWordContent(), "Laporan_EcoTech.doc")}
        className="rounded-2xl bg-blue-600 hover:bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/10 transition active:scale-95"
      >
        🔵 Ekspor ke Word (.DOC)
      </button>

      <button
        onClick={triggerPrint}
        className="rounded-2xl bg-slate-800 hover:bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-md shadow-slate-900/10 transition active:scale-95"
      >
        🖨️ Cetak / Simpan PDF
      </button>
    </div>
  );
}
