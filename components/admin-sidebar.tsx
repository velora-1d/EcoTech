"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LeafIcon,
  TrashIcon,
  MegaphoneIcon,
  TicketIcon,
  ChartIcon,
  UserIcon,
  TrophyIcon,
  SettingsIcon,
  GiftIcon,
  BookOpenIcon
} from "@/components/icons";

type SessionData = {
  userId: string;
  email: string;
  name: string;
  role: string;
} | null;

type AdminSidebarProps = {
  session: { name: string };
  currentTab: string;
  onLogout: () => Promise<void>;
  onSimulateUser: () => Promise<void>;
};

export default function AdminSidebar({ session, currentTab, onLogout, onSimulateUser }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Ringkasan & Analitik", tab: "stats", icon: ChartIcon },
    { label: "Verifikasi Setoran", tab: "disposals", icon: TrashIcon },
    { label: "Pengaduan Lingkungan", tab: "complaints", icon: MegaphoneIcon },
    { label: "Klaim Voucher Hadiah", tab: "redemptions", icon: TicketIcon },
    { label: "Laporan Eksekutif", tab: "reports", icon: ChartIcon },
    { label: "Kelola Hadiah", tab: "rewards", icon: GiftIcon },
    { label: "Kelola Panduan & Poin", tab: "guides", icon: SettingsIcon },
    { label: "Papan Peringkat Admin", tab: "leaderboard", icon: TrophyIcon },
    { label: "Kelola Pengguna", tab: "users", icon: UserIcon },
    { label: "Dokumentasi Fitur", tab: "docs", icon: BookOpenIcon }
  ];

  return (
    <>
      {/* MOBILE TOP BAR (Fixed on Mobile, Hidden on Desktop) */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-40 text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition focus:outline-none"
            aria-label="Open Sidebar"
          >
            <svg className="h-6 w-6 fill-none stroke-current" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-display text-sm font-black tracking-tight text-white flex items-center gap-1.5">
            <LeafIcon className="text-leaf-500" size={16} /> Eco Tech Admin
          </span>
        </div>
        <div className="text-xs text-slate-400 font-bold bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
          Admin: {session.name}
        </div>
      </div>

      {/* MOBILE DRAWER SIDEBAR BACKDROP */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden transition-opacity"
        />
      )}

      {/* SIDEBAR PANEL (Drawer on Mobile, Locked Column on Desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 z-50 print:hidden transform transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header/Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="font-display text-lg font-black tracking-tight text-white flex items-center gap-2">
              <LeafIcon className="text-leaf-500" size={20} /> Eco Tech Admin
            </span>
            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">
              Management Portal
            </p>
          </div>
          {/* Close Button on Mobile Drawer */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition focus:outline-none"
            aria-label="Close Sidebar"
          >
            <svg className="h-5 w-5 fill-none stroke-current" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.tab;
            return (
              <Link
                key={item.tab}
                href={item.tab === "stats" ? "/admin" : `/admin?tab=${item.tab}`}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-leaf-700 text-white shadow-md shadow-leaf-700/20"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer info & Logout button */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
          <div className="px-2 text-xs text-slate-400 font-semibold">
            Masuk sebagai: {session.name}
          </div>
          
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onSimulateUser()}
              className="w-full rounded-xl bg-emerald-800 hover:bg-emerald-700 py-2.5 text-center text-xs font-bold text-white transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              Lihat Web (Sebagai User)
            </button>
            
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/"
                className="flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-750 py-2 text-center text-[10px] font-bold text-slate-300 transition"
              >
                Lihat Web Utama
              </Link>
              <button
                onClick={() => onLogout()}
                className="rounded-xl bg-slate-800 hover:bg-slate-750 py-2 text-center text-[10px] font-bold text-slate-300 transition"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
