import { eq, ne, desc, and } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

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

export default async function LeaderboardPage() {
  const leaderboardData = await getLeaderboard();
  
  const topThree = leaderboardData.slice(0, 3);
  const restUsers = leaderboardData.slice(3);

  // Helper warna podium
  const podiumStyles = [
    { bg: "bg-amber-100 border-amber-300", text: "text-amber-800", medal: "🥇", height: "h-40" }, // Juara 1
    { bg: "bg-slate-100 border-slate-300", text: "text-slate-800", medal: "🥈", height: "h-32" }, // Juara 2
    { bg: "bg-orange-100 border-orange-300", text: "text-orange-800", medal: "🥉", height: "h-28" }  // Juara 3
  ];

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display text-4xl font-black tracking-tight text-leaf-950 sm:text-5xl">
          Papan Peringkat Eco Hero 🏆
        </h1>
        <p className="mt-3 text-lg text-slate-600 max-w-xl mx-auto">
          Pahlawan lingkungan bulan ini dengan kontribusi pemilahan sampah terbesar. Kumpulkan poin dan selamatkan bumi!
        </p>
      </div>

      {leaderboardData.length === 0 ? (
        <div className="mt-12 rounded-[2rem] bg-emerald-50/50 border border-emerald-900/10 p-12 text-center text-slate-500">
          🌱 Belum ada pengguna aktif di papan peringkat. Mulai setor sampah pertamamu sekarang!
        </div>
      ) : (
        <div className="mt-12 space-y-12">
          {/* Podium Juara (Top 3) */}
          <div className="flex flex-col sm:flex-row items-end justify-center gap-6 sm:gap-4 md:gap-8 px-4">
            {/* Juara 2 */}
            {topThree[1] && (
              <div className="order-2 sm:order-1 flex flex-col items-center w-full sm:w-32 md:w-36">
                <div className="text-center mb-2">
                  <div className="text-xl font-bold text-slate-800">{maskName(topThree[1].name)}</div>
                  <div className="text-xs font-bold text-slate-400">{topThree[1].points} pts</div>
                </div>
                <div className={`w-full ${podiumStyles[1].height} ${podiumStyles[1].bg} border-t-4 rounded-t-3xl flex flex-col items-center justify-center shadow-lg shadow-slate-100`}>
                  <span className="text-4xl">{podiumStyles[1].medal}</span>
                  <span className={`mt-2 font-display text-2xl font-black ${podiumStyles[1].text}`}>2nd</span>
                </div>
              </div>
            )}

            {/* Juara 1 */}
            {topThree[0] && (
              <div className="order-1 sm:order-2 flex flex-col items-center w-full sm:w-36 md:w-40">
                <div className="text-center mb-2">
                  <div className="text-2xl font-black text-leaf-950">{maskName(topThree[0].name)}</div>
                  <div className="text-sm font-bold text-leaf-700">{topThree[0].points} pts</div>
                </div>
                <div className={`w-full ${podiumStyles[0].height} ${podiumStyles[0].bg} border-t-4 rounded-t-[2.5rem] flex flex-col items-center justify-center shadow-xl shadow-amber-100 ring-4 ring-amber-400/20`}>
                  <span className="text-5xl">{podiumStyles[0].medal}</span>
                  <span className={`mt-2 font-display text-3xl font-black ${podiumStyles[0].text}`}>1st</span>
                </div>
              </div>
            )}

            {/* Juara 3 */}
            {topThree[2] && (
              <div className="order-3 flex flex-col items-center w-full sm:w-32 md:w-36">
                <div className="text-center mb-2">
                  <div className="text-lg font-bold text-orange-950">{maskName(topThree[2].name)}</div>
                  <div className="text-xs font-bold text-slate-400">{topThree[2].points} pts</div>
                </div>
                <div className={`w-full ${podiumStyles[2].height} ${podiumStyles[2].bg} border-t-4 rounded-t-3xl flex flex-col items-center justify-center shadow-lg shadow-orange-50`}>
                  <span className="text-4xl">{podiumStyles[2].medal}</span>
                  <span className={`mt-2 font-display text-2xl font-black ${podiumStyles[2].text}`}>3rd</span>
                </div>
              </div>
            )}
          </div>

          {/* Sisa Peringkat (4 - 10) */}
          {restUsers.length > 0 && (
            <section className="overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white shadow-xl shadow-emerald-900/5">
              <div className="divide-y divide-slate-100">
                {restUsers.map((user, idx) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50/50"
                  >
                    <div className="flex items-center gap-4">
                      {/* Peringkat */}
                      <span className="w-6 font-display text-sm font-bold text-slate-400 text-center">
                        {idx + 4}
                      </span>
                      {/* Nama */}
                      <span className="font-bold text-slate-800 text-sm">
                        {maskName(user.name)}
                      </span>
                    </div>
                    {/* Skor */}
                    <span className="font-bold text-leaf-700 text-sm">
                      {user.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
