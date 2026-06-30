import Link from "next/link";
import { login } from "@/app/actions";

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="rounded-[2rem] border border-emerald-900/10 bg-white/90 p-8 shadow-2xl shadow-emerald-900/10 backdrop-blur">
          <h1 className="font-display text-3xl font-black text-leaf-950">Masuk</h1>
          <p className="mt-1 text-sm text-slate-500">Selamat datang kembali di Eco Tech.</p>

          {error && (
            <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
              {decodeURIComponent(error)}
            </div>
          )}

          <form action={login} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/20"
                placeholder="kamu@contoh.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/20"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-leaf-700 px-5 py-3 font-bold text-white transition hover:bg-leaf-950"
            >
              Masuk
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-leaf-700 hover:text-leaf-950">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
