# Dokumentasi Fitur & Alur Kerja (Flow) Sistem Eco Tech

Dokumen ini menyajikan panduan lengkap mengenai seluruh fitur, menu, antarmuka (UI/UX), serta alur kerja (*flow*) sistem Eco Tech, baik dari sudut pandang Pengguna (*User Portal*) maupun Pengelola (*Administrator Dashboard*).

---

## 📂 DAFTAR ISI
1. [Pendahuluan & Konsep Utama](#1-pendahuluan--konsep-utama)
2. [Portal Pengguna (User Portal)](#2-portal-pengguna-user-portal)
   - [A. Beranda (Home Dashboard)](#a-beranda-home-dashboard)
   - [B. Kamera AI (Vision AI Scanner)](#b-kamera-ai-vision-ai-scanner)
   - [C. Katalog Hadiah (Rewards Catalog)](#c-katalog-hadiah-rewards-catalog)
   - [D. Papan Peringkat (Leaderboard - Eco Hero & Eco Region)](#d-papan-peringkat-leaderboard---eco-hero--eco-region)
   - [E. Pengaduan Lingkungan (Complaints)](#e-pengaduan-lingkungan-complaints)
   - [F. Profil Saya (User Profile)](#f-profil-saya-user-profile)
3. [Portal Administrator (Admin Dashboard)](#3-portal-administrator-admin-dashboard)
   - [A. Portal Masuk Khusus (Admin Secure Login)](#a-portal-masuk-khusus-admin-secure-login)
   - [B. Sidebar Navigasi & Simulator Sesi](#b-sidebar-navigasi--simulator-sesi)
   - [C. Tab 1: Ringkasan & Analitik (Overview)](#c-tab-1-ringkasan--analitik-overview)
   - [D. Tab 2: Verifikasi Setoran (Disposals Verification)](#d-tab-2-verifikasi-setoran-disposals-verification)
   - [E. Tab 3: Pengaduan Lingkungan (Complaints Management)](#e-tab-3-pengaduan-lingkungan-complaints-management)
   - [F. Tab 4: Klaim Voucher Hadiah (Voucher Redemption Verification)](#f-tab-4-klaim-voucher-hadiah-voucher-redemption-verification)
   - [G. Tab 5: Laporan Eksekutif & Ekspor Laporan](#g-tab-5-laporan-eksekutif--ekspor-laporan)
   - [H. Tab 6: Kelola Hadiah (Rewards CRUD)](#h-tab-6-kelola-hadiah-rewards-crud)
   - [I. Tab 7: Kelola Panduan & Poin (Guides CRUD)](#i-tab-7-kelola-panduan--poin-guides-crud)
   - [J. Tab 8: Papan Peringkat Admin (Leaderboard Audit)](#j-tab-8-papan-peringkat-admin-leaderboard-audit)
   - [K. Tab 9: Kelola Pengguna (Users Control & Anti-Cheat)](#k-tab-9-kelola-pengguna-users-control--anti-cheat)

---

## 1. PENDAHULUAN & KONSEP UTAMA

Eco Tech adalah platform sirkular ekonomi berbasis web yang bertujuan meningkatkan kesadaran masyarakat terhadap pengelolaan sampah secara mandiri. Konsep dasar platform ini adalah **"Daur Ulang Dapat Poin, Poin Dapat Hadiah"**.

### Kunci Sirkulasi Sistem:
* **Pengumpulan per Item**: Sampah dihitung per unit (item), di mana setiap jenis kategori sampah memiliki bobot nilai poin dasar dan poin per unit yang dinamis dari database.
* **Vision AI**: Menggunakan kecerdasan buatan untuk mengidentifikasi sampah secara instan dari kamera untuk mencegah kesalahan klasifikasi manual.
* **Agregasi Regional**: Data alamat saat pendaftaran diolah untuk memetakan keaktifan daur ulang hingga tingkat administrasi terkecil (RT/RW).

---

## 2. PORTAL PENGGUNA (USER PORTAL)

Portal depan web yang diakses oleh masyarakat umum. Didominasi oleh desain bertema hijau alam, cerah, bersahabat, dan memiliki target ketuk jempol yang responsif di perangkat seluler.

### A. Beranda (Home Dashboard)
* **Deskripsi Fitur**: Menyajikan statistik global daur ulang bagi tamu, serta ringkasan tren kontribusi mingguan personal bagi pengguna terautentikasi.
* **Komponen Visual**:
  * Grafik Batang Tren Pemilahan 7 Hari Terakhir (dilengkapi fitur geser/scroll horizontal di mobile).
  * Tips ramah lingkungan dinamis (tips acak seputar trik mendaur ulang sampah plastik/kertas).
  * Panel riwayat setoran singkat.
* **Alur Kerja (Flow)**:
  1. Pengguna masuk ke halaman utama `/`.
  2. Jika berstatus **Tamu (Guest)**: Sistem menyajikan visual gerakan, panduan, tombol daftar, serta akumulasi total sampah terverifikasi dari seluruh pengguna di database.
  3. Jika berstatus **Pengguna Masuk**: Sistem mengambil data sesi, lalu merender grafik tren kontribusi pribadinya dalam 7 hari terakhir, saldo poin aktifnya saat ini, serta ringkasan 4 setoran terbarunya.

### B. Kamera AI (Vision AI Scanner)
* **Deskripsi Fitur**: Pemindai foto sampah real-time berbasis Vision AI menggunakan kamera ponsel/laptop.
* **Komponen Visual**:
  * Viewport kamera adaptif (rasio potret 3:4 di mobile untuk kenyamanan satu genggaman, 16:9 di desktop).
  * Tombol kuantitas jumbo (target ketuk minimal 48px untuk jempol di perangkat seluler).
  * Banner status "Sampah Tidak Layak Setor" yang tegas jika hasil scan ditolak.
* **Alur Kerja (Flow)**:
  1. Pengguna mengakses `/disposal` (wajib login, jika Tamu otomatis dialihkan ke `/login`).
  2. Klik **Aktifkan Kamera** -> Izinkan akses browser pada kamera perangkat.
  3. Arahkan kamera ke objek sampah, lalu klik **Pindai Cerdas**.
  4. Sistem mengirimkan frame gambar Base64 ke server action `analyzeTrashImage()`.
  5. **Master Prompt AI System** menyaring gambar secara ketat:
     * *Valid*: Sampah botol kosong, kardus lecek, kaleng soda penyok, dedaunan kering, dsb.
     * *Ditolak (isValidTrash = false)*: Wajah manusia/selfie, hewan, barang elektronik utuh (laptop/HP/keyboard), perabotan rumah tangga utuh, atau ruangan kosong bersih.
  6. Jika **Ditolak**: Tampil banner merah berisi alasan penolakan dari AI (misal: *"Gambar ditolak karena mendeteksi wajah manusia"*). Pengguna wajib mengklik *"Scan Sampah Lain"*.
  7. Jika **Diterima**: Tampil detail nama objek, tingkat akurasi (confidence), dan kategori tangkapan. Pengguna mengatur jumlah item yang disetor menggunakan tombol kuantitas (`+` / `-`), lalu mengklik **Ajukan Setoran**.
  8. Setoran masuk ke database dengan status `pending` (menunggu persetujuan admin).

### C. Katalog Hadiah (Rewards Catalog)
* **Deskripsi Fitur**: Tempat menukarkan akumulasi poin dengan voucher belanja, barang daur ulang, atau bibit pohon.
* **Komponen Visual**:
  * Grid kartu hadiah premium dengan foto representatif, provider, dan harga poin.
  * Filter kategori hadiah (Voucher, Barang, Bibit Pohon) yang responsif.
  * Bagi Tamu: Box saldo poin digantikan tombol masuk/daftar. Bagi User: Box saldo poin aktif dinamis.
* **Alur Kerja (Flow)**:
  1. Pengguna masuk ke `/rewards`.
  2. Pilih kategori hadiah yang diinginkan.
  3. Jika saldo poin cukup: Tombol **Tukarkan Hadiah** aktif. Jika tidak cukup: Tombol dinonaktifkan dengan label *"Poin Tidak Cukup"*.
  4. Klik **Tukarkan Hadiah** -> Sistem memvalidasi saldo di database, mengurangi poin pengguna, membuat baris data di tabel `redemptions`, serta menghasilkan kode kupon unik format `ECO-XXXXXX`.
  5. Pengguna diarahkan ke halaman Profil untuk melihat kode voucher tersebut.

### D. Papan Peringkat (Leaderboard - Eco Hero & Eco Region)
* **Deskripsi Fitur**: Kompetisi publik untuk melihat kontributor daur ulang sampah teraktif.
* **Komponen Visual**:
  * Tab switcher: **Individu (Eco Hero)** dan **Kewilayahan (Eco Region)**.
  * Podium visual bertingkat (Juara 1, 2, dan 3) bermahkota lencana Visual Nomor Tanpa Emoji.
  * Pil filter tingkat wilayah (Provinsi, Kabupaten, Kecamatan, Desa, RT/RW/Kampung).
* **Alur Kerja (Flow)**:
  1. Pengguna masuk ke `/leaderboard`.
  2. **Tab Individu**: Sistem menampilkan 10 besar pengguna dengan saldo poin terbanyak. Nama disamarkan sebagian (contoh: `Ma***n`) untuk menjaga kerahasiaan data pribadi.
  3. **Tab Kewilayahan**:
     * Pengguna memilih tingkat wilayah (misal: *Kecamatan*).
     * Sistem memanggil `getRegionalLeaderboard` untuk mengagregasi poin setoran yang disetujui (`status = 'approved'`) dari seluruh user di wilayah tersebut.
     * Render podium juara kecamatan teraktif dan tabel 10 besar di bawahnya.

### E. Pengaduan Lingkungan (Complaints)
* **Deskripsi Fitur**: Media pelaporan pencemaran sungai, udara, atau sampah liar di sekitar pemukiman warga.
* **Komponen Visual**:
  * Formulir input Judul, Deskripsi, Lokasi spesifik, dan Unggahan foto bukti.
  * Riwayat status laporan berbentuk kartu linimasa berkode warna formal tanpa emoji (`Pending` (Abu-abu), `Ditinjau` (Kuning), `Selesai` (Hijau), `Ditolak` (Merah)).
* **Alur Kerja (Flow)**:
  1. Pengguna mengakses `/pengaduan` (wajib login).
  2. Isi seluruh kolom formulir laporan secara lengkap, lalu unggah foto bukti.
  3. Klik **Kirim Laporan** -> Data disimpan di database dan foto diunggah ke S3/R2 storage.
  4. Laporan masuk antrean dengan status `pending` dan tampil di riwayat laporan bawah pengguna.

### F. Profil Saya (User Profile)
* **Deskripsi Fitur**: Pusat data diri, statistik kontribusi personal, dan penyimpanan kupon hadiah aktif.
* **Komponen Visual**:
  * Kartu identitas pengguna (Nama, Email, dan Tanggal Bergabung) yang diambil secara real-time dari database.
  * Metrik pencapaian (Total Poin Disetujui, Item Terverifikasi, Voucher Ditukar).
  * Kupon Voucher Aktif: Menampilkan detail voucher, kode kupon, serta representasi visual barcode garis CSS dinamis berdasarkan data `code`.
* **Alur Kerja (Flow)**:
  1. Pengguna masuk ke `/profile`.
  2. Lihat metrik statistik kontribusi pribadinya sejak terdaftar.
  3. Salin kode kupon `ECO-XXXXXX` atau tunjukkan barcode di halaman profil kepada staf admin/toko fisik untuk mengklaim hadiah nyata.

---

## 3. PORTAL ADMINISTRATOR (ADMIN DASHBOARD)

Portal internal back-office yang diperuntukkan bagi verifikator, staf kebersihan, dan administrator sistem Eco Tech. Memiliki gaya visual gelap cyber, kokoh, dan berorientasi keamanan sistem (*security-first*).

### A. Portal Masuk Khusus (Admin Secure Login)
* **URL Akses**: `/admin/login` (URL terpisah dari user biasa).
* **UI/UX**: Latar belakang abu-abu arang kelam (`bg-slate-955`) dilengkapi ornamen lampu pendaran neon hijau redup, segel tanda keamanan tegas (`PORTAL ADMINISTRATOR - SECURED`), dan **tanpa tombol registrasi** untuk menghindari pendaftaran admin tak dikenal.
* **Alur Kerja (Flow)**:
  1. Staf membuka `/admin/login`.
  2. Masukkan email admin (`admin@ecotech.id`) dan password admin (`admin123`).
  3. Sistem memverifikasi kredensial lewat server action `adminLogin()`. Jika salah atau bukan role admin, akses diblokir.
  4. Jika sukses, token sesi terbuat dengan role `admin` dan staf diarahkan ke `/admin`.

### B. Sidebar Navigasi & Simulator Sesi
* **Deskripsi Fitur**: Panel kontrol kiri permanen di desktop dan laci tarik (drawer) hamburger di mobile yang dilengkapi tombol silang tutup (`X`) fungsional.
* **Simulator User**: Tombol **"Lihat Web (Sebagai User)"** di bagian bawah sidebar.
* **Alur Kerja (Flow)**:
  1. Admin mengklik **"Lihat Web (Sebagai User)"**.
  2. Server action `loginAsDemoUser()` menghancurkan sesi admin aktif, membuat sesi pengguna simulasi baru berlabel `Tester Admin` dengan saldo awal 500 poin dan flag `isSimulated: true`.
  3. Admin dialihkan ke halaman depan user (`/`) untuk bebas melakukan simulasi setoran sampah atau klaim voucher.
  4. Selama sesi simulasi aktif, tombol emas **"Kembali ke Admin"** akan terus melayang di Navbar atas global.
  5. Admin mengklik **"Kembali ke Admin"** -> Sistem memicu `backToAdmin()`, me-reset sesi kembali ke Admin, dan mengarahkannya kembali ke `/admin`.

### C. Tab 1: Ringkasan & Analitik (Overview)
* **Deskripsi Fitur**: Tampilan beranda admin untuk memantau grafik tren pemilahan sampah harian, setoran terbaru masuk, dan pengaduan terbaru masuk.
* **Alur Kerja (Flow)**: Admin masuk pertama kali ke `/admin` -> Meninjau grafik tren dan antrean pekerjaan terbaru di bagian atas secara cepat.

### D. Tab 2: Verifikasi Setoran (Disposals Verification)
* **Deskripsi Fitur**: Modul untuk menyetujui atau menolak setoran sampah pengguna.
* **Alur Kerja (Flow)**:
  1. Admin membuka Tab **Verifikasi Setoran**.
  2. Cari setoran berstatus `pending` (menunggu verifikasi).
  3. Jika data setoran sesuai: Klik **Setujui** -> Status berubah menjadi `approved` dan poin secara otomatis ditambahkan ke saldo akun pengguna di database.
  4. Jika data setoran tidak sesuai (misal: jumlah sampah tidak cocok dengan foto): Klik **Tolak** -> Status berubah menjadi `rejected` dan poin tidak ditambahkan ke akun pengguna.

### E. Tab 3: Pengaduan Lingkungan (Complaints Management)
* **Deskripsi Fitur**: Modul peninjauan pengaduan masyarakat atas tumpukan sampah liar atau pencemaran sungai.
* **Alur Kerja (Flow)**:
  1. Admin membuka Tab **Pengaduan Lingkungan**.
  2. Klik baris laporan -> Tinjau foto bukti pengaduan, judul, dan lokasi spesifik.
  3. Ubah status aduan menjadi `Ditinjau` (*Investigating*) jika staf sedang meluncur ke lokasi.
  4. Tulis catatan admin pada kolom **Catatan Tindakan Admin** (misal: *"Sampah sudah diangkut armada kebersihan pada pukul 10.00 WIB"*).
  5. Klik **Selesaikan Laporan** -> Status di sisi user berubah menjadi `resolved` (Selesai).

### F. Tab 4: Klaim Voucher Hadiah (Voucher Redemption Verification)
* **Deskripsi Fitur**: Modul validasi penukaran kupon fisik yang dibawa oleh pengguna.
* **Alur Kerja (Flow)**:
  1. Pengguna membawa kupon fisik / kode barcode dari `/profile` ke staf admin.
  2. Admin masuk ke Tab **Klaim Voucher Hadiah**.
  3. Cari berdasarkan kode kupon `ECO-XXXXXX` pada form filter pencarian.
  4. Periksa kecocokan data pengguna, jenis voucher, dan provider.
  5. Jika valid: Klik **Selesaikan Klaim** -> Status voucher di database berubah menjadi `completed` (Selesai), menandakan hadiah nyata telah diberikan kepada pengguna dan voucher tidak bisa dipakai kembali.

### G. Tab 5: Laporan Eksekutif & Ekspor Laporan
* **Deskripsi Fitur**: Ringkasan data KPI sirkulasi poin terintegrasi dan analisis wilayah teraktif untuk keperluan rapat dan pengarsipan data.
* **Komponen Visual**:
  * Grid KPI Utama (Total Poin Beredar, Rata-rata Poin User, Rasio Verifikasi, Rasio Penukaran, Rasio Pengaduan).
  * Grid KPI Kewilayahan Teraktif (Provinsi Teraktif, Kabupaten/Kota Teraktif, Kecamatan Teraktif).
  * Rekapitulasi volume sampah terpilah per kategori dan popularitas voucher.
  * Tombol aksi ekspor: **Ekspor Excel (.XLS)**, **Ekspor Word (.DOC)**, dan **Cetak/Simpan PDF**.
* **Alur Kerja (Flow)**:
  1. Admin membuka Tab **Laporan Eksekutif**.
  2. Tinjau rangkuman statistik performa platform secara real-time.
  3. Klik salah satu tombol ekspor (misal: **Ekspor Excel**).
  4. Sistem mengekspor data KPI, visualisasi daerah teraktif, sirkulasi poin, volume sampah, dan top kontributor ke format dokumen pilihan, lalu otomatis mengunduh file tersebut ke komputer lokal admin.

### H. Tab 6: Kelola Hadiah (Rewards CRUD)
* **Deskripsi Fitur**: Pengelolaan katalog hadiah yang tersedia di sisi pengguna.
* **Alur Kerja (Flow)**:
  * *Tambah Hadiah*: Isi form Judul, Provider, Deskripsi, Biaya Poin (*Cost*), Stok awal, dan Kategori -> Klik Simpan. Hadiah langsung muncul di halaman `/rewards` pengguna.
  * *Edit & Hapus*: Mengubah deskripsi, menambah stok gudang, atau menghapus item hadiah yang sudah tidak aktif dari database.

### I. Tab 7: Kelola Panduan & Poin (Guides CRUD)
* **Deskripsi Fitur**: Modul untuk mengatur instruksi pemilahan sampah dan bobot perolehan poin per kategori sampah.
* **Alur Kerja (Flow)**:
  * Admin dapat menyunting nilai **Poin Dasar** (poin awal saat melakukan scan) dan **Poin per Item** (poin tambahan per unit sampah) untuk setiap kategori sampah (seperti Plastik, Kertas, dll).
  * Perubahan nilai poin ini langsung berdampak dinamis pada kalkulasi poin di Kamera AI pengguna dan panduan daur ulang saat itu juga.

### J. Tab 8: Papan Peringkat Admin (Leaderboard Audit)
* **Deskripsi Fitur**: Halaman pemantauan 10 besar pengguna dengan saldo poin terbanyak untuk kebutuhan audit berkala.
* **Alur Kerja (Flow)**: Admin memantau pergerakan nama pengguna riil secara lengkap (tidak disamarkan) untuk mendeteksi apakah ada akun tertentu yang poinnya meningkat secara tidak wajar.

### K. Tab 9: Kelola Pengguna (Users Control & Anti-Cheat)
* **Deskripsi Fitur**: Modul kontrol akun pengguna dan penanganan kecurangan sistem.
* **Alur Kerja (Flow)**:
  * *Pencarian*: Cari pengguna berdasarkan nama atau email.
  * *Penyesuaian Poin Manual*: Admin dapat mengurangi poin pengguna jika terbukti ada setoran sampah yang tidak valid, atau menambahkan poin reward apresiasi khusus.
  * *Blokir Akun*: Klik tombol **Blokir Akun** -> Kolom `isBlocked` di database diatur ke `true`. Pengguna yang bersangkutan otomatis ter-force logout dari platform, tidak bisa masuk kembali, dan namanya dieliminasi dari papan peringkat publik secara instan.
