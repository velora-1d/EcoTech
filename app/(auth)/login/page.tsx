import Link from "next/link";
import { login } from "@/app/actions";
import { LeafIcon } from "@/components/icons";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/60 px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute -left-12 -top-12 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute -right-12 -bottom-12 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />

      <div className="w-full max-w-md z-10">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl bg-white border border-emerald-500/10 px-4 py-2 text-sm font-bold text-leaf-700 shadow-sm mb-3 hover:scale-105 transition active:scale-95">
            <LeafIcon size={18} className="text-leaf-700" />
            Kembali ke Beranda
          </Link>
          <h1 className="font-display text-3xl font-black tracking-tight text-leaf-955">Eco Tech</h1>
          <p className="mt-1.5 text-sm text-slate-500 max-w-xs mx-auto">Platform pengelolaan sampah mandiri dan penukaran poin ramah lingkungan.</p>
        </div>

        {/* Login Card */}
        <div className="rounded-[2.5rem] border border-emerald-950/5 bg-white/90 p-8 shadow-2xl shadow-emerald-900/10 backdrop-blur-md">
          <h2 className="font-display text-xl font-black text-leaf-950">Masuk Akun</h2>
          <p className="mt-1 text-xs text-slate-500">Selamat datang kembali! Silakan isi formulir di bawah.</p>

          {error && (
            <div className="mt-4 rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs font-semibold text-red-700 leading-relaxed">
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={login} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider" htmlFor="email">
                Alamat Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 transition placeholder-slate-400"
                placeholder="emailmu@contoh.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 transition placeholder-slate-450"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-leaf-700 hover:bg-leaf-955 py-3.5 text-center font-bold text-white transition active:scale-95 shadow-lg shadow-leaf-700/20 mt-6"
            >
              Masuk Sekarang
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-450">
            Belum punya akun?{" "}
            <Link href="/register" className="font-bold text-leaf-700 hover:text-leaf-950 hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
