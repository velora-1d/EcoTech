# Eco Tech

## Deskripsi
Aplikasi pengelolaan sampah berbasis poin. Pengguna mencatat disposal berdasarkan kategori sampah dan menukar poin dengan reward.

## Stack Teknologi
- Frontend: Next.js App Router
- Backend: Next.js Fullstack
- Database: PostgreSQL
- ORM: Drizzle
- Auth: Belum diaktifkan
- Hosting: Vercel atau server Node.js
- Real-time: N/A

## Mode Arsitektur
[x] Next.js Fullstack
[ ] Laravel 13 API + Next.js Frontend
[ ] Lainnya: ___

## Target Platform
[x] Web only
[ ] Mobile only
[ ] Web + Mobile

## Multi-tenant
[ ] Ya
[x] Tidak

## Skala User
[x] Kecil (< 100 user)
[ ] Menengah (< 10.000 user)
[ ] Besar (> 10.000 user)

## Tim
[x] Solo developer
[ ] Tim — jumlah: ___

## Hosting & Infra
- Development: local
- Staging: Vercel preview
- Production: Vercel

## Catatan Khusus
Aplikasi aktif Next.js Fullstack berada langsung di root project. Folder legacy `frontend/`, `backend/`, `ecotech/`, serta folder Python `camera_ai/` telah dihapus sepenuhnya untuk menjaga kerapian struktur proyek monorepo murni Next.js Fullstack.

## Progress Terakhir
2026-06-30 (Pembersihan Emoji Laporan & Optimasi Navigasi Lanjutan):
- Menghapus emoji pada tombol ekspor Laporan Eksekutif admin dan mengganti simbol centang timeline pengaduan menjadi nomor tahap formal.
- Mengoptimalkan Laporan Eksekutif agar PostgreSQL melakukan agregasi KPI, rekap sampah, reward populer, dan top user tanpa mengambil seluruh tabel ke memory Node.js.
- Menghapus dependency `headers()` di root layout dan membatasi middleware hanya ke route `/admin/*` dan `/profile/*` agar navigasi menu publik tidak melewati middleware global yang tidak perlu.
- Build Next.js produksi sukses.

2026-06-30 (Optimasi Load Data, Navigasi, dan Cache Publik):
- Menambahkan cache data publik berbasis tag untuk statistik guest, katalog reward, dan panduan sampah agar navigasi antar menu tidak selalu mengulang query database yang sama.
- Menggabungkan query statistik guest Beranda dari dua query agregasi menjadi satu query agregasi.
- Memindahkan data seed awal reward/panduan ke `lib/seed-data.ts` agar bisa dipakai ulang tanpa duplikasi.
- Menambahkan route GET lokal `/api/regions/*` dengan cache 30 hari untuk data wilayah Indonesia sehingga form registrasi tidak langsung memukul EMSifa dari browser setiap load.
- Menambahkan invalidasi cache via `revalidateTag` saat admin mengubah reward/panduan atau status disposal.
- Build Next.js produksi sukses.

2026-06-30 (Pembersihan Modul Legacy Python & Penyempurnaan Dropdown Berjenjang Indonesia):
- Menghapus folder legacy `camera_ai/` yang berisi kode Python (`main.py`) agar proyek bersih 100% menggunakan arsitektur monorepo murni Next.js Fullstack.
- Menambahkan dropdown select wilayah Indonesia berjenjang (Provinsi -> Kabupaten/Kota -> Kecamatan -> Desa/Kelurahan) yang dinamis via EMSifa API di formulir pendaftaran.
- Menghubungkan penyimpanan wilayah terstruktur pengguna baru ke database Neon PostgreSQL.
- Build Next.js sukses berjalan lancar 100% tanpa ada kesalahan.

2026-06-30 (Optimalisasi Responsif Mobile, Penghapusan Emoji, & Pengamanan Sesi Guest):
- Menyembunyikan total info poin dan menonaktifkan tombol tukar di Katalog Hadiah bagi Guest (wajib masuk log untuk bertransaksi).
- Merapikan kolom input wilayah domisili di form registrasi dengan CSS grid responsif (satu kolom di mobile, dua kolom di desktop).
- Menghapus seluruh emoji teks di seluruh modul halaman utama (Beranda, Profil, Papan Peringkat, Kamera AI, Hadiah, Pengaduan) dan menggantinya dengan ikon kustom SVG formal atau lencana nomor visual premium.
- Memperbesar ukuran ketuk tombol kuantitas Kamera AI menjadi `h-12 w-12` (48px) agar ramah sentuhan jari di HP.
- Menambahkan sistem force logout otomatis jika mendeteksi cookie sesi pengguna lama dari sisa pengujian terdahulu sedangkan datanya kosong/terhapus di database.

## Last Updated
2026-06-30

