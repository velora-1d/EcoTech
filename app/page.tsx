import Link from "next/link";
import { desc, eq, and, gte, sum } from "drizzle-orm";
import { db } from "@/db";
import { disposals, users, redemptions } from "@/db/schema";
import { getSession, destroySession } from "@/lib/session";
import { ensureInitialSeeds } from "@/app/actions";
import { LeafIcon } from "@/components/icons";
import { redirect } from "next/navigation";

// Tips ramah lingkungan dinamis
const ECO_TIPS = [
  "Bilas wadah plastik sebelum disetor agar tidak membusuk dan memudahkan proses daur ulang.",
  "Remas botol plastik dan lipat kardus untuk menghemat ruang penyimpanan tempat pembuangan.",
  "Pisahkan kertas dari plastik pembungkusnya; kertas yang terkena minyak tidak bisa didaur ulang.",
  "Gunakan kantong belanja kain mandiri untuk mengurangi timbulan plastik sekali pakai.",
  "Satu botol plastik memerlukan waktu hingga 450 tahun untuk terurai di alam liar.",
  "Pastikan baterai dan limbah elektronik dipisahkan karena mengandung zat kimia berbahaya (B3)."
];

async function getGuestStats() {
  if (!db) return { totalVerifiedItems: 0, totalPointsEarned: 0 };
  
  const [[itemRow], [ptRow]] = await Promise.all([
    db.select({ total: sum(disposals.itemCount) }).from(disposals).where(eq(disposals.status, "approved")),
    db.select({ total: sum(disposals.pointsEarned) }).from(disposals).where(eq(disposals.status, "approved"))
  ]);

  return {
    totalVerifiedItems: Number(itemRow?.total ?? 0),
    totalPointsEarned: Number(ptRow?.total ?? 0)
  };
}

async function getUserDashboardData(userId: string) {
  if (!db) return null;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [userRow, recentSetoran, recentRedeem, weeklyStats] = await Promise.all([
    db.select({ points: users.points, name: users.name }).from(users).where(eq(users.id, userId)).limit(1),
    db.select({
      id: disposals.id,
      categoryKey: disposals.categoryKey,
      itemCount: disposals.itemCount,
      pointsEarned: disposals.pointsEarned,
      status: disposals.status,
      createdAt: disposals.createdAt
    }).from(disposals).where(eq(disposals.userId, userId)).orderBy(desc(disposals.createdAt)).limit(4),
    db.select({
      id: redemptions.id,
      pointsSpent: redemptions.pointsSpent,
      createdAt: redemptions.createdAt
    }).from(redemptions).where(eq(redemptions.userId, userId)).orderBy(desc(redemptions.createdAt)).limit(3),
    db.select({
      itemCount: disposals.itemCount,
      createdAt: disposals.createdAt,
      status: disposals.status
    }).from(disposals).where(
      and(
        eq(disposals.userId, userId),
        eq(disposals.status, "approved"),
        gte(disposals.createdAt, sevenDaysAgo)
      )
    )
  ]);

  return {
    user: userRow[0],
    recentSetoran,
    recentRedeem,
    weeklyStats
  };
}

