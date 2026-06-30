import { eq } from "drizzle-orm";
import { db } from "@/db";
import { redemptions, rewards, users, trashGuides } from "@/db/schema";
import { getSession } from "@/lib/session";
import { seedRewards, redeemReward } from "@/app/actions";

async function getPageData(userId?: string) {
  if (!db) return { rewardList: [], userPoints: 0, redeemedIds: new Set<string>(), guidesList: [] };
  await seedRewards();

  const [rewardList, userRow, userRedemptions, guidesList] = await Promise.all([
    db.select().from(rewards).orderBy(rewards.cost),
    userId
      ? db.select({ points: users.points }).from(users).where(eq(users.id, userId)).limit(1)
      : Promise.resolve([]),
    userId
      ? db.select({ rewardId: redemptions.rewardId }).from(redemptions).where(eq(redemptions.userId, userId))
      : Promise.resolve([]),
    db.select().from(trashGuides).orderBy(trashGuides.pointsPerItem)
  ]);

  return {
    rewardList,
    userPoints: userRow[0]?.points ?? 0,
    redeemedIds: new Set(userRedemptions.map((r) => r.rewardId)),
    guidesList
  };
}

type Props = { searchParams: Promise<{ error?: string }> };

export default async function RewardsPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const session = await getSession();
  const isRealUser = session && session.userId !== "env-admin";
  const { rewardList, userPoints, redeemedIds, guidesList } = await getPageData(isRealUser ? session.userId : undefined);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-black text-leaf-950">Katalog Hadiah</h1>
          <p className="mt-1 text-sm text-slate-600">Tukarkan poin dengan hadiah pilihanmu.</p>
        </div>
        {isRealUser && (
          <div className="rounded-2xl bg-leaf-950 px-5 py-3 text-center text-white">
            <div className="text-2xl font-black">{userPoints}</div>
            <div className="text-xs text-leaf-100">poin kamu</div>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        {/* Daftar reward */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {rewardList.length === 0 ? (
            <div className="col-span-2 rounded-[1.5rem] border border-emerald-900/10 bg-white p-8 text-center">
              <p className="text-slate-500">Belum ada reward. Atur DATABASE_URL dan jalankan migrasi.</p>
            </div>
          ) : (
            rewardList.map((reward) => {
              const alreadyRedeemed = redeemedIds.has(reward.id);
              const canAfford = isRealUser && userPoints >= reward.cost;

              return (
                <article
                  key={reward.id}
                  className="flex flex-col rounded-[1.5rem] border border-emerald-900/10 bg-white/90 p-5 shadow-lg shadow-emerald-900/5"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-leaf-700">{reward.provider}</div>
                  <h2 className="mt-2 font-display text-lg font-black text-leaf-950">{reward.title}</h2>
                  <p className="mt-1 flex-1 text-sm text-slate-600">{reward.description}</p>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="inline-flex rounded-full bg-leaf-100 px-3 py-1 text-sm font-bold text-leaf-700">
                      {reward.cost} poin
                    </span>

                    {!session ? (
                      <span className="text-xs text-slate-400">Login untuk tukar</span>
                    ) : alreadyRedeemed ? (
                      <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                        Sudah ditukar
                      </span>
                    ) : (
                      <form action={redeemReward.bind(null, reward.id)}>
                        <button
                          type="submit"
                          disabled={!canAfford}
                          className="rounded-xl bg-leaf-700 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-leaf-950 disabled:cursor-not-allowed disabled:opacity-40"
                          title={!canAfford ? `Butuh ${reward.cost - userPoints} poin lagi` : ""}
                        >
                          Tukar
                        </button>
                      </form>
                    )}
                  </div>

                  {reward.validUntil && (
                    <div className="mt-2 text-xs text-slate-400">
                      s/d {new Date(reward.validUntil).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

        {/* Panel tips */}
        <div className="rounded-[1.5rem] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5">
          <h2 className="font-display text-xl font-black">Cara Maksimalkan Poin</h2>
          <ul className="mt-4 space-y-3">
            {guidesList.map((g) => (
              <li key={g.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
                <span className="text-sm text-slate-700 capitalize">1 item {g.title.toLowerCase()}</span>
                <span className="text-sm font-bold text-leaf-700">{g.pointsPerItem} poin</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-2xl bg-leaf-50 p-4 text-sm text-slate-600">
            Tip: Metal dan plastik bersih memberi poin tertinggi. Fokus di sana untuk unlock reward lebih cepat.
          </p>
          {!session && (
            <a href="/register" className="mt-4 block w-full rounded-2xl bg-leaf-700 px-5 py-3 text-center font-bold text-white hover:bg-leaf-950">
              Daftar & Mulai Kumpulkan Poin
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
