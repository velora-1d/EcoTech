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
2026-06-30 (Pembersihan Modul Legacy Python & Penyempurnaan Dropdown Berjenjang Indonesia):
- Menghapus folder legacy `camera_ai/` yang berisi kode Python (`main.py`) agar proyek bersih 100% menggunakan arsitektur monorepo murni Next.js Fullstack.
- Menambahkan dropdown select wilayah Indonesia berjenjang (Provinsi -> Kabupaten/Kota -> Kecamatan -> Desa/Kelurahan) yang dinamis via EMSifa API di formulir pendaftaran.
- Menghubungkan penyimpanan wilayah terstruktur pengguna baru ke database Neon PostgreSQL.
- Build Next.js sukses berjalan lancar 100% tanpa ada kesalahan.

Task berikutnya:
- Uji coba performa dan integrasi penuh di deployment Vercel.

## Last Updated
2026-06-30