export default async function HomePage() {
  const session = await getSession();
  
  await ensureInitialSeeds();

  if (!session || session.userId === "env-admin") {
    const stats = await getGuestStats();

    return (
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-16 px-4 py-12 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-emerald-900/10 bg-white/75 p-8 shadow-2xl shadow-emerald-900/5 backdrop-blur md:p-16">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-50 opacity-50 blur-3xl" />
          <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-leaf-50 opacity-40 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-100 px-3.5 py-1 text-xs font-bold text-leaf-700 uppercase tracking-wider">
                <LeafIcon size={12} className="text-leaf-600" /> Gerakan Hidup Minim Sampah
              </span>
              <h1 className="font-display text-4xl font-black tracking-tight text-leaf-950 sm:text-6xl mt-4 leading-tight">
                Ubah Sampah Menjadi <span className="text-leaf-600">Poin Hadiah</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-600 max-w-xl mx-auto lg:mx-0">
                Eco Tech adalah platform pemilahan sampah cerdas berbasis kecerdasan buatan (AI) yang menghargai setiap kepedulian lingkungan Anda dengan poin reward belanja menarik.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link
                  href="/register"
                  className="rounded-2xl bg-leaf-700 px-6 py-4 font-black text-white shadow-lg shadow-leaf-700/20 hover:bg-leaf-950 transition active:scale-95 text-center"
                >
                  Mulai Selamatkan Bumi
                </Link>
                <Link
                  href="/panduan"
                  className="rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 font-bold text-slate-700 hover:bg-slate-50 transition active:scale-95 text-center"
                >
                  Lihat Cara Kerja
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:pl-6">
              <div className="rounded-3xl bg-leaf-950 p-6 text-white shadow-lg shadow-leaf-950/10">
                <div className="text-4xl font-black text-leaf-400">{stats.totalPointsEarned}</div>
                <div className="text-sm font-semibold text-leaf-200 mt-2">Poin Telah Dibagikan</div>
                <p className="text-xs text-leaf-300 mt-1">Diberikan kepada user peduli lingkungan.</p>
              </div>
              <div className="rounded-3xl bg-leaf-500 p-6 text-leaf-950 shadow-lg shadow-leaf-500/10">
                <div className="text-4xl font-black">{stats.totalVerifiedItems}</div>
                <div className="text-sm font-black mt-2">Item Sampah Terpilah</div>
                <p className="text-xs text-leaf-900 mt-1">Plastik, kertas, dan kaleng terselamatkan.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="font-display text-3xl font-black text-leaf-950">Cara Kerja Eco Tech</h2>
          <p className="mt-2 text-slate-500 max-w-md mx-auto">Sangat mudah berpartisipasi menjaga kelestarian bumi.</p>

          <div className="grid gap-8 sm:grid-cols-3 mt-12">
            {[
              { num: "1", title: "Pindai dengan AI", desc: "Arahkan kamera ke sampah anorganik Anda di menu Kamera AI." },
              { num: "2", title: "Kirim & Verifikasi", desc: "Setor sampah Anda secara fisik ke dropbox terdekat untuk disetujui Admin." },
              { num: "3", title: "Tukar Rewards", desc: "Tukarkan akumulasi poin Anda dengan voucher belanja atau bibit pohon." }
            ].map((step) => (
              <div key={step.num} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-900/5 relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-leaf-100 text-lg font-black text-leaf-700 border-4 border-slate-50">
                  {step.num}
                </div>
                <h3 className="font-display text-lg font-black text-leaf-950 mt-4">{step.title}</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  const dashboardData = await getUserDashboardData(session.userId);
  if (!dashboardData || !dashboardData.user) {
    await destroySession();
    redirect("/login?error=Sesi+Anda+tidak+valid+atau+telah+dihapus.");
  }

  const { user, recentSetoran, recentRedeem, weeklyStats } = dashboardData;

  let userLevel = "Green Starter";
  let levelColor = "bg-leaf-100 text-leaf-700 border-leaf-200";
  if (user.points > 1500) {
    userLevel = "Earth Guardian";
    levelColor = "bg-indigo-100 text-indigo-700 border-indigo-200";
  } else if (user.points > 500) {
    userLevel = "Eco Warrior";
    levelColor = "bg-emerald-100 text-emerald-700 border-emerald-200";
  }

  const randomTip = ECO_TIPS[new Date().getDay() % ECO_TIPS.length];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  }).reverse();

  const dailyCounts = last7Days.map((dayStr) => {
    const dayDisposals = weeklyStats.filter((w) => {
      const wDate = new Date(w.createdAt).toISOString().split("T")[0];
      return wDate === dayStr;
    });
    return dayDisposals.reduce((s, d) => s + d.itemCount, 0);
  });

  const maxCount = Math.max(...dailyCounts, 5);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
            <LeafIcon size={28} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-black text-leaf-955">Halo, {user.name}!</h1>
            <div className="flex gap-2 items-center mt-1">
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${levelColor}`}>
                {userLevel}
              </span>
              <span className="text-xs text-slate-400">Pahlawan Lingkungan</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-leaf-50 border border-leaf-100 px-6 py-2.5 rounded-2xl text-center">
            <div className="text-2xl font-black text-leaf-955">{user.points}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saldo Poin</div>
          </div>
          <Link
            href="/disposal"
            className="flex items-center gap-2 rounded-2xl bg-leaf-700 hover:bg-leaf-950 px-5 py-3 text-sm font-black text-white shadow-md shadow-leaf-700/10 transition active:scale-95"
          >
            Mulai Pindai AI
          </Link>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5 md:p-8 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-leaf-700 uppercase tracking-widest">Tip Hari Ini</span>
            <p className="mt-3 text-base leading-relaxed text-slate-700 font-medium">
              &quot;{randomTip}&quot;
            </p>
          </div>
          <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center text-xs text-slate-400">
            <span>Dukaciptakan bumi bersih</span>
            <Link href="/panduan" className="font-bold text-leaf-700 hover:underline">Lihat Panduan Penuh →</Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5 md:p-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tren Pemilahan 7 Hari Terakhir</h3>
          <div className="overflow-x-auto scrollbar-none py-2">
            <div className="mt-6 h-36 min-w-[340px] flex items-end justify-between gap-3 px-2">
              {dailyCounts.map((countVal, i) => {
                const pct = (countVal / maxCount) * 100;
                const dateObj = new Date(last7Days[i]);
                const label = dateObj.toLocaleDateString("id-ID", { weekday: "narrow" });
                return (
                  <div key={last7Days[i]} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-white whitespace-nowrap shadow-md">
                      {countVal} item
                    </span>
                    <div
                      className="w-full rounded-t-lg bg-leaf-100 group-hover:bg-leaf-700 transition"
                      style={{ height: `${Math.max(pct, 5)}%` }}
                    />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-2">
        <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5 md:p-8">
          <h2 className="font-display text-lg font-black text-slate-800 mb-4">Setoran Sampah Terbaru</h2>
          <div className="space-y-3">
            {recentSetoran.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Belum ada setoran sampah.</p>
            ) : (
              recentSetoran.map((s) => (
                <div key={s.id} className="flex justify-between items-center rounded-2xl border border-slate-100 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-800 capitalize">{s.categoryKey}</span>
                      <span className="text-[10px] font-bold text-slate-400">× {s.itemCount} unit</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(s.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-black text-leaf-700 text-sm">+{s.pointsEarned} pts</span>
                    {s.status === "approved" && <span className="rounded bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">Disetujui</span>}
                    {s.status === "rejected" && <span className="rounded bg-rose-100 px-2 py-0.5 text-[9px] font-bold text-rose-700">Ditolak</span>}
                    {s.status === "pending" && <span className="rounded bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-700">Pending</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5 md:p-8">
          <h2 className="font-display text-lg font-black text-slate-800 mb-4">Voucher & Kupon Baru</h2>
          <div className="space-y-3">
            {recentRedeem.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-4">Belum ada penukaran voucher.</p>
            ) : (
              recentRedeem.map((r) => (
                <div key={r.id} className="flex justify-between items-center rounded-2xl border border-slate-100 p-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-400">Penukaran Kupon</div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      {new Date(r.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-sm text-rose-600">-{r.pointsSpent} pts</span>
                  </div>
                </div>
              ))
            )}
          </div>
          {recentRedeem.length > 0 && (
            <Link href="/profile" className="mt-4 block text-center text-xs font-bold text-leaf-700 hover:text-leaf-950">
              Lihat kode kupon saya →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
