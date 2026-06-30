import Link from "next/link";
import { eq, ne, desc, and } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getRegionalLeaderboard } from "@/app/actions";
import { LeafIcon, TrophyIcon, UserIcon } from "@/components/icons";

type Props = {
  searchParams: Promise<{
    tab?: string;
    level?: "province" | "regency" | "district" | "village" | "hamlet";
  }>;
};

async function getLeaderboard() {
  if (!db) return [];
  return await db
    .select({
      id: users.id,
      name: users.name,
      points: users.points,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(
      and(
        ne(users.role, "admin"),
        eq(users.isBlocked, false)
      )
    )
    .orderBy(desc(users.points))
    .limit(10);
}

function maskName(name: string) {
  if (name.length <= 2) return name + "**";
  return name.substring(0, 2) + "***" + name.substring(name.length - 1);
}

export default async function LeaderboardPage({ searchParams }: Props) {
  const { tab = "hero", level = "province" } = await searchParams;

  const leaderboardData = await getLeaderboard();
  const regionalData = await getRegionalLeaderboard(level);

  const topThree = leaderboardData.slice(0, 3);
  const restUsers = leaderboardData.slice(3);

  const topThreeRegion = regionalData.slice(0, 3);
  const restRegions = regionalData.slice(3);

  // Helper warna podium
  const podiumStyles = [
    { bg: "bg-amber-50/60 border-amber-300", text: "text-amber-800", badgeBg: "bg-gradient-to-br from-amber-400 to-yellow-600 text-white shadow-lg shadow-amber-400/25", height: "h-40" }, // Juara 1
    { bg: "bg-slate-50/60 border-slate-300", text: "text-slate-800", badgeBg: "bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-lg shadow-slate-400/20", height: "h-32" }, // Juara 2
    { bg: "bg-orange-50/60 border-orange-300", text: "text-orange-800", badgeBg: "bg-gradient-to-br from-orange-400 to-amber-700 text-white shadow-lg shadow-orange-400/20", height: "h-28" }  // Juara 3
  ];

  const levels = [
    { key: "province", label: "Provinsi" },
    { key: "regency", label: "Kabupaten/Kota" },
    { key: "district", label: "Kecamatan" },
    { key: "village", label: "Desa/Kelurahan" },
    { key: "hamlet", label: "Dusun/RT/RW" }
  ];

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display text-4xl font-black tracking-tight text-leaf-955 sm:text-5xl">
          Papan Peringkat Eco Hero
        </h1>
        <p className="mt-3 text-sm text-slate-500 max-w-xl mx-auto font-medium">
          Daftar pahlawan lingkungan teraktif yang berkontribusi menyetor dan memilah sampah daur ulang.
        </p>
      </div>

      {/* Tab Switcher (Eco Hero vs Eco Region) */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200/50">
          <Link
            href="/leaderboard?tab=hero"
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition flex items-center gap-1.5 ${
              tab === "hero"
                ? "bg-white text-leaf-955 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserIcon size={16} />
            Individu (Eco Hero)
          </Link>
          <Link
            href={`/leaderboard?tab=region&level=${level}`}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition flex items-center gap-1.5 ${
              tab === "region"
                ? "bg-white text-leaf-955 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <TrophyIcon size={16} />
            Kewilayahan (Eco Region)
          </Link>
        </div>
      </div>

      {/* TAB 1: INDIVIDU (ECO HERO) */}
      {tab === "hero" && (
        <div className="mt-8">
          {leaderboardData.length === 0 ? (
            <div className="rounded-[2.5rem] bg-emerald-50/50 border border-emerald-900/10 p-12 text-center text-slate-500 font-medium">
              Belum ada pengguna aktif di papan peringkat. Mulai setor sampah pertamamu sekarang!
            </div>
          ) : (
            <div className="space-y-12">
              {/* Podium Juara (Top 3) */}
              <div className="flex flex-col sm:flex-row items-end justify-center gap-6 sm:gap-4 md:gap-8 px-4">
                {/* Juara 2 */}
                {topThree[1] && (
                  <div className="order-2 sm:order-1 flex flex-col items-center w-full sm:w-32 md:w-36">
                    <div className="text-center mb-2">
                      <div className="text-base font-bold text-slate-800 truncate max-w-[120px]">{maskName(topThree[1].name)}</div>
                      <div className="text-xs font-bold text-slate-400">{topThree[1].points} pts</div>
                    </div>
                    <div className={`w-full ${podiumStyles[1].height} ${podiumStyles[1].bg} border-t-4 rounded-t-3xl flex flex-col items-center justify-center gap-3 shadow-lg shadow-slate-100`}>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full font-black text-sm ${podiumStyles[1].badgeBg}`}>
                        2
                      </div>
                      <span className={`font-display text-xs font-black ${podiumStyles[1].text}`}>Juara 2</span>
                    </div>
                  </div>
                )}

                {/* Juara 1 */}
                {topThree[0] && (
                  <div className="order-1 sm:order-2 flex flex-col items-center w-full sm:w-36 md:w-40">
                    <div className="text-center mb-2">
                      <div className="text-lg font-black text-leaf-955 truncate max-w-[140px]">{maskName(topThree[0].name)}</div>
                      <div className="text-xs font-bold text-leaf-700">{topThree[0].points} pts</div>
                    </div>
                    <div className={`w-full ${podiumStyles[0].height} ${podiumStyles[0].bg} border-t-4 rounded-t-[2.5rem] flex flex-col items-center justify-center gap-3 shadow-xl shadow-amber-100 ring-4 ring-amber-400/10`}>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full font-black text-base ring-4 ring-white/40 ${podiumStyles[0].badgeBg}`}>
                        1
                      </div>
                      <span className={`font-display text-sm font-black ${podiumStyles[0].text}`}>Juara 1</span>
                    </div>
                  </div>
                )}

                {/* Juara 3 */}
                {topThree[2] && (
                  <div className="order-3 flex flex-col items-center w-full sm:w-32 md:w-36">
                    <div className="text-center mb-2">
                      <div className="text-base font-bold text-orange-955 truncate max-w-[120px]">{maskName(topThree[2].name)}</div>
                      <div className="text-xs font-bold text-slate-400">{topThree[2].points} pts</div>
                    </div>
                    <div className={`w-full ${podiumStyles[2].height} ${podiumStyles[2].bg} border-t-4 rounded-t-3xl flex flex-col items-center justify-center gap-3 shadow-lg shadow-orange-50`}>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full font-black text-xs ${podiumStyles[2].badgeBg}`}>
                        3
                      </div>
                      <span className={`font-display text-xs font-black ${podiumStyles[2].text}`}>Juara 3</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sisa Peringkat (4 - 10) */}
              {restUsers.length > 0 && (
                <section className="overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white shadow-xl shadow-emerald-900/5">
                  <div className="divide-y divide-slate-100">
                    {restUsers.map((user, idx) => (
                      <div key={user.id} className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50/55">
                        <div className="flex items-center gap-4">
                          <span className="w-6 font-display text-sm font-bold text-slate-400 text-center">{idx + 4}</span>
                          <span className="font-bold text-slate-800 text-sm">{maskName(user.name)}</span>
                        </div>
                        <span className="font-bold text-leaf-700 text-sm">{user.points} pts</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: KEWILAYAHAN (ECO REGION) */}
      {tab === "region" && (
        <div className="mt-8 space-y-6">
          {/* Level Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {levels.map((lvl) => {
              const isSelected = level === lvl.key;
              return (
                <Link
                  key={lvl.key}
                  href={`/leaderboard?tab=region&level=${lvl.key}`}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    isSelected
                      ? "bg-leaf-700 text-white shadow-md shadow-leaf-700/10"
                      : "bg-slate-100 text-slate-650 hover:bg-slate-200"
                  }`}
                >
                  {lvl.label}
                </Link>
              );
            })}
          </div>

          {regionalData.length === 0 ? (
            <div className="rounded-[2.5rem] bg-emerald-50/50 border border-emerald-900/10 p-12 text-center text-slate-500 font-medium">
              Belum ada data setoran dari daerah pada kategori ini. Mulai setor sampah pertamamu sekarang!
            </div>
          ) : (
            <div className="space-y-12 mt-8">
              {/* Podium Juara Wilayah (Top 3) */}
              <div className="flex flex-col sm:flex-row items-end justify-center gap-6 sm:gap-4 md:gap-8 px-4">
                {/* Juara 2 Wilayah */}
                {topThreeRegion[1] && (
                  <div className="order-2 sm:order-1 flex flex-col items-center w-full sm:w-44">
                    <div className="text-center mb-2">
                      <div className="text-sm font-black text-slate-850 truncate max-w-[160px] capitalize">{topThreeRegion[1].regionName.toLowerCase()}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{topThreeRegion[1].userCount} Partisipan</div>
                    </div>
                    <div className={`w-full ${podiumStyles[1].height} ${podiumStyles[1].bg} border-t-4 rounded-t-3xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-slate-100`}>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full font-black text-sm ${podiumStyles[1].badgeBg}`}>
                        2
                      </div>
                      <span className="text-xs font-black text-leaf-750">+{topThreeRegion[1].totalPoints} pts</span>
                    </div>
                  </div>
                )}

                {/* Juara 1 Wilayah */}
                {topThreeRegion[0] && (
                  <div className="order-1 sm:order-2 flex flex-col items-center w-full sm:w-48">
                    <div className="text-center mb-2">
                      <div className="text-base font-black text-leaf-955 truncate max-w-[180px] capitalize">{topThreeRegion[0].regionName.toLowerCase()}</div>
                      <div className="text-[10px] font-bold text-leaf-700 uppercase tracking-wider">{topThreeRegion[0].userCount} Partisipan</div>
                    </div>
                    <div className={`w-full ${podiumStyles[0].height} ${podiumStyles[0].bg} border-t-4 rounded-t-[2.5rem] flex flex-col items-center justify-center gap-2 shadow-xl shadow-amber-100 ring-4 ring-amber-400/10`}>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full font-black text-base ring-4 ring-white/40 ${podiumStyles[0].badgeBg}`}>
                        1
                      </div>
                      <span className="text-sm font-black text-leaf-800">+{topThreeRegion[0].totalPoints} pts</span>
                    </div>
                  </div>
                )}

                {/* Juara 3 Wilayah */}
                {topThreeRegion[2] && (
                  <div className="order-3 flex flex-col items-center w-full sm:w-44">
                    <div className="text-center mb-2">
                      <div className="text-sm font-black text-orange-950 truncate max-w-[160px] capitalize">{topThreeRegion[2].regionName.toLowerCase()}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{topThreeRegion[2].userCount} Partisipan</div>
                    </div>
                    <div className={`w-full ${podiumStyles[2].height} ${podiumStyles[2].bg} border-t-4 rounded-t-3xl flex flex-col items-center justify-center gap-2 shadow-lg shadow-orange-50`}>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full font-black text-xs ${podiumStyles[2].badgeBg}`}>
                        3
                      </div>
                      <span className="text-xs font-black text-leaf-750">+{topThreeRegion[2].totalPoints} pts</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabel Regional Lengkap */}
              <section className="overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white shadow-xl shadow-emerald-900/5">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4 w-16 text-center">No</th>
                        <th className="px-6 py-4">Nama Wilayah</th>
                        <th className="px-6 py-4 text-center">Partisipan</th>
                        <th className="px-6 py-4 text-center">Sampah Disetor</th>
                        <th className="px-6 py-4 text-right">Poin Kewilayahan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {restRegions.map((region, idx) => (
                        <tr key={region.regionName} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-display font-bold text-slate-400 text-center">{idx + 4}</td>
                          <td className="px-6 py-4 font-bold text-slate-800 capitalize">{region.regionName.toLowerCase()}</td>
                          <td className="px-6 py-4 text-center font-semibold text-slate-500">{region.userCount} User</td>
                          <td className="px-6 py-4 text-center font-semibold text-slate-500">{region.totalItems} Unit</td>
                          <td className="px-6 py-4 text-right font-black text-leaf-700">+{region.totalPoints} pts</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
