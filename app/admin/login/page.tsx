import Link from "next/link";
import { adminLogin } from "@/app/actions";
import { LeafIcon } from "@/components/icons";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-955 px-4 py-12 relative overflow-hidden">
      {/* Cyber Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />
      
      {/* Neon Glow Blobs */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl border border-emerald-500/10" />
      <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl border border-teal-500/10" />

      <div className="w-full max-w-md z-10">
        {/* Portal Back-office Header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-950/50 border border-emerald-500/20 text-emerald-500 mb-3 shadow-md shadow-emerald-500/5">
            <LeafIcon size={24} />
          </div>
          <h1 className="font-display text-2xl font-black tracking-tight text-white uppercase">Eco Tech</h1>
          <p className="mt-1 text-xs text-slate-400 font-medium">Sistem Informasi Pengelolaan & Verifikasi Sampah Daerah</p>
        </div>

        {/* Admin Login Card */}
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/80 backdrop-blur-md relative overflow-hidden">
          {/* Cyber Edge Line */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />

          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-black text-white uppercase tracking-wider">Portal Administrator</h2>
            <span className="rounded-full bg-emerald-950 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              Secured
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-450">Akses khusus staf internal verifikator dan admin web Eco Tech.</p>

          {error && (
            <div className="mt-4 rounded-xl bg-red-950/40 border border-red-500/30 p-3.5 text-xs font-semibold text-red-400 leading-relaxed">
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={adminLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="email">
                Email Administrator
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition placeholder-slate-600"
                placeholder="admin@ecotech.id"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="password">
                Sandi Keamanan
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 transition placeholder-slate-700"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 py-3.5 text-center font-bold text-white transition active:scale-95 shadow-lg shadow-emerald-600/10 mt-6 text-sm uppercase tracking-wider"
            >
              Masuk Portal Admin
            </button>
          </form>
        </div>

        {/* Footer Security Watermark */}
        <div className="text-center mt-6 text-[10px] font-black text-slate-650 uppercase tracking-widest select-none">
          Eco Tech Back-Office Operations Secured
        </div>
      </div>
    </main>
  );
}
