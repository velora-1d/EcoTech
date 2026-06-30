"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { register } from "@/app/actions";

type RegionItem = {
  id: string;
  name: string;
};

export default function RegisterForm({ error }: { error?: string }) {
  const [provinces, setProvinces] = useState<RegionItem[]>([]);
  const [regencies, setRegencies] = useState<RegionItem[]>([]);
  const [districts, setDistricts] = useState<RegionItem[]>([]);
  const [villages, setVillages] = useState<RegionItem[]>([]);

  const [loadingReg, setLoadingReg] = useState(false);
  const [loadingDist, setLoadingDist] = useState(false);
  const [loadingVill, setLoadingVill] = useState(false);

  // Ambil data Provinsi Indonesia saat komponen dimuat
  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch((err) => console.error("Gagal memuat provinsi:", err));
  }, []);

  // Handler saat Provinsi berubah
  async function handleProvinceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedOption = e.target.selectedOptions[0];
    const provId = selectedOption.getAttribute("data-id");

    // Reset dropdown di bawahnya
    setRegencies([]);
    setDistricts([]);
    setVillages([]);

    if (!provId) return;

    setLoadingReg(true);
    try {
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provId}.json`);
      const data = await res.json();
      setRegencies(data);
    } catch (err) {
      console.error("Gagal memuat kabupaten:", err);
    } finally {
      setLoadingReg(false);
    }
  }

  // Handler saat Kabupaten/Kota berubah
  async function handleRegencyChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedOption = e.target.selectedOptions[0];
    const regId = selectedOption.getAttribute("data-id");

    setDistricts([]);
    setVillages([]);

    if (!regId) return;

    setLoadingDist(true);
    try {
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regId}.json`);
      const data = await res.json();
      setDistricts(data);
    } catch (err) {
      console.error("Gagal memuat kecamatan:", err);
    } finally {
      setLoadingDist(false);
    }
  }

  // Handler saat Kecamatan berubah
  async function handleDistrictChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedOption = e.target.selectedOptions[0];
    const distId = selectedOption.getAttribute("data-id");

    setVillages([]);

    if (!distId) return;

    setLoadingVill(true);
    try {
      const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${distId}.json`);
      const data = await res.json();
      setVillages(data);
    } catch (err) {
      console.error("Gagal memuat desa:", err);
    } finally {
      setLoadingVill(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-emerald-900/10 bg-white/90 p-6 sm:p-8 shadow-2xl shadow-emerald-900/10 backdrop-blur">
      <h1 className="font-display text-3xl font-black text-leaf-955">Daftar</h1>
      <p className="mt-1 text-sm text-slate-500">Bergabung dan mulai kumpulkan poin hijau.</p>

      {error && (
        <div className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
          {decodeURIComponent(error)}
        </div>
      )}

      <form action={register} className="mt-6 space-y-4">
        {/* Nama */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="name">
            Nama Lengkap
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/20"
            placeholder="Nama lengkapmu"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="email">
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

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/20"
            placeholder="Minimal 6 karakter"
          />
        </div>

        {/* ==================== WILAYAH INDONESIA DROPDOWN ==================== */}
        <div className="border-t border-slate-100 pt-4 space-y-4">
          <h3 className="text-xs font-bold text-leaf-950 uppercase tracking-wider">Informasi Wilayah Domisili</h3>

          {/* 1. Pilih Provinsi */}
          <div>
            <label className="block text-xs font-bold text-slate-500" htmlFor="province">
              Provinsi
            </label>
            <select
              id="province"
              name="province"
              required
              onChange={handleProvinceChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-leaf-500 focus:outline-none"
            >
              <option value="">Pilih Provinsi</option>
              {provinces.map((p) => (
                <option key={p.id} data-id={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Pilih Kabupaten/Kota */}
          <div>
            <label className="block text-xs font-bold text-slate-500" htmlFor="regency">
              Kabupaten / Kota {loadingReg && <span className="text-[10px] text-leaf-700 animate-pulse font-normal">(Memuat...)</span>}
            </label>
            <select
              id="regency"
              name="regency"
              required
              disabled={regencies.length === 0}
              onChange={handleRegencyChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-leaf-500 focus:outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
              <option value="">Pilih Kabupaten / Kota</option>
              {regencies.map((r) => (
                <option key={r.id} data-id={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Pilih Kecamatan */}
          <div>
            <label className="block text-xs font-bold text-slate-500" htmlFor="district">
              Kecamatan {loadingDist && <span className="text-[10px] text-leaf-700 animate-pulse font-normal">(Memuat...)</span>}
            </label>
            <select
              id="district"
              name="district"
              required
              disabled={districts.length === 0}
              onChange={handleDistrictChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-leaf-500 focus:outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
              <option value="">Pilih Kecamatan</option>
              {districts.map((d) => (
                <option key={d.id} data-id={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Pilih Desa/Kelurahan */}
          <div>
            <label className="block text-xs font-bold text-slate-500" htmlFor="village">
              Desa / Kelurahan {loadingVill && <span className="text-[10px] text-leaf-700 animate-pulse font-normal">(Memuat...)</span>}
            </label>
            <select
              id="village"
              name="village"
              required
              disabled={villages.length === 0}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm focus:border-leaf-500 focus:outline-none disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
              <option value="">Pilih Desa / Kelurahan</option>
              {villages.map((v) => (
                <option key={v.id} data-id={v.id} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Input Kampung/Dusun/RT-RW */}
          <div>
            <label className="block text-xs font-bold text-slate-500" htmlFor="hamlet">
              Nama Kampung / Dusun / RT-RW
            </label>
            <input
              id="hamlet"
              name="hamlet"
              type="text"
              required
              placeholder="Contoh: Kampung Durian Runtuh RT 02/RW 01"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-leaf-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/20"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-2xl bg-leaf-700 px-5 py-3 font-bold text-white transition hover:bg-leaf-955 active:scale-98 mt-6"
        >
          Buat Akun
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-leaf-700 hover:text-leaf-950">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
