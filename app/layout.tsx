import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { logout } from "@/app/actions";
import { LeafIcon } from "@/components/icons";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eco Tech",
  description: "Aplikasi pengelolaan sampah dan reward berbasis poin."
};

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  return (
    <html lang="id">
      <body className="font-body antialiased">
        <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/80 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="font-display text-xl font-black text-leaf-950 flex items-center gap-1.5">
              <LeafIcon className="text-leaf-700" size={24} /> Eco Tech
            </Link>

            <div className="flex items-center gap-1">
              <Link href="/" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-leaf-50 hover:text-leaf-950">
                Beranda
              </Link>
              <Link href="/disposal" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-leaf-50 hover:text-leaf-950">
                Kamera AI
              </Link>
              <Link href="/rewards" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-leaf-50 hover:text-leaf-950">
                Hadiah
              </Link>
              <Link href="/panduan" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-leaf-50 hover:text-leaf-950">
                Panduan
              </Link>
              <Link href="/leaderboard" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-leaf-50 hover:text-leaf-950">
                Papan Peringkat
              </Link>
              <Link href="/pengaduan" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-leaf-50 hover:text-leaf-950">
                Pengaduan
              </Link>
              {session && session.userId !== "env-admin" && (
                <Link href="/profile" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-leaf-50 hover:text-leaf-950 sm:hidden">
                  Profil
                </Link>
              )}
              {session?.role === "admin" && (
                <Link href="/admin" className="rounded-xl px-3 py-2 text-sm font-semibold text-leaf-700 hover:bg-leaf-50">
                  Admin
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2">
              {session ? (
                <>
                  {session.userId !== "env-admin" && (
                    <Link href="/profile" className="hidden text-sm font-semibold text-slate-700 hover:text-leaf-700 sm:block">
                      {session.name}
                    </Link>
                  )}
                  {session.userId === "env-admin" && (
                    <span className="hidden text-sm font-semibold text-slate-700 sm:block">{session.name}</span>
                  )}
                  <form action={logout}>
                    <button
                      type="submit"
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      Keluar
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-xl bg-leaf-700 px-4 py-2 text-sm font-bold text-white hover:bg-leaf-950"
                >
                  Masuk
                </Link>
              )}
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
