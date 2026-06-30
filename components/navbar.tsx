"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LeafIcon } from "@/components/icons";

import { backToAdmin } from "@/app/actions";

type SessionData = {
  userId: string;
  email: string;
  name: string;
  role: string;
  isSimulated?: boolean;
} | null;

type NavbarProps = {
  session: SessionData;
  onLogout: () => Promise<void>;
};

export default function Navbar({ session, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { label: "Beranda", href: "/" },
    { label: "Kamera AI", href: "/disposal" },
    { label: "Hadiah", href: "/rewards" },
    { label: "Panduan", href: "/panduan" },
    { label: "Papan Peringkat", href: "/leaderboard" },
    { label: "Pengaduan", href: "/pengaduan" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="font-display text-xl font-black text-leaf-955 flex items-center gap-1.5 shrink-0 z-55">
          <LeafIcon className="text-leaf-700" size={24} /> Eco Tech
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-leaf-100 text-leaf-955 font-bold"
                    : "text-slate-600 hover:bg-leaf-50 hover:text-leaf-955"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {session && session.userId !== "env-admin" && (
            <Link
              href="/profile"
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                pathname === "/profile"
                  ? "bg-leaf-100 text-leaf-955 font-bold"
                  : "text-slate-600 hover:bg-leaf-50 hover:text-leaf-955"
              }`}
            >
              Profil
            </Link>
          )}
          {session?.role === "admin" && (
            <Link
              href="/admin"
              className="rounded-xl px-3 py-2 text-sm font-semibold text-leaf-700 hover:bg-leaf-50 transition"
            >
              Admin
            </Link>
          )}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {session?.isSimulated && (
            <button
              onClick={async () => {
                await backToAdmin();
              }}
              className="rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2 text-sm font-bold text-white transition active:scale-95 shadow-md shadow-amber-600/10"
            >
              Kembali ke Admin
            </button>
          )}
          {session ? (
            <button
              onClick={() => onLogout()}
              className="rounded-xl bg-slate-900 hover:bg-slate-950 px-4 py-2 text-sm font-bold text-white transition active:scale-95"
            >
              Keluar
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-leaf-700 hover:bg-leaf-955 px-4 py-2 text-sm font-bold text-white transition active:scale-95 shadow-md shadow-leaf-700/10"
            >
              Masuk
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden items-center justify-center p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none z-55 transition"
          aria-label="Toggle Menu"
        >
          <svg className="h-6 w-6 fill-none stroke-current" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer Menu Panel */}
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm transition-opacity md:hidden"
          />

          {/* Drawer Content */}
          <div className="fixed inset-x-4 top-16 z-50 rounded-[2rem] border border-emerald-900/10 bg-white p-6 shadow-2xl transition-all md:hidden animate-in slide-in-from-top-4 duration-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Navigasi Menu</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-650 transition"
                aria-label="Tutup Menu"
              >
                <svg className="h-5 w-5 fill-none stroke-current" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-2xl px-4 py-3.5 text-base font-bold transition ${
                      isActive
                        ? "bg-leaf-100 text-leaf-955 font-black"
                        : "text-slate-700 hover:bg-leaf-50 hover:text-leaf-955"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {session && session.userId !== "env-admin" && (
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className={`rounded-2xl px-4 py-3.5 text-base font-bold transition ${
                    pathname === "/profile"
                      ? "bg-leaf-100 text-leaf-955 font-black"
                      : "text-slate-700 hover:bg-leaf-50 hover:text-leaf-955"
                  }`}
                >
                  Profil Saya
                </Link>
              )}

              {session?.role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl px-4 py-3.5 text-base font-bold text-leaf-700 hover:bg-leaf-50 transition"
                >
                  Dashboard Admin
                </Link>
              )}

              <div className="border-t border-slate-100 pt-4 mt-2 flex flex-col gap-2">
                {session?.isSimulated && (
                  <button
                    onClick={async () => {
                      setIsOpen(false);
                      await backToAdmin();
                    }}
                    className="w-full rounded-2xl bg-amber-600 hover:bg-amber-700 py-3.5 text-center text-sm font-bold text-white transition active:scale-95 shadow-md shadow-amber-600/10 mb-1"
                  >
                    Kembali ke Admin
                  </button>
                )}
                {session ? (
                  <>
                    <div className="px-4 text-xs text-slate-400 font-semibold mb-1">
                      Masuk sebagai: {session.name}
                    </div>
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onLogout();
                      }}
                      className="w-full rounded-2xl bg-slate-900 hover:bg-slate-950 py-3.5 text-center text-sm font-bold text-white transition active:scale-95"
                    >
                      Keluar Akun
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full rounded-2xl bg-leaf-700 hover:bg-leaf-955 py-3.5 text-center text-sm font-black text-white transition active:scale-95 shadow-md shadow-leaf-700/10"
                  >
                    Masuk Akun
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
