import { db } from "@/db";
import { trashGuides } from "@/db/schema";
import { ensureInitialSeeds } from "@/app/actions";

async function getGuides() {
  if (!db) return [];
  // Pastikan seed awal ada
  await ensureInitialSeeds();
  return await db.select().from(trashGuides);
}

export default async function PanduanPage() {
  const guides = await getGuides();

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="font-display text-4xl font-black tracking-tight text-leaf-950 sm:text-5xl">
          Panduan Pemilahan Sampah ♻️
        </h1>
        <p className="mt-3 text-lg text-slate-600 max-w-2xl">
          Untuk menjaga lingkungan tetap bersih dan memastikan setoran Anda disetujui oleh admin, ikuti panduan pemilahan dan perhitungan poin di bawah ini.
        </p>
      </div>

      {/* Grid Panduan */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="flex flex-col justify-between overflow-hidden rounded-[2rem] border border-emerald-900/10 bg-white shadow-xl shadow-emerald-900/5 transition hover:-translate-y-1 hover:shadow-emerald-900/10"
          >
            {/* Header Kartu */}
            <div className="bg-leaf-50 px-6 py-5 border-b border-emerald-900/5">
              <span className="inline-block rounded-full bg-leaf-100 px-3 py-1 text-xs font-bold text-leaf-700 capitalize">
                {guide.categoryKey}
              </span>
              <h2 className="mt-2 font-display text-2xl font-black text-leaf-950">
                {guide.title}
              </h2>
            </div>

            {/* Konten Kartu */}
            <div className="flex-1 p-6">
              {/* Info Poin */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 text-center">
                <div>
                  <div className="text-2xl font-black text-leaf-700">+{guide.basePoints}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Poin / Scan</div>
                </div>
                <div className="border-l border-slate-200">
                  <div className="text-2xl font-black text-leaf-700">+{guide.pointsPerItem}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Poin / Item</div>
                </div>
              </div>

              {/* Instruksi */}
              <div className="mt-5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Cara Memilah:
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {guide.instruction}
                </p>
              </div>
            </div>

            {/* Footer Kartu */}
            <div className="bg-slate-50 px-6 py-4 text-xs text-slate-400 border-t border-slate-100 text-center">
              Rumus: {guide.basePoints} + ({guide.pointsPerItem} × jumlah item)
            </div>
          </div>
        ))}

        {guides.length === 0 && (
          <div className="col-span-full rounded-3xl bg-amber-50 p-6 text-center text-amber-800">
            ⚠️ Belum ada panduan pemilahan yang terkonfigurasi di database.
          </div>
        )}
      </div>
    </main>
  );
}
