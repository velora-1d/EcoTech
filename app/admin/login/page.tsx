import Link from "next/link";
import { adminLogin } from "@/app/actions";
import { LeafIcon } from "@/components/icons";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute -right-1/4 -bottom-1/4 h-96 w-96 rounded-full bg-leaf-500/10 blur-3xl" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-950/80 border border-emerald-500/20 px-4 py-2.5 text-sm font-bold text-leaf-400 mb-4">
            <LeafIcon size={20} className="text-leaf-400" />
            Portal Administrator
          </div>
          <h1 className="font-display text-3xl font-black tracking-tight text-white">Eco Tech Admin</h1>
          <p className="mt-2 text-sm text-slate-400">Silakan masuk menggunakan kredensial admin Anda.</p>
        </div>

        <div className="rounded-[2.5rem] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-6 rounded-2xl bg-red-950/50 border border-red-500/20 p-4 text-xs font-semibold text-red-400">
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={adminLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="email">
                Email Admin
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm text-white focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 transition placeholder-slate-700"
                placeholder="admin@ecotech.id"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-sm text-white focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 transition placeholder-slate-700"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-leaf-700 hover:bg-leaf-955 py-3.5 text-center font-bold text-white transition active:scale-95 shadow-lg shadow-leaf-700/20 mt-6"
            >
              Masuk Dashboard
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Bukan administrator?{" "}
          <Link href="/login" className="font-semibold text-leaf-400 hover:underline">
            Masuk Portal Pengguna
          </Link>
        </p>
      </div>
    </main>
  );
}
