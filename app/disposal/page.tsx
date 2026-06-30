import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getCachedTrashGuides } from "@/lib/public-data";
import DisposalClient from "./disposal-client";

export default async function DisposalPage() {
  const session = await getSession();
  if (!session || session.userId === "env-admin") {
    redirect("/login?error=Anda+harus+masuk+terlebih+dahulu+untuk+mengakses+kamera+AI+pemilah+sampah.");
  }

  const guides = await getCachedTrashGuides();

  const formattedGuides = guides.map((g) => ({
    id: g.id,
    categoryKey: g.categoryKey,
    title: g.title,
    pointsPerItem: g.pointsPerItem,
    basePoints: g.basePoints,
    instruction: g.instruction,
  }));

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-4xl font-black tracking-tight text-leaf-950">
          Kamera AI Pemilah Sampah
        </h1>
        <p className="mt-2 text-base text-slate-600 max-w-3xl">
          Gunakan kamera ponsel/laptop Anda untuk memindai sampah. Sistem AI akan mendeteksi kategori sampah secara otomatis dan menghitung estimasi poin Anda berdasarkan aturan poin dinamis dari database.
        </p>
      </div>

      <DisposalClient guides={formattedGuides} />
    </main>
  );
}
