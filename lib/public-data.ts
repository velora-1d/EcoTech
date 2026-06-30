import { unstable_cache } from "next/cache";
import { eq, sum } from "drizzle-orm";
import { db } from "@/db";
import { disposals, rewards, trashGuides } from "@/db/schema";
import { SEED_GUIDES, SEED_REWARDS } from "@/lib/seed-data";

async function ensurePublicSeeds() {
  if (!db) return;

  const [rewardRows, guideRows] = await Promise.all([
    db.select({ id: rewards.id }).from(rewards).limit(1),
    db.select({ id: trashGuides.id }).from(trashGuides).limit(1),
  ]);

  await Promise.all([
    rewardRows.length
      ? Promise.resolve()
      : db.insert(rewards).values(SEED_REWARDS.map((r) => ({ ...r, validUntil: new Date("2027-12-31") }))),
    guideRows.length ? Promise.resolve() : db.insert(trashGuides).values(SEED_GUIDES),
  ]);
}

export const getCachedTrashGuides = unstable_cache(
  async () => {
    if (!db) return [];
    await ensurePublicSeeds();
    return db.select().from(trashGuides).orderBy(trashGuides.pointsPerItem);
  },
  ["trash-guides"],
  { revalidate: 3600, tags: ["trash-guides"] }
);

export const getCachedRewards = unstable_cache(
  async () => {
    if (!db) return [];
    await ensurePublicSeeds();
    return db.select().from(rewards).orderBy(rewards.cost);
  },
  ["rewards"],
  { revalidate: 3600, tags: ["rewards"] }
);

export const getCachedGuestStats = unstable_cache(
  async () => {
    if (!db) return { totalVerifiedItems: 0, totalPointsEarned: 0 };

    const [row] = await db
      .select({
        totalVerifiedItems: sum(disposals.itemCount),
        totalPointsEarned: sum(disposals.pointsEarned),
      })
      .from(disposals)
      .where(eq(disposals.status, "approved"));

    return {
      totalVerifiedItems: Number(row?.totalVerifiedItems ?? 0),
      totalPointsEarned: Number(row?.totalPointsEarned ?? 0),
    };
  },
  ["guest-stats"],
  { revalidate: 300, tags: ["guest-stats"] }
);
