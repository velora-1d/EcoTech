import { redirect } from "next/navigation";
import { count, desc, eq, ne, and, sum, gte, lte } from "drizzle-orm";
import { db } from "@/db";
import { disposals, rewards, users, redemptions, trashGuides, complaints } from "@/db/schema";
import { getSession } from "@/lib/session";
import Link from "next/link";
import ExportButtons from "./export-buttons";
import AdminSidebar from "@/components/admin-sidebar";
import {
  LeafIcon,
  TrashIcon,
  MegaphoneIcon,
  TicketIcon,
  ChartIcon,
  UserIcon,
  TrophyIcon,
  SettingsIcon,
  GiftIcon,
  BookOpenIcon
} from "@/components/icons";
import {
  approveDisposal,
  rejectDisposal,
  completeRedemption,
  addReward,
  updateReward,
  deleteReward,
  addGuide,
  updateGuide,
  deleteGuide,
  updateUserPoints,
  toggleUserBlock,
  ensureInitialSeeds,
  updateComplaintStatus,
  deleteComplaint,
  logout,
  loginAsDemoUser,
  getRegionalLeaderboard
} from "@/app/actions";

type SearchParams = Promise<{
  tab?: string;
  search?: string;
  editId?: string;
  status?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}>;

export default async function AdminPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  // Pastikan seed data terisi
  await ensureInitialSeeds();

  const params = await searchParams;
  const currentTab = params.tab || "stats";
  const searchQuery = params.search || "";
  const editId = params.editId || "";
  const filterStatus = params.status || "";
  const filterCategory = params.category || "";
  const startDateStr = params.startDate || "";
  const endDateStr = params.endDate || "";

  if (!db) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="rounded-3xl bg-white p-8 text-center shadow-xl max-w-sm">
          <div className="text-4xl mb-3 text-amber-500 font-bold">!</div>
          <h1 className="text-xl font-bold text-slate-800">Database Belum Tersambung</h1>
          <p className="text-sm text-slate-500 mt-2">Pastikan DATABASE_URL di berkas .env Anda terisi dengan benar.</p>
        </div>
      </div>
    );
  }

  // Helper filter tanggal
  const startFilterDate = startDateStr ? new Date(startDateStr) : null;
  const endFilterDate = endDateStr ? new Date(endDateStr) : null;
  if (endFilterDate) {
    endFilterDate.setHours(23, 59, 59, 999); // Akhir hari
  }

  // ----------------------------------------------------------
  // FETCH DATA SESUAI TAB (SERVER-SIDE FETCHING & FILTERING)
  // ----------------------------------------------------------
  let statsData = null;
  let pendingDisposals: any[] = [];
  let redemptionList: any[] = [];
  let rewardList: any[] = [];
  let editedReward: any = null;
  let guideList: any[] = [];
  let editedGuide: any = null;
  let leaderboard: any[] = [];
  let userList: any[] = [];
  let complaintList: any[] = [];
  let reportData: any = null;

  if (currentTab === "stats") {
    const [[userRow], [dispRow], [rewRow], [redRow], [ptRow], [pendingDisp], [pendingRed]] = await Promise.all([
      db.select({ count: count() }).from(users).where(ne(users.role, "admin")),
      db.select({ count: count() }).from(disposals),
      db.select({ count: count() }).from(rewards),
      db.select({ count: count() }).from(redemptions),
      db.select({ total: sum(disposals.pointsEarned) }).from(disposals).where(eq(disposals.status, "approved")),
      db.select({ count: count() }).from(disposals).where(eq(disposals.status, "pending")),
      db.select({ count: count() }).from(redemptions).where(eq(redemptions.status, "pending"))
    ]);

    const categoryStats = await db
      .select({ categoryKey: disposals.categoryKey, count: count() })
      .from(disposals)
      .groupBy(disposals.categoryKey);

    statsData = {
      userCount: userRow.count,
      disposalCount: dispRow.count,
      rewardCount: rewRow.count,
      redemptionCount: redRow.count,
      totalPointsApproved: Number(ptRow.total ?? 0),
      pendingDispCount: pendingDisp.count,
      pendingRedCount: pendingRed.count,
      categoryStats,
      totalStatsCount: categoryStats.reduce((s, c) => s + c.count, 0) || 1
    };
  } else if (currentTab === "disposals") {
    let list = await db
      .select({
        id: disposals.id,
        categoryKey: disposals.categoryKey,
        itemCount: disposals.itemCount,
        pointsEarned: disposals.pointsEarned,
        status: disposals.status,
        createdAt: disposals.createdAt,
        userName: users.name,
        userEmail: users.email
      })
      .from(disposals)
      .innerJoin(users, eq(disposals.userId, users.id))
      .orderBy(desc(disposals.createdAt));

    // Filter status
    if (filterStatus) {
      list = list.filter((d) => d.status === filterStatus);
    }
    // Filter kategori
    if (filterCategory) {
      list = list.filter((d) => d.categoryKey === filterCategory);
    }
    // Filter tanggal
    if (startFilterDate) {
      list = list.filter((d) => new Date(d.createdAt) >= startFilterDate);
    }
    if (endFilterDate) {
      list = list.filter((d) => new Date(d.createdAt) <= endFilterDate);
    }
    // Filter pencarian
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (d) =>
          d.userName.toLowerCase().includes(q) ||
          d.userEmail.toLowerCase().includes(q) ||
          d.categoryKey.toLowerCase().includes(q)
      );
    }

    pendingDisposals = list;
  } else if (currentTab === "redemptions") {
    let query = db
      .select({
        id: redemptions.id,
        code: redemptions.code,
        pointsSpent: redemptions.pointsSpent,
        status: redemptions.status,
        createdAt: redemptions.createdAt,
        userName: users.name,
        userEmail: users.email,
        rewardId: redemptions.rewardId,
        rewardTitle: rewards.title,
        rewardProvider: rewards.provider
      })
      .from(redemptions)
      .innerJoin(users, eq(redemptions.userId, users.id))
      .innerJoin(rewards, eq(redemptions.rewardId, rewards.id));

    let list = await query.orderBy(desc(redemptions.createdAt));

    // Filter status
    if (filterStatus) {
      list = list.filter((r) => r.status === filterStatus);
    }
    // Filter tanggal
    if (startFilterDate) {
      list = list.filter((r) => new Date(r.createdAt) >= startFilterDate);
    }
    if (endFilterDate) {
      list = list.filter((r) => new Date(r.createdAt) <= endFilterDate);
    }
    // Filter pencarian
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.code.toLowerCase().includes(q) ||
          r.userEmail.toLowerCase().includes(q) ||
          r.userName.toLowerCase().includes(q) ||
          r.rewardTitle.toLowerCase().includes(q)
      );
    }
    redemptionList = list;
  } else if (currentTab === "rewards") {
    let list = await db.select().from(rewards).orderBy(rewards.cost);
    if (filterCategory) {
      list = list.filter((r) => r.category === filterCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.provider.toLowerCase().includes(q));
    }
    rewardList = list;
    if (editId) {
      editedReward = rewardList.find((r) => r.id === editId) || null;
    }
  } else if (currentTab === "guides") {
    let list = await db.select().from(trashGuides);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((g) => g.title.toLowerCase().includes(q) || g.categoryKey.toLowerCase().includes(q));
    }
    guideList = list;
    if (editId) {
      editedGuide = guideList.find((g) => g.id === editId) || null;
    }
  } else if (currentTab === "leaderboard") {
    let list = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        points: users.points,
        isBlocked: users.isBlocked,
        createdAt: users.createdAt
      })
      .from(users)
      .where(ne(users.role, "admin"))
      .orderBy(desc(users.points));

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    leaderboard = list;
  } else if (currentTab === "users") {
    let list = await db
      .select()
      .from(users)
      .where(ne(users.role, "admin"))
      .orderBy(desc(users.createdAt));

    if (filterStatus) {
      const blocked = filterStatus === "blocked";
      list = list.filter((u) => u.isBlocked === blocked);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    userList = list;
  } else if (currentTab === "complaints") {
    let list = await db
      .select({
        id: complaints.id,
        title: complaints.title,
        description: complaints.description,
        location: complaints.location,
        image: complaints.image,
        status: complaints.status,
        adminNotes: complaints.adminNotes,
        createdAt: complaints.createdAt,
        userName: users.name,
        userEmail: users.email
      })
      .from(complaints)
      .innerJoin(users, eq(complaints.userId, users.id))
      .orderBy(desc(complaints.createdAt));

    // Filter status
    if (filterStatus) {
      list = list.filter((c) => c.status === filterStatus);
    }
    // Filter tanggal
    if (startFilterDate) {
      list = list.filter((c) => new Date(c.createdAt) >= startFilterDate);
    }
    if (endFilterDate) {
      list = list.filter((c) => new Date(c.createdAt) <= endFilterDate);
    }
    // Filter pencarian
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.userName.toLowerCase().includes(q) ||
          c.userEmail.toLowerCase().includes(q)
      );
    }
    complaintList = list;
  } else if (currentTab === "reports") {
    // AMBIL DATA AGREGAT UNTUK LAPORAN EKSEKUTIF (KPI LENGKAP)
    const [allUsers, allDisposals, allRedemptions, allRewards, allComplaints] = await Promise.all([
      db.select({ id: users.id, points: users.points, role: users.role, name: users.name, email: users.email }).from(users),
      db.select().from(disposals),
      db.select().from(redemptions),
      db.select().from(rewards),
      db.select().from(complaints)
    ]);

    // 1. Hitung total poin circulating
    const activeUsers = allUsers.filter(u => u.role !== "admin");
    const totalPointsCirculating = activeUsers.reduce((s, u) => s + u.points, 0);

    // 2. Rata-rata poin per user
    const averagePointsPerUser = activeUsers.length > 0 ? Math.round(totalPointsCirculating / activeUsers.length) : 0;

    // 3. Rasio setoran sukses
    const totalDispCount = allDisposals.length;
    const approvedDispCount = allDisposals.filter(d => d.status === "approved").length;
    const disposalSuccessRate = totalDispCount > 0 ? Math.round((approvedDispCount / totalDispCount) * 100) : 0;

    // 4. Rasio klaim (redemption rate)
    const totalPointsApproved = allDisposals.filter(d => d.status === "approved").reduce((s, d) => s + d.pointsEarned, 0);
    const totalPointsSpent = allRedemptions.reduce((s, r) => s + r.pointsSpent, 0);
    const redemptionRate = totalPointsApproved > 0 ? Math.round((totalPointsSpent / totalPointsApproved) * 100) : 0;

    // 5. Rasio pengaduan diselesaikan
    const totalCompCount = allComplaints.length;
    const resolvedCompCount = allComplaints.filter(c => c.status === "resolved").length;
    const complaintResolvedRate = totalCompCount > 0 ? Math.round((resolvedCompCount / totalCompCount) * 100) : 0;

    // 6. Rekapitulasi sampah terkumpul per kategori
    const trashSummaryMap: Record<string, { count: number; totalPoints: number }> = {};
    allDisposals.forEach(d => {
      if (!trashSummaryMap[d.categoryKey]) {
        trashSummaryMap[d.categoryKey] = { count: 0, totalPoints: 0 };
      }
      trashSummaryMap[d.categoryKey].count += d.itemCount;
      if (d.status === "approved") {
        trashSummaryMap[d.categoryKey].totalPoints += d.pointsEarned;
      }
    });
    const trashSummary = Object.entries(trashSummaryMap).map(([key, val]) => ({
      categoryKey: key,
      count: val.count,
      totalPoints: val.totalPoints
    }));

    // 7. Rekapitulasi reward voucher terpopuler
    const rewardSummary = allRewards.map(r => {
      const redCount = allRedemptions.filter(red => red.rewardId === r.id).length;
      return {
        title: r.title,
        provider: r.provider,
        redemptionCount: redCount,
        stock: r.stock
      };
    }).sort((a, b) => b.redemptionCount - a.redemptionCount).slice(0, 5);

    // 8. Kontributor pengguna teratas
    const userSummary = activeUsers
      .sort((a, b) => b.points - a.points)
      .slice(0, 5)
      .map(u => ({
        name: u.name,
        email: u.email,
        points: u.points
      }));

    const provinceLeaderboard = await getRegionalLeaderboard("province");
    const regencyLeaderboard = await getRegionalLeaderboard("regency");
    const districtLeaderboard = await getRegionalLeaderboard("district");
    
    const topProvince = provinceLeaderboard[0]?.regionName || "Tidak Ada";
    const topRegency = regencyLeaderboard[0]?.regionName || "Tidak Ada";
    const topDistrict = districtLeaderboard[0]?.regionName || "Tidak Ada";

    reportData = {
      kpis: {
        totalPointsCirculating,
        averagePointsPerUser,
        disposalSuccessRate,
        redemptionRate,
        complaintResolvedRate,
        topProvince,
        topRegency,
        topDistrict
      },
      trashSummary,
      rewardSummary,
      userSummary
    };
  }

  // Sidebar Menu Admin
  const menuItems = [
    { label: "Ringkasan & Analitik", tab: "stats", icon: ChartIcon },
    { label: "Verifikasi Setoran", tab: "disposals", icon: TrashIcon },
    { label: "Pengaduan Lingkungan", tab: "complaints", icon: MegaphoneIcon },
    { label: "Klaim Voucher Hadiah", tab: "redemptions", icon: TicketIcon },
    { label: "Laporan Eksekutif", tab: "reports", icon: ChartIcon },
    { label: "Kelola Hadiah", tab: "rewards", icon: GiftIcon },
    { label: "Kelola Panduan & Poin", tab: "guides", icon: SettingsIcon },
    { label: "Papan Peringkat Admin", tab: "leaderboard", icon: TrophyIcon },
    { label: "Kelola Pengguna", tab: "users", icon: UserIcon },
    { label: "Dokumentasi Fitur", tab: "docs", icon: BookOpenIcon }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* CSS Cetak PDF Khusus (Hanya bekerja saat window.print) */}
      <style>{`
        @media print {
          body { background-color: white !important; color: black !important; }
          .print\\:hidden { display: none !important; }
          .print\\:w-full { width: 100% !important; max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
          .print\\:shadow-none { shadow: none !important; border: none !important; box-shadow: none !important; }
          .print\\:border-none { border: none !important; }
          .print\\:p-0 { padding: 0 !important; }
        }
      `}</style>

      {/* Sidebar Admin Responsif (Ikon SVG Murni, Tanpa Emoji) */}
      <AdminSidebar session={session} currentTab={currentTab} onLogout={logout} onSimulateUser={loginAsDemoUser} />

      {/* Konten Kanan */}
      <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 md:ml-64 overflow-y-auto max-w-7xl print:w-full print:p-0">
        
        {/* TAB 1: RINGKASAN & ANALITIK */}
        {currentTab === "stats" && statsData && (
          <div className="space-y-8 print:hidden">
            <h1 className="font-display text-3xl font-black text-slate-800">Ringkasan & Analitik</h1>

            {/* Grid Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { label: "Pengguna Aktif", value: statsData.userCount, icon: UserIcon, color: "text-blue-600 bg-blue-50" },
                { label: "Total Setoran", value: statsData.disposalCount, icon: TrashIcon, color: "text-emerald-600 bg-emerald-50" },
                { label: "Poin Disetujui", value: statsData.totalPointsApproved, icon: LeafIcon, color: "text-leaf-700 bg-leaf-50" },
                { label: "Katalog Hadiah", value: statsData.rewardCount, icon: GiftIcon, color: "text-amber-600 bg-amber-50" },
                { label: "Kupon Ditukarkan", value: statsData.redemptionCount, icon: TicketIcon, color: "text-rose-600 bg-rose-50" }
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.color}`}>
                      <Icon size={20} />
                    </div>
                    <div className="mt-4 text-3xl font-black text-slate-800">{card.value}</div>
                    <div className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Grafik Komposisi Sampah */}
            <div className="grid gap-6 md:grid-cols-2 mt-8">
              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
                <h2 className="font-display text-lg font-black text-slate-800">Komposisi Jenis Sampah Terkumpul</h2>
                <p className="text-xs text-slate-400 mt-1">Proporsi setoran berdasarkan kategori sampah.</p>
                
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-6 justify-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                      {(() => {
                        let accumulatedPercent = 0;
                        const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
                        return statsData.categoryStats.map((stat, i) => {
                          const percent = (stat.count / statsData.totalStatsCount) * 100;
                          const strokeDasharray = `${percent} ${100 - percent}`;
                          const strokeDashoffset = 100 - accumulatedPercent;
                          accumulatedPercent += percent;
                          return (
                            <circle
                              key={stat.categoryKey}
                              cx="18"
                              cy="18"
                              r="15.915"
                              fill="none"
                              stroke={colors[i % colors.length]}
                              strokeWidth="3.2"
                              strokeDasharray={strokeDasharray}
                              strokeDashoffset={strokeDashoffset}
                            />
                          );
                        });
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-black text-slate-800">{statsData.disposalCount}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Setoran</span>
                    </div>
                  </div>

                  <div className="space-y-2 shrink-0">
                    {(() => {
                      const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
                      return statsData.categoryStats.map((stat, i) => {
                        const pct = Math.round((stat.count / statsData.totalStatsCount) * 100);
                        return (
                          <div key={stat.categoryKey} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                            <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                            <span className="capitalize">{stat.categoryKey}:</span>
                            <span className="font-bold text-slate-800">{stat.count} ({pct}%)</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8 flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-lg font-black text-slate-800">Catatan Operasional</h2>
                  <p className="text-xs text-slate-400 mt-1">Status verifikasi tertunda saat ini.</p>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between rounded-2xl bg-amber-50 p-4 border border-amber-100">
                      <div>
                        <div className="text-sm font-bold text-amber-800">Setoran Sampah Pending</div>
                        <div className="text-xs text-amber-600 mt-0.5">Memerlukan verifikasi fisik Anda.</div>
                      </div>
                      <span className="text-2xl font-black text-amber-800">{statsData.pendingDispCount}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-indigo-50 p-4 border border-indigo-100">
                      <div>
                        <div className="text-sm font-bold text-indigo-800">Klaim Kupon Pending</div>
                        <div className="text-xs text-indigo-600 mt-0.5">Voucher belum ditukarkan fisik.</div>
                      </div>
                      <span className="text-2xl font-black text-indigo-800">{statsData.pendingRedCount}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-400 border-t border-slate-100 pt-4 text-center">
                  Eco Tech System v1.2 • Real-time Sync
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VERIFIKASI SETORAN (DENGAN FILTER) */}
        {currentTab === "disposals" && (
          <div className="space-y-6 print:hidden">
            <h1 className="font-display text-3xl font-black text-slate-800">Verifikasi Setoran Sampah</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola dan filter data pengajuan setoran sampah pengguna.</p>

            {/* Form Filter */}
            <form action="" method="get" className="flex flex-wrap gap-3 items-end bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
              <input type="hidden" name="tab" value="disposals" />
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Cari Pengguna</label>
                <input
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Nama, email, atau kategori..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="w-36">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Status</label>
                <select
                  name="status"
                  defaultValue={filterStatus}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="">Semua</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Disetujui</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>
              <div className="w-36">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Kategori</label>
                <select
                  name="category"
                  defaultValue={filterCategory}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none capitalize"
                >
                  <option value="">Semua</option>
                  <option value="plastic">Plastic</option>
                  <option value="paper">Paper</option>
                  <option value="metal">Metal</option>
                  <option value="organic">Organic</option>
                  <option value="glass">Glass</option>
                  <option value="fabric">Fabric</option>
                </select>
              </div>
              <div className="w-40">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Mulai Tanggal</label>
                <input
                  name="startDate"
                  type="date"
                  defaultValue={startDateStr}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="w-40">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Hingga Tanggal</label>
                <input
                  name="endDate"
                  type="date"
                  defaultValue={endDateStr}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="rounded-xl bg-leaf-700 text-white font-bold px-4 py-2 text-xs hover:bg-leaf-950">
                  Filter
                </button>
                <Link href="/admin?tab=disposals" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  Reset
                </Link>
              </div>
            </form>

            <div className="rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Pengguna</th>
                      <th className="px-6 py-4">Kategori Sampah</th>
                      <th className="px-6 py-4">Jumlah Item</th>
                      <th className="px-6 py-4">Poin</th>
                      <th className="px-6 py-4">Tanggal & Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {pendingDisposals.map((d: any) => (
                      <tr key={d.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{d.userName}</div>
                          <div className="text-xs text-slate-400">{d.userEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block rounded-full bg-leaf-100 px-2.5 py-0.5 text-xs font-bold text-leaf-700 capitalize">
                            {d.categoryKey}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-700">{d.itemCount} unit</td>
                        <td className="px-6 py-4 font-black text-leaf-700">+{d.pointsEarned} pts</td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-slate-500">
                            {new Date(d.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <div className="mt-1">
                            {d.status === "pending" && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Pending</span>}
                            {d.status === "approved" && <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Disetujui</span>}
                            {d.status === "rejected" && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">Ditolak</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {d.status === "pending" && (
                            <>
                              <form action={approveDisposal.bind(null, d.id)} className="inline">
                                <button type="submit" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                                  Setujui
                                </button>
                              </form>
                              <form action={rejectDisposal.bind(null, d.id)} className="inline">
                                <button type="submit" className="rounded-xl bg-rose-600 hover:bg-rose-700 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                                  Tolak
                                </button>
                              </form>
                            </>
                          )}
                          {d.status !== "pending" && (
                            <span className="text-xs font-semibold text-slate-400">Telah Diverifikasi</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {pendingDisposals.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-medium">
                          Tidak ada data setoran yang cocok dengan filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PENGADUAN LINGKUNGAN (DENGAN FILTER) */}
        {currentTab === "complaints" && (
          <div className="space-y-6 print:hidden">
            <h1 className="font-display text-3xl font-black text-slate-800">Kelola Pengaduan Lingkungan</h1>
            <p className="text-sm text-slate-500 mt-1">Daftar laporan pencemaran air sungai, tumpukan sampah liar, dan polusi dari masyarakat.</p>

            {/* Form Filter */}
            <form action="" method="get" className="flex flex-wrap gap-3 items-end bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
              <input type="hidden" name="tab" value="complaints" />
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Cari Laporan</label>
                <input
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Judul, pelapor, deskripsi, lokasi..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="w-36">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Status</label>
                <select
                  name="status"
                  defaultValue={filterStatus}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="">Semua</option>
                  <option value="pending">Pending</option>
                  <option value="investigating">Ditinjau</option>
                  <option value="resolved">Selesai</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>
              <div className="w-40">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Mulai Tanggal</label>
                <input
                  name="startDate"
                  type="date"
                  defaultValue={startDateStr}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="w-40">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Hingga Tanggal</label>
                <input
                  name="endDate"
                  type="date"
                  defaultValue={endDateStr}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="rounded-xl bg-leaf-700 text-white font-bold px-4 py-2 text-xs hover:bg-leaf-950">
                  Filter
                </button>
                <Link href="/admin?tab=complaints" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  Reset
                </Link>
              </div>
            </form>

            <div className="rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Pelapor & Tanggal</th>
                      <th className="px-6 py-4">Laporan & Lokasi</th>
                      <th className="px-6 py-4">Foto Bukti</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Catatan Tindakan Admin</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {complaintList.map((c: any) => (
                      <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{c.userName}</div>
                          <div className="text-xs text-slate-400">{c.userEmail}</div>
                          <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                            Tanggal: {new Date(c.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className="font-bold text-leaf-950">{c.title}</div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-3">{c.description}</p>
                          <div className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wider">Lokasi: {c.location}</div>
                        </td>
                        <td className="px-6 py-4">
                          {c.image ? (
                            <a
                              href={c.image}
                              target="_blank"
                              rel="noreferrer"
                              className="group block relative h-14 w-20 overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
                            >
                              <img
                                src={c.image}
                                alt="Bukti"
                                className="h-full w-full object-cover group-hover:scale-110 transition"
                              />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Tidak ada foto</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {c.status === "pending" && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">Pending</span>}
                          {c.status === "investigating" && <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">Ditinjau</span>}
                          {c.status === "resolved" && <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">Selesai</span>}
                          {c.status === "rejected" && <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">Ditolak</span>}
                        </td>
                        <td className="px-6 py-4">
                          <form
                            action={async (formData) => {
                              "use server";
                              const status = String(formData.get("status"));
                              const notes = String(formData.get("adminNotes"));
                              await updateComplaintStatus(c.id, status, notes);
                            }}
                            className="flex flex-col gap-2 max-w-[200px]"
                          >
                            <select
                              name="status"
                              defaultValue={c.status}
                              className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="investigating">Ditinjau</option>
                              <option value="resolved">Selesai</option>
                              <option value="rejected">Ditolak</option>
                            </select>
                            <input
                              name="adminNotes"
                              defaultValue={c.adminNotes || ""}
                              placeholder="Tulis tindakan..."
                              className="rounded-lg border border-slate-200 px-2 py-1 text-xs focus:outline-none"
                            />
                            <button type="submit" className="rounded-lg bg-leaf-700 text-white py-1 text-[10px] font-bold hover:bg-leaf-950">
                              Simpan & Tanggapi
                            </button>
                          </form>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <form action={deleteComplaint.bind(null, c.id)}>
                            <button type="submit" className="rounded-xl border border-red-100 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">
                              Hapus
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                    {complaintList.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-medium">
                          Tidak ada data laporan yang cocok dengan filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: KLAIM VOUCHER HADIAH (DENGAN FILTER) */}
        {currentTab === "redemptions" && (
          <div className="space-y-6 print:hidden">
            <h1 className="font-display text-3xl font-black text-slate-800">Klaim Voucher Hadiah</h1>
            <p className="text-sm text-slate-500 mt-1">Cari dan validasi kupon penukaran pengguna.</p>

            {/* Form Filter */}
            <form action="" method="get" className="flex flex-wrap gap-3 items-end bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
              <input type="hidden" name="tab" value="redemptions" />
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Cari Kupon/Pengguna</label>
                <input
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Kode ECO-XXXXXX, email, nama, atau judul reward..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="w-36">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Status</label>
                <select
                  name="status"
                  defaultValue={filterStatus}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="">Semua</option>
                  <option value="pending">Pending (Belum diklaim)</option>
                  <option value="completed">Selesai</option>
                </select>
              </div>
              <div className="w-40">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Mulai Tanggal</label>
                <input
                  name="startDate"
                  type="date"
                  defaultValue={startDateStr}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="w-40">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Hingga Tanggal</label>
                <input
                  name="endDate"
                  type="date"
                  defaultValue={endDateStr}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="rounded-xl bg-leaf-700 text-white font-bold px-4 py-2 text-xs hover:bg-leaf-950">
                  Filter
                </button>
                <Link href="/admin?tab=redemptions" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  Reset
                </Link>
              </div>
            </form>

            <div className="rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Kode Kupon</th>
                      <th className="px-6 py-4">Pengguna</th>
                      <th className="px-6 py-4">Hadiah & Provider</th>
                      <th className="px-6 py-4">Biaya Poin</th>
                      <th className="px-6 py-4">Tanggal & Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {redemptionList.map((r: any) => (
                      <tr key={r.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-mono font-bold text-slate-800 tracking-wider">
                          {r.code}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">{r.userName}</div>
                          <div className="text-xs text-slate-400">{r.userEmail}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-leaf-950">{r.rewardTitle}</div>
                          <div className="text-xs text-slate-400">{r.rewardProvider}</div>
                        </td>
                        <td className="px-6 py-4 font-black text-rose-600">-{r.pointsSpent} pts</td>
                        <td className="px-6 py-4">
                          <div className="text-xs text-slate-500">
                            {new Date(r.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <div className="mt-1">
                            {r.status === "completed" ? (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">Selesai</span>
                            ) : (
                              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">Belum Diklaim</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {r.status === "pending" && (
                            <form action={completeRedemption.bind(null, r.id)}>
                              <button type="submit" className="rounded-xl bg-leaf-700 hover:bg-leaf-955 px-3.5 py-1.5 text-xs font-bold text-white shadow-md">
                                Tandai Selesai
                              </button>
                            </form>
                          )}
                          {r.status === "completed" && (
                            <span className="text-xs font-bold text-slate-400">Terverifikasi</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {redemptionList.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-medium">
                          Tidak ada data penukaran kupon.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LAPORAN EKSEKUTIF & EKSPOR (NEW) */}
        {currentTab === "reports" && reportData && (
          <div className="space-y-8 print:w-full">
            
            {/* Header Laporan */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <h1 className="font-display text-3xl font-black text-slate-800">Laporan Eksekutif Eco Tech</h1>
                <p className="text-sm text-slate-500 mt-1">Data ringkasan indikator kinerja utama (KPI) & statistik sirkulasi poin terintegrasi.</p>
              </div>
              
              {/* Tombol Ekspor */}
              <ExportButtons
                kpis={reportData.kpis}
                trashSummary={reportData.trashSummary}
                rewardSummary={reportData.rewardSummary}
                userSummary={reportData.userSummary}
              />
            </div>

            {/* Grid KPI Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { label: "Poin Beredar (Circulating)", value: `${reportData.kpis.totalPointsCirculating} pts`, sub: "Saldo aktif semua user", icon: LeafIcon, color: "text-blue-600 bg-blue-50" },
                { label: "Rata-rata Poin User", value: `${reportData.kpis.averagePointsPerUser} pts`, sub: "Rasio poin per individu", icon: UserIcon, color: "text-purple-600 bg-purple-50" },
                { label: "Rasio Verifikasi Sampah", value: `${reportData.kpis.disposalSuccessRate}%`, sub: "Rasio disetujui vs total", icon: TrashIcon, color: "text-emerald-600 bg-emerald-50" },
                { label: "Rasio Penukaran Hadiah", value: `${reportData.kpis.redemptionRate}%`, sub: "Persentase poin dibelanjakan", icon: GiftIcon, color: "text-amber-600 bg-amber-50" },
                { label: "Penyelesaian Pengaduan", value: `${reportData.kpis.complaintResolvedRate}%`, sub: "Rasio laporan terselesaikan", icon: MegaphoneIcon, color: "text-rose-600 bg-rose-50" }
              ].map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.label} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-900/5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${kpi.color}`}>
                      <Icon size={18} />
                    </div>
                    <div className="mt-4 text-2xl font-black text-slate-800">{kpi.value}</div>
                    <div className="mt-1 text-xs font-bold text-slate-800 uppercase tracking-wider">{kpi.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">{kpi.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* Grid Regional KPI Cards */}
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {[
                { label: "Provinsi Teraktif", value: reportData.kpis.topProvince, sub: "Kontribusi poin tertinggi", icon: TrophyIcon, color: "text-amber-600 bg-amber-50" },
                { label: "Kabupaten/Kota Teraktif", value: reportData.kpis.topRegency, sub: "Kontribusi poin tertinggi", icon: TrophyIcon, color: "text-slate-600 bg-slate-100" },
                { label: "Kecamatan Teraktif", value: reportData.kpis.topDistrict, sub: "Kontribusi poin tertinggi", icon: TrophyIcon, color: "text-emerald-600 bg-emerald-50" }
              ].map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.label} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-900/5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${kpi.color}`}>
                      <Icon size={18} />
                    </div>
                    <div className="mt-4 text-lg font-black text-slate-800 capitalize truncate">{kpi.value.toLowerCase()}</div>
                    <div className="mt-1 text-xs font-bold text-slate-800 uppercase tracking-wider">{kpi.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-semibold">{kpi.sub}</div>
                  </div>
                );
              })}
            </div>

            {/* Detail Tables */}
            <div className="grid gap-6 md:grid-cols-2 mt-8">
              
              {/* Rekapitulasi Sampah */}
              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
                <h2 className="font-display text-lg font-black text-slate-800 mb-4">Volume Sampah Terkumpul per Kategori</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase">
                        <th className="px-4 py-3">Kategori</th>
                        <th className="px-4 py-3 text-right">Volume</th>
                        <th className="px-4 py-3 text-right">Poin Tersalurkan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {reportData.trashSummary.map((t: any) => (
                        <tr key={t.categoryKey} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3 capitalize font-bold text-slate-800">{t.categoryKey}</td>
                          <td className="px-4 py-3 text-right text-slate-600">{t.count} unit</td>
                          <td className="px-4 py-3 text-right font-black text-leaf-700">+{t.totalPoints} pts</td>
                        </tr>
                      ))}
                      {reportData.trashSummary.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-5 text-center text-slate-400">Tidak ada data setoran.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reward Voucher Terpopuler */}
              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
                <h2 className="font-display text-lg font-black text-slate-800 mb-4">5 Reward Voucher Terpopuler</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase">
                        <th className="px-4 py-3">Reward (Merchant)</th>
                        <th className="px-4 py-3 text-right">Jumlah Klaim</th>
                        <th className="px-4 py-3 text-right">Stok Tersisa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {reportData.rewardSummary.map((r: any) => (
                        <tr key={r.title} className="hover:bg-slate-50/50">
                          <td className="px-4 py-3">
                            <div className="font-bold text-slate-800">{r.title}</div>
                            <div className="text-[10px] text-slate-400 font-semibold">{r.provider}</div>
                          </td>
                          <td className="px-4 py-3 text-right text-slate-600 font-bold">{r.redemptionCount}x ditukarkan</td>
                          <td className="px-4 py-3 text-right font-black text-slate-800">{r.stock} unit</td>
                        </tr>
                      ))}
                      {reportData.rewardSummary.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-5 text-center text-slate-400">Tidak ada data penukaran.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Kontributor Teratas */}
            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8 mt-6">
              <h2 className="font-display text-lg font-black text-slate-800 mb-4">5 Kontributor Pengguna Teratas</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase">
                      <th className="px-6 py-3">Nama Pengguna</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3 text-right">Saldo Poin Saat Ini</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {reportData.userSummary.map((u: any) => (
                      <tr key={u.email} className="hover:bg-slate-50/50">
                        <td className="px-6 py-3 font-bold text-slate-800">{u.name}</td>
                        <td className="px-6 py-3 text-slate-500">{u.email}</td>
                        <td className="px-6 py-3 text-right font-black text-leaf-700">{u.points} pts</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: KELOLA REWARDS (DENGAN FILTER) */}
        {currentTab === "rewards" && (
          <div className="space-y-8 print:hidden">
            <h1 className="font-display text-3xl font-black text-slate-800">Kelola Katalog Rewards</h1>

            {/* Form Filter */}
            <form action="" method="get" className="flex flex-wrap gap-3 items-end bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
              <input type="hidden" name="tab" value="rewards" />
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Cari Reward</label>
                <input
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Nama reward atau merchant provider..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="w-48">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Kategori</label>
                <select
                  name="category"
                  defaultValue={filterCategory}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="">Semua</option>
                  <option value="voucher">Voucher Belanja</option>
                  <option value="goods">Barang Fisik</option>
                  <option value="seed">Bibit Pohon</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="rounded-xl bg-leaf-700 text-white font-bold px-4 py-2 text-xs hover:bg-leaf-955">
                  Filter
                </button>
                <Link href="/admin?tab=rewards" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  Reset
                </Link>
              </div>
            </form>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
                <h2 className="font-display text-lg font-black text-slate-800 mb-4">Hadiah Terdaftar</h2>
                <div className="space-y-4">
                  {rewardList.map((r: any) => (
                    <div key={r.id} className="flex items-start justify-between rounded-2xl border border-slate-100 p-4 hover:bg-slate-50/50 transition">
                      <div className="flex-1">
                        <span className="inline-block rounded-md bg-leaf-50 px-2 py-0.5 text-[10px] font-bold text-leaf-700 uppercase">
                          {r.category}
                        </span>
                        <div className="font-bold text-slate-800 text-sm mt-1">{r.title}</div>
                        <p className="text-xs text-slate-500 mt-0.5">{r.description}</p>
                        <div className="text-[11px] text-slate-400 font-semibold mt-2">
                          Provider: {r.provider} · <span className="text-leaf-700">{r.cost} pts</span> · <span className="text-slate-700">Stok: {r.stock}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <Link href={`/admin?tab=rewards&editId=${r.id}`} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                          Edit
                        </Link>
                        <form action={deleteReward.bind(null, r.id)}>
                          <button type="submit" className="rounded-xl border border-red-100 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">
                            Hapus
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
                <h2 className="font-display text-lg font-black text-slate-800 mb-4">
                  {editedReward ? "Edit Reward Hadiah" : "Tambah Reward Baru"}
                </h2>
                <form action={editedReward ? updateReward.bind(null, editedReward.id) : addReward} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase">Judul Hadiah</label>
                    <input
                      name="title"
                      defaultValue={editedReward?.title || ""}
                      required
                      placeholder="Nama voucher atau barang"
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase">Penyedia (Provider)</label>
                    <input
                      name="provider"
                      defaultValue={editedReward?.provider || ""}
                      required
                      placeholder="Nama merchant atau komunitas"
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase">Deskripsi</label>
                    <textarea
                      name="description"
                      defaultValue={editedReward?.description || ""}
                      required
                      rows={3}
                      placeholder="Detail syarat, cara pakai, atau info produk"
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase">Biaya Poin</label>
                      <input
                        name="cost"
                        type="number"
                        min="1"
                        defaultValue={editedReward?.cost || ""}
                        required
                        placeholder="Biaya pts"
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase">Kuantitas Stok</label>
                      <input
                        name="stock"
                        type="number"
                        min="0"
                        defaultValue={editedReward?.stock ?? 10}
                        required
                        placeholder="Kuantitas"
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase">Kategori</label>
                    <select
                      name="category"
                      defaultValue={editedReward?.category || "voucher"}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none"
                    >
                      <option value="voucher">Voucher Belanja</option>
                      <option value="goods">Barang Fisik</option>
                      <option value="seed">Bibit Pohon</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 rounded-2xl bg-leaf-700 hover:bg-leaf-955 py-3 text-sm font-bold text-white transition">
                      {editedReward ? "Simpan Perubahan" : "Tambah Reward"}
                    </button>
                    {editedReward && (
                      <Link href="/admin?tab=rewards" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                        Batal
                      </Link>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: KELOLA PANDUAN & ATURAN POIN */}
        {currentTab === "guides" && (
          <div className="space-y-8 print:hidden">
            <h1 className="font-display text-3xl font-black text-slate-800">Kelola Panduan & Aturan Poin</h1>
            <p className="text-sm text-slate-500 mt-1">Konfigurasikan aturan perolehan poin per kategori sampah.</p>

            {/* Form Filter */}
            <form action="" method="get" className="flex max-w-md gap-2 bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
              <input type="hidden" name="tab" value="guides" />
              <input
                name="search"
                defaultValue={searchQuery}
                placeholder="Cari kategori atau key..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
              />
              <button type="submit" className="rounded-xl bg-leaf-700 text-white font-bold px-4 text-xs hover:bg-leaf-955">
                Cari
              </button>
            </form>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
                <h2 className="font-display text-lg font-black text-slate-800 mb-4">Daftar Kategori & Tarif Poin</h2>
                <div className="space-y-4">
                  {guideList.map((g: any) => (
                    <div key={g.id} className="flex items-start justify-between rounded-2xl border border-slate-100 p-4 hover:bg-slate-50/50 transition">
                      <div className="flex-1">
                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 capitalize">
                          Key: {g.categoryKey}
                        </span>
                        <div className="font-bold text-slate-800 text-sm mt-1">{g.title}</div>
                        <p className="text-xs text-slate-500 mt-0.5">{g.instruction}</p>
                        <div className="text-[11px] text-leaf-700 font-bold mt-2">
                          Poin Scan: +{g.basePoints} pts · Poin Item: +{g.pointsPerItem} pts/unit
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        <Link href={`/admin?tab=guides&editId=${g.id}`} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                          Edit
                        </Link>
                        <form action={deleteGuide.bind(null, g.id)}>
                          <button type="submit" className="rounded-xl border border-red-100 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">
                            Hapus
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8">
                <h2 className="font-display text-lg font-black text-slate-800 mb-4">
                  {editedGuide ? "Edit Aturan Poin" : "Tambah Kategori Sampah Baru"}
                </h2>
                <form action={editedGuide ? updateGuide.bind(null, editedGuide.id) : addGuide} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase">Category Key (ID AI)</label>
                    <input
                      name="categoryKey"
                      defaultValue={editedGuide?.categoryKey || ""}
                      disabled={!!editedGuide}
                      required
                      placeholder="Contoh: plastic, paper, glass, organic, dll"
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase">Nama Kategori (User-friendly)</label>
                    <input
                      name="title"
                      defaultValue={editedGuide?.title || ""}
                      required
                      placeholder="Contoh: Botol Plastik PET"
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase">Poin Dasar (1x Scan)</label>
                      <input
                        name="basePoints"
                        type="number"
                        min="0"
                        defaultValue={editedGuide?.basePoints ?? 5}
                        required
                        placeholder="Bonus per scan"
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase">Poin per Item</label>
                      <input
                        name="pointsPerItem"
                        type="number"
                        min="0"
                        defaultValue={editedGuide?.pointsPerItem ?? 10}
                        required
                        placeholder="Tarif per unit"
                        className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase">Instruksi Cara Memilah</label>
                    <textarea
                      name="instruction"
                      defaultValue={editedGuide?.instruction || ""}
                      required
                      rows={3}
                      placeholder="Langkah memilah (contoh: bilas botol, lepaskan tutup, dll)"
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 rounded-2xl bg-leaf-700 hover:bg-leaf-955 py-3 text-sm font-bold text-white transition">
                      {editedGuide ? "Simpan Aturan" : "Tambah Kategori"}
                    </button>
                    {editedGuide && (
                      <Link href="/admin?tab=guides" className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                        Batal
                      </Link>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: LEADERBOARD ADMIN (DENGAN FILTER) */}
        {currentTab === "leaderboard" && (
          <div className="space-y-6 print:hidden">
            <h1 className="font-display text-3xl font-black text-slate-800">Papan Peringkat Admin</h1>
            <p className="text-sm text-slate-500 mt-1">Daftar pengguna teraktif untuk pemantauan dan kontrol penyalahgunaan.</p>

            {/* Form Filter */}
            <form action="" method="get" className="flex max-w-md gap-2 bg-white border border-slate-100 p-3 rounded-2xl shadow-sm">
              <input type="hidden" name="tab" value="leaderboard" />
              <input
                name="search"
                defaultValue={searchQuery}
                placeholder="Cari nama atau email..."
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
              />
              <button type="submit" className="rounded-xl bg-leaf-700 text-white font-bold px-4 text-xs hover:bg-leaf-955">
                Cari
              </button>
            </form>

            <div className="rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4 w-16">Peringkat</th>
                      <th className="px-6 py-4">Nama Pengguna</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Total Poin</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Moderasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {leaderboard.map((u: any, idx: number) => (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-display font-black text-slate-400">
                          #{idx + 1}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {u.name}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 font-black text-leaf-700">
                          {u.points} pts
                        </td>
                        <td className="px-6 py-4">
                          {u.isBlocked ? (
                            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">Terblokir</span>
                          ) : (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">Aktif</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Link href={`/admin?tab=users&search=${u.email}`} className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                            Koreksi Poin
                          </Link>
                          <form action={toggleUserBlock.bind(null, u.id)} className="inline">
                            <button type="submit" className={`rounded-xl px-3 py-1.5 text-xs font-bold shadow-sm transition ${
                              u.isBlocked
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-rose-600 hover:bg-rose-700 text-white"
                            }`}>
                              {u.isBlocked ? "Aktifkan" : "Blokir"}
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                    {leaderboard.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-medium">
                          Tidak ada data pengguna.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: KELOLA PENGGUNA (DENGAN FILTER) */}
        {currentTab === "users" && (
          <div className="space-y-6 print:hidden">
            <h1 className="font-display text-3xl font-black text-slate-800">Kelola Pengguna</h1>
            <p className="text-sm text-slate-500 mt-1">Kelola total saldo poin pengguna dan status pemblokiran akun.</p>

            {/* Form Filter */}
            <form action="" method="get" className="flex flex-wrap gap-3 items-end bg-white border border-slate-100 p-5 rounded-3xl shadow-sm">
              <input type="hidden" name="tab" value="users" />
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Cari Pengguna</label>
                <input
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Cari nama atau email..."
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                />
              </div>
              <div className="w-48">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Status Akun</label>
                <select
                  name="status"
                  defaultValue={filterStatus}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs focus:outline-none"
                >
                  <option value="">Semua</option>
                  <option value="active">Aktif</option>
                  <option value="blocked">Terblokir</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="rounded-xl bg-leaf-700 text-white font-bold px-4 py-2 text-xs hover:bg-leaf-955">
                  Filter
                </button>
                <Link href="/admin?tab=users" className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                  Reset
                </Link>
              </div>
            </form>

            <div className="rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Nama Pengguna</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Wilayah / Alamat</th>
                      <th className="px-6 py-4">Saldo Poin</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Aksi Koreksi Poin</th>
                      <th className="px-6 py-4 text-right">Aksi Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {userList.map((u: any) => (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-bold text-slate-800">
                          {u.name}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {u.email}
                        </td>
                        <td className="px-6 py-4">
                          {u.province ? (
                            <div>
                              <div className="font-semibold text-slate-800">{u.village}</div>
                              <div className="text-xs text-slate-400">
                                {u.hamlet ? `${u.hamlet}, ` : ""}Kec. {u.district}, {u.regency}, {u.province}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Belum diisi</span>
                          )}
                        </td>
                        <td className="px-6 py-4 font-black text-leaf-700">
                          {u.points} pts
                        </td>
                        <td className="px-6 py-4">
                          {u.isBlocked ? (
                            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">Terblokir</span>
                          ) : (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">Aktif</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <form
                            action={async (formData) => {
                              "use server";
                              const points = Number(formData.get("points"));
                              await updateUserPoints(u.id, points);
                            }}
                            className="flex items-center gap-2"
                          >
                            <input
                              name="points"
                              type="number"
                              defaultValue={u.points}
                              className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold focus:border-leaf-500 focus:outline-none"
                            />
                            <button type="submit" className="rounded-lg bg-leaf-700 text-white px-2 py-1 text-[10px] font-bold hover:bg-leaf-955">
                              Simpan
                            </button>
                          </form>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <form action={toggleUserBlock.bind(null, u.id)}>
                            <button type="submit" className={`rounded-xl px-3.5 py-1.5 text-xs font-bold shadow-md transition ${
                              u.isBlocked
                                ? "bg-emerald-600 text-white shadow-emerald-600/10 hover:bg-emerald-700"
                                : "bg-rose-600 text-white shadow-rose-600/10 hover:bg-rose-700"
                            }`}>
                              {u.isBlocked ? "Pulihkan Akun" : "Blokir Akun"}
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                    {userList.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400 font-medium">
                          Tidak ada data pengguna.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: DOKUMENTASI FITUR */}
        {currentTab === "docs" && (
          <div className="space-y-8 print:hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
              <div>
                <h1 className="font-display text-3xl font-black text-slate-800 flex items-center gap-2">
                  <BookOpenIcon className="text-leaf-700" size={28} /> Dokumentasi & Panduan Fitur
                </h1>
                <p className="mt-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Eco Tech Operational & Flow Guide
                </p>
              </div>
            </div>

            {/* Layout Utama: Navigasi Daftar Isi Sticky & Konten Kaca */}
            <div className="grid gap-8 md:grid-cols-[240px_1fr]">
              
              {/* Sidebar Daftar Isi (Sticky) */}
              <div className="relative print:hidden">
                <div className="sticky top-24 space-y-4 rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-900/5">
                  <h3 className="font-display text-xs font-black text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">
                    Daftar Isi
                  </h3>
                  <nav className="flex flex-col space-y-2">
                    {[
                      { label: "Prinsip Utama", id: "prinsip" },
                      { label: "Fitur Warga", id: "warga" },
                      { label: "Kamera AI", id: "kamera-ai" },
                      { label: "Katalog Hadiah", id: "rewards" },
                      { label: "Papan Peringkat", id: "leaderboard" },
                      { label: "Pengaduan Laporan", id: "pengaduan" },
                      { label: "Profil & Barcode", id: "profil" },
                      { label: "Portal Pengelola", id: "admin-portal" },
                      { label: "Verifikasi Setoran", id: "verif-setoran" },
                      { label: "Laporan & Ekspor", id: "laporan-kpi" },
                      { label: "Kontrol & Blokir", id: "kontrol-user" }
                    ].map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="text-xs font-bold text-slate-500 hover:text-leaf-700 transition flex items-center gap-1.5 py-1"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Konten Utama Dokumentasi */}
              <div className="space-y-10">
                
                {/* 1. Prinsip Utama */}
                <section id="prinsip" className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-leaf-50 text-leaf-700">
                      <LeafIcon size={20} />
                    </div>
                    <h2 className="font-display text-xl font-black text-slate-800">1. Prinsip Utama Layanan</h2>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                    <p>Eco Tech beroperasi dengan filosofi sederhana namun kokoh: <strong>"Setor Sampah, Kumpulkan Poin, Tukar Hadiah"</strong>.</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Perhitungan Poin per Unit:</strong> Setiap sampah disetor dikelompokkan dan dihitung jumlah unitnya berdasarkan aturan tarif kategori sampah dinamis dari database.</li>
                      <li><strong>Filter Kejujuran AI:</strong> Menghalau kecurangan penyetoran dengan algoritma pengenalan gambar di server untuk mematikan potensi eksploitasi poin.</li>
                      <li><strong>Gotong Royong Daerah:</strong> Data kewilayahan warga dipetakan dari RT/RW hingga Provinsi untuk melahirkan kompetisi keaktifan antardaerah.</li>
                    </ul>
                  </div>
                </section>

                {/* 2. Fitur Warga (Beranda) */}
                <section id="warga" className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <ChartIcon size={20} />
                    </div>
                    <h2 className="font-display text-xl font-black text-slate-800">2. Halaman Utama Beranda Warga</h2>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                    <p>Beranda warga dikemas dengan UI premium bertema natural yang responsif:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Grafik Tren Mingguan:</strong> Visualisasi batang harian 7 hari terakhir yang dapat digeser (scrollable) di HP.</li>
                      <li><strong>Tips Ramah Lingkungan:</strong> Banner kartu saran cara memilah sampah yang berubah otomatis setiap kali dimuat.</li>
                      <li><strong>Tamu vs Warga:</strong> Tamu disajikan visual ajakan pendaftaran dan tombol masuk. Warga masuk langsung disajikan data saldo poin dan 4 riwayat setoran terbarunya.</li>
                    </ul>
                  </div>
                </section>

                {/* 3. Kamera AI */}
                <section id="kamera-ai" className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <TrashIcon size={20} />
                    </div>
                    <h2 className="font-display text-xl font-black text-slate-800">3. Kamera Pemindai Cerdas (Pendeteksi AI)</h2>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                    <p>Kamera AI memproses deteksi sampah secara instan dan aman dari pemalsuan:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Kamera Tegak Mobile:</strong> Aspek rasio potret 3:4 yang pas untuk pengoperasian satu tangan.</li>
                      <li><strong>Filter Keamanan Anti-Cheat:</strong> AI di server secara tegas membatalkan dan memunculkan banner merah jika foto berupa wajah (selfie), hewan, perabotan, barang elektronik utuh, atau ruangan bersih.</li>
                      <li><strong>Tombol Jumbo:</strong> Tombol tambah/kurang kuantitas berukuran minimal 48px agar jempol tidak meleset saat mendaftarkan jumlah unit sampah yang diletakkan di depan depo.</li>
                    </ul>
                  </div>
                </section>

                {/* 4. Katalog Hadiah */}
                <section id="rewards" className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                      <GiftIcon size={20} />
                    </div>
                    <h2 className="font-display text-xl font-black text-slate-800">4. Katalog Penukaran Hadiah</h2>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                    <p>Menukar poin yang dikumpulkan warga dengan voucer fisik/digital secara terkendali:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Penyaringan Kategori:</strong> Pil filter kategori Voucher Belanja, Barang Daur Ulang, dan Bibit Pohon.</li>
                      <li><strong>Validasi Saldo & Stok:</strong> Tombol otomatis terkunci menjadi *Poin Tidak Cukup* jika poin warga kurang, atau *Stok Habis* jika kuota hadiah bernilai 0 di database.</li>
                      <li><strong>Flow Sukses:</strong> Mengurangi saldo poin warga, memotong stok gudang, menerbitkan kode unik format `ECO-XXXXXX`, dan mengarahkan ke profil.</li>
                    </ul>
                  </div>
                </section>

                {/* 5. Papan Peringkat */}
                <section id="leaderboard" className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                      <TrophyIcon size={20} />
                    </div>
                    <h2 className="font-display text-xl font-black text-slate-800">5. Papan Peringkat Eco Hero & Kewilayahan</h2>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                    <p>Kompetisi kebersihan terbagi menjadi dua ranah utama:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Individu (Eco Hero):</strong> Papan 10 peringkat warga teraktif. Nama disensor sebagian (seperti `Bu***i`) demi melindungi privasi publik.</li>
                      <li><strong>Kewilayahan (Eco Region):</strong> Urutan daerah terajin (Provinsi, Kabupaten, Kecamatan, Desa, RT/RW) dengan podium visual juara 1, 2, 3 bergradasi warna medali resmi.</li>
                    </ul>
                  </div>
                </section>

                {/* 6. Pengaduan Laporan */}
                <section id="pengaduan" className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                      <MegaphoneIcon size={20} />
                    </div>
                    <h2 className="font-display text-xl font-black text-slate-800">6. Formulir Laporan Pengaduan Lingkungan</h2>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                    <p>Menyalurkan aspirasi kebersihan warga mengenai tumpukan sampah liar langsung ke pengelola:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Input Lengkap:</strong> Pengisian judul, deskripsi kejadian, patokan lokasi spesifik, dan unggah foto bukti digital.</li>
                      <li><strong>Status Aduan Formal:</strong> Penanda status tanpa emoji yang berganti otomatis dari *Pending* -> *Ditinjau* -> *Selesai / Ditolak* disertai kolom catatan penyelesaian dari administrator.</li>
                    </ul>
                  </div>
                </section>

                {/* 7. Profil & Barcode */}
                <section id="profil" className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
                      <UserIcon size={20} />
                    </div>
                    <h2 className="font-display text-xl font-black text-slate-800">7. Halaman Profil Saya & Barcode Garis</h2>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                    <p>Identitas digital warga yang merangkum hasil kerja daur ulangnya:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Metrik Kunci:</strong> Tiga kotak rangkuman total poin sukses, total sampah disetor (unit), dan total voucher yang diklaim.</li>
                      <li><strong>Penyimpanan Kupon:</strong> Menyimpan kode voucer aktif berlabel warna status penukaran.</li>
                      <li><strong>Barcode Garis CSS:</strong> Representasi garis barcode hitam putih yang di-generate otomatis untuk dipindai oleh kasir rekanan.</li>
                    </ul>
                  </div>
                </section>

                {/* 8. Portal Pengelola */}
                <section id="admin-portal" className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <SettingsIcon size={20} />
                    </div>
                    <h2 className="font-display text-xl font-black text-slate-800">8. Portal Pengelola & Mode Simulator</h2>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                    <p>Sisi administrator yang terisolasi dengan penegasan aspek keamanan internal:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Admin Secure Login:</strong> Halaman masuk khusus `/admin/login` bertema gelap cyber tanpa form registrasi publik.</li>
                      <li><strong>Sidebar Hamburger Tutup (X):</strong> Drawer mobile dengan tombol silang penutup fungsional dan letak menu tertata.</li>
                      <li><strong>Sesi Simulator:</strong> Tombol *Lihat Web (Sebagai User)* di dasar sidebar yang mengubah login admin menjadi warga tester bersaldo 500 poin untuk simulasi, dan tombol emas melayang *Kembali ke Admin* untuk kembali.</li>
                    </ul>
                  </div>
                </section>

                {/* 9. Verifikasi Setoran */}
                <section id="verif-setoran" className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                      <TrashIcon size={20} />
                    </div>
                    <h2 className="font-display text-xl font-black text-slate-800">9. Verifikasi Setoran & Tindak Lanjut Laporan</h2>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                    <p>Alur verifikasi kebersihan depo dan aduan pencemaran lingkungan:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Aksi Setoran:</strong> Petugas membandingkan fisik sampah dengan foto. Tombol *Setujui* akan mengirim poin secara instan, tombol *Tolak* membatalkan setoran.</li>
                      <li><strong>Tindak Lanjut Aduan:</strong> Review lokasi aduan, ubah status laporan (*Pending* -> *Ditinjau* -> *Selesai*), dan tulis catatan detail tindakan penyelesaian dari petugas kebersihan.</li>
                    </ul>
                  </div>
                </section>

                {/* 10. Laporan & Ekspor */}
                <section id="laporan-kpi" className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <ChartIcon size={20} />
                    </div>
                    <h2 className="font-display text-xl font-black text-slate-800">10. Laporan Kinerja & Ekspor Dokumen</h2>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                    <p>Menu ringkasan data eksekutif platform dan performa wilayah terajin:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Kartu KPI Regional:</strong> Indikasi Provinsi Teraktif, Kabupaten Teraktif, dan Kecamatan Teraktif terhitung dari sirkulasi poin.</li>
                      <li><strong>Dokumen Ekspor XLS/DOC/PDF:</strong> Tombol unduh laporan ke format Excel, Word, atau print PDF yang merangkum data KPI sirkulasi, rekapitulasi sampah kategori, voucer terpopuler, kontributor teraktif, dan data regional teraktif.</li>
                    </ul>
                  </div>
                </section>

                {/* 11. Kontrol & Blokir */}
                <section id="kontrol-user" className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 md:p-8 scroll-mt-24">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                      <UserIcon size={20} />
                    </div>
                    <h2 className="font-display text-xl font-black text-slate-800">11. Pengelolaan Akun & Blokir Cheat</h2>
                  </div>
                  <div className="text-sm text-slate-600 leading-relaxed space-y-3">
                    <p>Keamanan database warga dan pemblokiran penyalahgunaan poin:</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Edit Saldo Manual:</strong> Menyesuaikan saldo poin warga secara manual (menambah atau memotong jika ada kekeliruan verifikasi depo).</li>
                      <li><strong>Penalti Blokir Akun:</strong> Tombol *Blokir Akun* akan langsung mengubah status warga. Efeknya, akun akan di-force logout secara instan, tidak bisa login kembali, dan namanya dieliminasi dari seluruh daftar papan peringkat publik.</li>
                    </ul>
                  </div>
                </section>

              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
