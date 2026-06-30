import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { disposals, redemptions, rewards, users } from "@/db/schema";
import { getSession } from "@/lib/session";
import { LeafIcon, TrashIcon, GiftIcon } from "@/components/icons";

async function getProfileData(userId: string) {
  if (!db) return null;

  const [userRow, userDisposals, userRedemptions] = await Promise.all([
    db.select({ name: users.name, email: users.email, points: users.points, createdAt: users.createdAt })
      .from(users).where(eq(users.id, userId)).limit(1),
    db.select({
      id: disposals.id,
      categoryKey: disposals.categoryKey,
      itemCount: disposals.itemCount,
      pointsEarned: disposals.pointsEarned,
      status: disposals.status,
      createdAt: disposals.createdAt
    }).from(disposals).where(eq(disposals.userId, userId)).orderBy(desc(disposals.createdAt)).limit(20),
    db.select({
      id: redemptions.id,
      pointsSpent: redemptions.pointsSpent,
      code: redemptions.code,
      status: redemptions.status,
      createdAt: redemptions.createdAt,
      rewardTitle: rewards.title,
      rewardProvider: rewards.provider
    })
      .from(redemptions)
      .innerJoin(rewards, eq(redemptions.rewardId, rewards.id))
      .where(eq(redemptions.userId, userId))
      .orderBy(desc(redemptions.createdAt))
  ]);

  return { user: userRow[0], disposalHistory: userDisposals, redemptionHistory: userRedemptions };
}

export default async function ProfilePage() {
  const session = await getSession();
  if (!session || session.userId === "env-admin") redirect("/login");

  const data = await getProfileData(session.userId);

  // Menghitung statistik berdasarkan data nyata
  const approvedDisposals = data?.disposalHistory.filter(d => d.status === "approved") ?? [];
  const totalDisposalPoints = approvedDisposals.reduce((s, d) => s + d.pointsEarned, 0);
  const totalItemsDisposed = approvedDisposals.reduce((s, d) => s + d.itemCount, 0);

  // Fungsi helper warna status setoran
  const getDisposalStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">Disetujui</span>;
      case "rejected":
        return <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">Ditolak</span>;
      default:
        return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">Pending</span>;
    }
  };

  // Fungsi helper warna status penukaran
  const getRedemptionStatusBadge = (status: string) => {
    return status === "completed"
      ? <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">Selesai</span>
      : <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">Belum Diklaim</span>;
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Profil */}
      <section className="rounded-[2rem] border border-emerald-900/10 bg-white/75 p-6 shadow-xl shadow-emerald-900/5 backdrop-blur md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
              <LeafIcon size={32} />
            </div>
            <div>
              <h1 className="font-display text-2xl font-black text-leaf-955">{data?.user?.name ?? session.name}</h1>
              <p className="text-sm text-slate-500">{data?.user?.email ?? session.email}</p>
              {data?.user?.createdAt && (
                <p className="mt-1 text-xs text-slate-400">
                  Bergabung {new Date(data.user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          </div>
          <div className="text-left sm:text-right bg-leaf-50 px-6 py-3 rounded-2xl border border-leaf-100">
            <div className="text-3xl font-black text-leaf-955">{data?.user?.points ?? 0}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saldo Poin Aktif</div>
          </div>
        </div>

        {!data && (
          <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm text-amber-700">
            Database belum tersambung — statistik tidak tersedia.
          </p>
        )}
      </section>

      {/* Grid Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total Poin Disetujui", value: totalDisposalPoints, icon: LeafIcon },
          { label: "Item Sampah Terverifikasi", value: totalItemsDisposed, icon: TrashIcon },
          { label: "Kupon Hadiah Ditukar", value: data?.redemptionHistory.length ?? 0, icon: GiftIcon }
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-5 shadow-lg shadow-emerald-900/5">
            <div className="text-leaf-700"><Icon size={24} /></div>
            <div className="mt-2 text-2xl font-black text-leaf-955">{value}</div>
            <div className="mt-1 text-sm text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tab / Section Riwayat Disposal */}
        <section className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5 md:p-8">
          <h2 className="font-display text-xl font-black text-leaf-950">Riwayat Setoran Sampah</h2>
          <p className="text-xs text-slate-400 mt-1 mb-4">Menampilkan 20 setoran sampah terakhir Anda.</p>
          <div className="space-y-3">
            {!data?.disposalHistory.length ? (
              <p className="text-sm text-slate-400 py-4 text-center">Belum ada aktivitas setoran sampah.</p>
            ) : (
              data.disposalHistory.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 transition hover:bg-slate-50/30">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold capitalize text-sm text-slate-800">{d.categoryKey}</span>
                      <span className="text-xs font-semibold text-slate-400">× {d.itemCount} unit</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{new Date(d.createdAt).toLocaleDateString("id-ID")}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold text-sm ${d.status === "rejected" ? "line-through text-slate-400" : "text-leaf-700"}`}>
                      +{d.pointsEarned} pts
                    </span>
                    {getDisposalStatusBadge(d.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Tab / Section Riwayat Penukaran (Kupon/Voucher) */}
        <section className="rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5 md:p-8">
          <h2 className="font-display text-xl font-black text-leaf-950">Kupon & Voucher Saya</h2>
          <p className="text-xs text-slate-400 mt-1 mb-4">Tunjukkan kode voucher berikut kepada Admin untuk mengklaim hadiah.</p>
          <div className="space-y-4">
            {!data?.redemptionHistory.length ? (
              <p className="text-sm text-slate-400 py-4 text-center">Belum ada voucher yang ditukarkan.</p>
            ) : (
              data.redemptionHistory.map((r) => (
                <div key={r.id} className="rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-sm text-leaf-950">{r.rewardTitle}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{r.rewardProvider}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-sm text-rose-600">-{r.pointsSpent} pts</span>
                      <div className="mt-1">{getRedemptionStatusBadge(r.status)}</div>
                    </div>
                  </div>

                  {/* Simulasi Barcode & Kode Voucher */}
                  <div className="mt-3.5 flex flex-col items-center justify-center rounded-xl bg-slate-50 p-3 border border-slate-200/50">
                    {/* Visual Barcode simulasi dari CSS */}
                    <div className="flex h-6 w-full max-w-[200px] justify-between overflow-hidden opacity-80">
                      {[1,3,2,1,4,2,3,1,2,4,1,2,3,1,4,2,1,3,2,4].map((w, i) => (
                        <div key={i} className="bg-slate-800" style={{ width: `${w}px` }} />
                      ))}
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-700 tracking-widest mt-2">{r.code}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
