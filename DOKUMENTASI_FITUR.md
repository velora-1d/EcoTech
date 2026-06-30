# Panduan Detil & Alur Operasional Sistem Eco Tech (Versi Lengkap)

Dokumen ini menyajikan panduan operasional super detil mengenai seluruh fitur, komponen halaman, elemen tampilan, tombol interaktif, penanganan kesalahan, serta alur kerja (*flow*) langkah-demi-langkah sistem Eco Tech. Dokumen ini ditulis khusus menggunakan bahasa operasional non-teknis agar mudah dipahami oleh pengguna umum (warga) maupun pengelola internal (staf administrator).

---

## 📂 DAFTAR ISI
1. [Prinsip Dasar Layanan Eco Tech](#1-prinsip-dasar-layanan-eco-tech)
2. [Panduan Detil Portal Pengguna (Aplikasi Warga)](#2-panduan-detil-portal-pengguna-aplikasi-warga)
   - [A. Halaman Utama (Beranda)](#a-halaman-utama-beranda)
   - [B. Kamera Pemindai Cerdas (Fitur Deteksi AI)](#b-kamera-pemindai-cerdas-fitur-deteksi-ai)
   - [C. Halaman Katalog Penukaran Hadiah](#c-halaman-katalog-penukaran-hadiah)
   - [D. Papan Peringkat Eco Hero & Kewilayahan](#d-papan-peringkat-eco-hero--kewilayahan)
   - [E. Formulir Laporan Pengaduan Lingkungan](#e-formulir-laporan-pengaduan-lingkungan)
   - [F. Halaman Profil Saya & Penyimpanan Kupon](#f-halaman-profil-saya--penyimpanan-kupon)
3. [Panduan Detil Portal Pengelola (Dashboard Admin)](#3-panduan-detil-portal-pengelola-dashboard-admin)
   - [A. Halaman Masuk Khusus Pengelola](#a-halaman-masuk-khusus-pengelola)
   - [B. Menu Navigasi Samping & Mode Simulasi Pengujian](#b-menu-navigasi-samping--mode-simulasi-pengujian)
   - [C. Menu Ringkasan & Analitik Kerja](#c-menu-ringkasan--analitik-kerja)
   - [D. Menu Verifikasi Setoran Sampah Warga](#d-menu-verifikasi-setoran-sampah-warga)
   - [E. Menu Tindak Lanjut Laporan Pengaduan Warga](#e-menu-tindak-lanjut-laporan-pengaduan-warga)
   - [F. Menu Validasi Klaim Kupon Hadiah](#f-menu-validasi-klaim-kupon-hadiah)
   - [G. Menu Laporan Eksekutif & Unduh Dokumen](#g-menu-laporan-eksekutif--unduh-dokumen)
   - [H. Menu Kelola Katalog Hadiah](#h-menu-kelola-katalog-hadiah)
   - [I. Menu Kelola Aturan Poin & Kategori Sampah](#i-menu-kelola-aturan-poin--kategori-sampah)
   - [J. Menu Audit Papan Peringkat](#j-menu-audit-papan-peringkat)
   - [K. Menu Kelola Akun & Penalti Pemblokiran](#k-menu-kelola-akun--penalti-pemblokiran)

---

## 1. PRINSIP DASAR LAYANAN ECO TECH

Eco Tech adalah sebuah solusi berbasis web untuk mendorong budaya bersih di masyarakat dengan sistem insentif.
* **Perhitungan Poin**: Warga yang memilah sampah dengan benar akan mendapatkan poin setelah setoran mereka disetujui oleh pengelola. Setiap jenis sampah memiliki tarif poin berbeda yang diatur dinamis oleh pengelola.
* **Filter Kejujuran**: Sistem ini dilengkapi dengan pendeteksi otomatis agar warga tidak dapat menyetor benda palsu (misalnya menyetor foto wajah atau barang elektronik utuh) hanya demi mendapatkan poin gratis.
* **Identitas Wilayah**: Saat mendaftar, warga wajib memilih Provinsi, Kabupaten/Kota, Kecamatan, Desa/Kelurahan, dan RT/RW tempat tinggal mereka. Hal ini berguna untuk memantau daerah mana yang paling aktif menjaga kebersihan lingkungan.

---

## 2. PANDUAN DETIL PORTAL PENGGUNA (APLIKASI WARGA)

### A. Halaman Utama (Beranda)
Halaman ini adalah pintu gerbang awal warga saat membuka Eco Tech. Tampilannya cerah dengan dominasi warna hijau alam dan putih bersih.

#### 1. Komponen Tampilan & Tombol
* **Bilah Navigasi Atas (Navbar)**: Berisi logo Eco Tech, tautan menu utama (Beranda, Kamera AI, Hadiah, Panduan, Papan Peringkat, Pengaduan), tombol Profil Saya (jika sudah masuk), dan tombol Masuk/Keluar.
  * *Pembeda Menu Aktif*: Menu yang sedang dibuka akan berwarna hijau gelap tebal dengan latar belakang oval hijau muda lembut. Menu lainnya berwarna abu-abu gelap.
  * *Tombol Hamburger (Mobile)*: Pada layar HP, menu navigasi disembunyikan di dalam tombol tiga garis di pojok kanan atas. Jika ditekan, laci menu akan meluncur ke bawah dan memuat tombol silang (X) yang jelas di bagian atas untuk menutup kembali laci menu.
* **Kotak Ringkasan Sapaan**: Menyapa warga dengan namanya secara ramah (misal: *"Halo, Mahin!"*) dan menunjukkan sisa saldo poin aktif saat ini dalam bentuk angka besar berwarna hijau tua.
* **Grafik Perkembangan Mingguan**: Diagram batang yang menyajikan tren jumlah sampah yang telah disetorkan warga setiap harinya dalam 7 hari terakhir. Pada layar HP, grafik ini dikemas dalam kotak yang dapat digeser ke kanan dan kiri agar tampilannya tidak terpotong.
* **Rangkuman Setoran Terbaru**: Daftar 4 pengajuan setoran sampah terakhir milik warga, lengkap dengan statusnya saat ini.
* **Tips Ramah Lingkungan**: Kotak edukasi di samping halaman yang menampilkan saran pemilahan sampah yang berubah secara otomatis setiap kali halaman dimuat ulang.

#### 2. Alur Kerja (Flow) Penggunaan
##### Skenario A: Warga Belum Masuk Akun (Tamu)
1. Pengguna membuka situs Eco Tech.
2. Halaman menampilkan teks ajakan besar: *"Ubah Sampah Menjadi Poin Hadiah"*.
3. Sistem menyajikan data statistik riil: total poin yang sudah dibagikan kepada seluruh warga dan jumlah sampah terverifikasi yang terkumpul di sistem.
4. Pengguna melihat tombol **Mulai Sekarang** (mengarahkan ke pendaftaran akun) dan **Lihat Cara Kerja** (mengarahkan ke panduan cara memilah).
5. Pada bilah navigasi atas, kotak saldo poin disembunyikan dan diganti dengan tombol **Masuk** berwarna hijau cerah.

##### Skenario B: Warga Sudah Masuk Akun
1. Warga masuk menggunakan email dan kata sandi di halaman login.
2. Halaman otomatis memuat nama warga, saldo poin aktif, grafik tren mingguan miliknya pribadi, dan log riwayat setoran singkat.
3. Warga membaca grafik untuk memantau seberapa rajin aktivitas daur ulangnya minggu ini.
4. Jika ingin menyetor sampah baru, warga mengklik tombol **Kamera AI** di navigasi atas.

---

### B. Kamera Pemindai Cerdas (Fitur Deteksi AI)
Fitur interaktif utama warga untuk mendaftarkan sampah daur ulang secara instan.

#### 1. Komponen Tampilan & Tombol
* **Viewport Kamera**: Jendela tangkapan kamera video. Berbentuk persegi potret (3:4) pada HP agar mudah dioperasikan dengan satu tangan, dan landscape (16:9) pada komputer.
* **Tombol Pengaktif Kamera**: Tombol putih abu-abu bertuliskan **Aktifkan Kamera** atau **Aktifkan Kamera Ulang**.
* **Tombol Pindai Cerdas**: Tombol hijau besar di bawah kamera untuk mengambil gambar dan menganalisisnya.
* **Alat Pengatur Kuantitas (Jumlah Unit)**: Tombol tambah (`+`) dan kurang (`-`) berukuran besar (target sentuh 48px) untuk menentukan berapa unit sampah sejenis yang sedang disetorkan.
* **Banner Hasil Deteksi**:
  * *Deteksi Sukses (Hijau)*: Menampilkan nama benda, akurasi deteksi, dan penjelasan singkat dari kecerdasan buatan.
  * *Deteksi Gagal/Bukan Sampah (Merah)*: Menampilkan pesan penolakan yang tegas tanpa emoji (misal: *"Sampah Tidak Layak Setor: Foto mendeteksi wajah manusia yang tidak dapat didaur ulang"*).
  * *Deteksi Kurang Jelas (Kuning)*: Menampilkan pesan bahwa gambar terlalu buram/gelap.

#### 2. Alur Kerja (Flow) Penggunaan
##### Skenario Sukses Pemindaian
1. Warga menekan menu **Kamera AI** (jika warga adalah Tamu, sistem mendeteksi ketiadaan sesi dan otomatis mengalihkan warga ke halaman login).
2. Warga menekan **Aktifkan Kamera** -> Muncul jendela peringatan browser meminta izin kamera -> Klik **Izinkan (Allow)**.
3. Aliran gambar video kamera muncul pada layar.
4. Warga mendekatkan objek sampah (misalnya botol plastik minuman kosong) ke kamera, kemudian menekan tombol **Pindai Cerdas**.
5. Sistem membekukan gambar video sementara waktu, menampilkan status *"Menganalisis..."*, dan mengirimkan foto ke modul kecerdasan buatan di server.
6. Modul AI mencocokkan gambar dengan panduan di database dan mendeteksi bahwa objek adalah "Botol Plastik Bekas" dengan akurasi 95%.
7. Layar menampilkan banner hijau: *"Kategori Terdeteksi: Plastik (Botol Plastik Aqua) - Akurasi: 95%"*.
8. Warga meletakkan 3 botol sejenis di depan petugas/wadah setor, lalu menekan tombol tambah (`+`) hingga angka menunjukkan `3 unit`.
9. Warga menekan tombol **Ajukan Setoran**.
10. Tampil pesan sukses hijau di layar: *"Setoran berhasil diajukan. Menunggu verifikasi petugas."*
11. Status kamera di-reset ke awal dan warga dapat memindai jenis sampah berikutnya.

##### Skenario Gagal (Kecurangan atau Objek Tidak Valid)
1. Warga mengarahkan kamera ke wajahnya sendiri (swafoto) atau ke arah keyboard komputer utuh di atas meja, kemudian menekan tombol **Pindai Cerdas**.
2. Modul AI di server menganalisis gambar dan mendeteksi adanya wajah/benda elektronik utuh yang tidak termasuk dalam daftar sampah layak daur ulang.
3. AI menetapkan status kelayakan sebagai salah (false) dan menuliskan alasan penolakan.
4. Layar warga menampilkan banner merah tebal: **"Sampah Tidak Layak Setor"** disertai teks penjelasan: *"Gambar ditolak karena terdeteksi berupa wajah manusia / benda utuh layak pakai"*.
5. Tombol *"Ajukan Setoran"* dan pengatur jumlah unit disembunyikan secara total agar warga tidak bisa mendaftarkan setoran curang tersebut.
6. Satu-satunya tombol yang aktif adalah **Scan Sampah Lain** berwarna merah yang jika ditekan akan mengaktifkan kembali aliran video kamera untuk dicoba ulang.

---

### C. Halaman Katalog Penukaran Hadiah
Katalog online tempat menukarkan poin yang telah dikumpulkan warga dengan voucer atau barang fisik.

#### 1. Komponen Tampilan & Tombol
* **Header Saldo Poin**:
  * *User Login*: Menampilkan teks *"Saldo Poin Anda: [Angka Poin] pts"*.
  * *User Tamu*: Menampilkan banner pemberitahuan *"Silakan login terlebih dahulu untuk mulai menukarkan poin"* dilengkapi tombol **Masuk Akun** berwarna putih-hijau yang mencolok.
* **Bilah Filter Kategori**: Tombol pilihan berbentuk kapsul oval untuk menyaring daftar hadiah berdasarkan jenisnya: **Semua**, **Voucher Belanja**, **Barang Daur Ulang**, dan **Bibit Pohon**.
* **Grid Kartu Hadiah**: Setiap kartu memuat foto hadiah, nama voucher/barang, nama penyedia (merchant/provider), harga poin, dan keterangan jumlah stok tersisa.
* **Tombol Aksi**:
  * Hijau Aktif: Teks **"Tukarkan Poin"** (jika poin warga cukup dan stok tersedia).
  * Abu-abu Terkunci: Teks **"Poin Tidak Cukup"** (jika saldo poin kurang).
  * Merah Terkunci: Teks **"Stok Habis"** (jika jumlah stok di gudang bernilai 0).

#### 2. Alur Kerja (Flow) Penggunaan
##### Skenario Sukses Penukaran
1. Warga masuk ke halaman **Hadiah**.
2. Sistem menampilkan sisa saldo poin warga (misal: *800 pts*).
3. Warga melihat voucer *"Voucher Belanja Indomaret Rp50.000"* seharga *500 pts* dengan sisa stok *10 unit*.
4. Tombol **Tukarkan Poin** berwarna hijau menyala. Warga menekan tombol tersebut.
5. Muncul kotak dialog konfirmasi: *"Apakah Anda yakin ingin menukarkan 500 poin untuk Voucher Belanja Indomaret Rp50.000?"*.
6. Warga mengklik **Ya, Tukarkan**.
7. Sistem di server memeriksa ulang saldo poin warga di database (memastikan tidak ada selisih data), mengurangi saldo poin warga sebanyak 500 poin, mengurangi stok voucer dari 10 menjadi 9, serta menghasilkan kode kupon unik (misal: `ECO-HAK7Y2`).
8. Layar menampilkan pesan sukses: *"Penukaran berhasil! Kode voucher Anda adalah ECO-HAK7Y2. Silakan lihat di halaman Profil Anda."*
9. Warga otomatis diarahkan ke halaman Profil untuk melihat daftar kupon aktif miliknya.

##### Skenario Gagal Penukaran (Poin Kurang)
1. Warga memiliki saldo *200 pts*.
2. Warga menginginkan hadiah *"Bibit Pohon Mangga Harum Manis"* seharga *400 pts*.
3. Sistem mendeteksi bahwa saldo poin warga (200) kurang dari harga hadiah (400).
4. Tombol penukaran pada kartu hadiah tersebut otomatis terkunci berwarna abu-abu dengan label teks *"Poin Tidak Cukup"*. Warga tidak dapat mengklik tombol tersebut.

---

### D. Papan Peringkat Eco Hero & Kewilayahan
Halaman kompetisi sosial yang menampilkan siapa saja pengumpul sampah teraktif dan wilayah terbersih.

#### 1. Komponen Tampilan & Tombol
* **Tombol Switcher Tab**: Tombol oval ganda di tengah halaman untuk memilih antara **Individu (Eco Hero)** dan **Kewilayahan (Eco Region)**.
* **Podium Juara (Podium Visual)**: Rupa grafis berbentuk 3 balok berdiri berdampingan:
  * Balok Tengah (Paling Tinggi): Juara 1 (Emas).
  * Balok Kiri (Sedang): Juara 2 (Perak).
  * Balok Kanan (Rendah): Juara 3 (Perunggu).
  * Di atas masing-masing balok tertera nama juara dan jumlah poinnya.
* **Tabel Peringkat (Ranking 4 - 10)**: Daftar baris memanjang ke bawah untuk peringkat sisa, menampilkan nomor peringkat, nama, dan jumlah poin.
* **Bilah Filter Wilayah (Khusus Tab Kewilayahan)**: Baris tombol kapsul bertuliskan **Provinsi**, **Kabupaten/Kota**, **Kecamatan**, **Desa/Kelurahan**, dan **Dusun/RT/RW**.

#### 2. Alur Kerja (Flow) Penggunaan
##### Skenario Melihat Peringkat Warga (Eco Hero)
1. Warga membuka halaman **Papan Peringkat**. Secara default, sistem memuat tab **Individu**.
2. Sistem memilah 10 warga dengan perolehan poin setoran disetujui terbanyak.
3. Pengguna melihat 3 pemenang teratas berdiri di atas podium visual dengan lencana lingkaran nomor 1, 2, dan 3 yang mencolok.
4. Nama warga disamarkan (misal: `Bu***i` untuk `Budi`) demi mematuhi privasi, namun total poinnya tetap tercantum secara transparan.

##### Skenario Melihat Peringkat Daerah (Eco Region)
1. Warga mengklik tab **Kewilayahan (Eco Region)**.
2. Secara default, sistem memuat peringkat tingkat **Provinsi**.
3. Warga dapat melihat Provinsi mana yang paling aktif mengumpulkan poin dari setoran warganya.
4. Warga mengklik tombol filter **Kecamatan**.
5. Sistem secara real-time menghitung akumulasi seluruh poin setoran yang disetujui dari warga yang tinggal di masing-masing kecamatan.
6. Tampilan podium berubah secara dinamis menampilkan 3 kecamatan terajin (misal: Juara 1: *Kecamatan Kebayoran Baru*, Juara 2: *Kecamatan Cilandak*, dst.).
7. Tabel di bawahnya menampilkan data detail: peringkat daerah, nama daerah, jumlah warga aktif di daerah tersebut, total sampah terkumpul (unit), dan total poin wilayah.

---

### E. Formulir Laporan Pengaduan Lingkungan
Media komunikasi bagi warga untuk melaporkan kasus pencemaran lingkungan atau tumpukan sampah liar di area publik.

#### 1. Komponen Tampilan & Tombol
* **Formulir Pengaduan**:
  * Kolom teks: **Judul Pengaduan** (misal: *"Tumpukan Plastik Liar"*).
  * Kolom teks area: **Deskripsi Laporan** (menjelaskan kronologi kejadian secara detil).
  * Kolom teks: **Lokasi Spesifik** (patokan jalan atau koordinat tempat kejadian).
  * Tombol unggah file: **Unggah Foto Bukti** (mendukung format gambar JPG/PNG langsung dari kamera ponsel).
  * Tombol aksi: **Kirim Laporan** berwarna hijau tebal.
* **Status Pengaduan**: Label penanda status laporan di bagian bawah:
  * Abu-abu: **Menunggu Verifikasi** (laporan baru dikirim).
  * Kuning: **Ditinjau oleh Petugas** (staf admin sedang meninjau atau meluncur ke lokasi).
  * Hijau: **Selesai Ditindaklanjuti** (laporan selesai ditangani).
  * Merah: **Laporan Ditolak** (laporan dinilai palsu atau tidak jelas).

#### 2. Alur Kerja (Flow) Penggunaan
##### Skenario Pengajuan Laporan
1. Warga membuka halaman **Pengaduan**.
2. Warga menulis judul laporan, menjelaskan deskripsi pencemaran secara rinci, mengetikkan alamat patokan lokasi kejadian, dan menjepret foto tumpukan sampah menggunakan kamera HP sebagai bukti fisik.
3. Warga menekan tombol **Kirim Laporan**.
4. Sistem memproses unggahan foto, menyimpan laporan ke sistem antrean pengelola, dan menampilkan status sukses: *"Laporan Anda berhasil dikirim. Petugas akan segera meninjau lokasi."*
5. Laporan baru tersebut langsung terdaftar pada daftar riwayat laporan warga di bagian bawah halaman dengan label status abu-abu: **Menunggu Verifikasi**.
6. Warga secara berkala dapat membuka kembali halaman ini untuk melihat apakah status laporannya sudah berubah atau membaca tanggapan tertulis yang diberikan petugas pengelola.

---

### F. Halaman Profil Saya & Penyimpanan Kupon
Halaman khusus warga untuk memantau data diri, melihat pencapaian kebersihan, dan menyimpan kode hadiah yang telah ditukarkan.

#### 1. Komponen Tampilan & Tombol
* **Kotak Identitas Profil**: Menampilkan nama warga, email, dan tanggal pertama kali warga bergabung dengan Eco Tech (diambil langsung secara real-time dari sistem penyimpanan data pusat).
* **Kartu Metrik Pencapaian**: Tiga buah kotak visual:
  * *Total Poin Disetujui*: Jumlah seluruh poin dari setoran sampah yang disetujui petugas.
  * *Item Sampah Terverifikasi*: Jumlah total unit sampah fisik yang telah disetorkan.
  * *Kupon Hadiah Ditukar*: Jumlah voucher yang sudah pernah diklaim warga.
* **Kotak Penyimpanan Kupon**: Menyajikan daftar kupon hadiah aktif yang siap digunakan:
  * Judul voucer dan penyedianya (merchant).
  * Pengurangan poin (warna merah, misal: *-500 pts*).
  * Label status kupon: **Belum Diklaim** (kuning) atau **Selesai** (hijau).
  * **Barcode Garis CSS**: Tampilan visual barcode garis hitam putih yang di-generate dinamis berdasarkan kode unik kupon warga.

#### 2. Alur Kerja (Flow) Penggunaan
1. Warga menekan tombol **Profil** di navigasi atas.
2. Halaman menampilkan seluruh statistik riil dan riwayat setoran sampah miliknya.
3. Warga ingin menggunakan voucer belanja yang telah diklaimnya di supermarket rekanan:
   * Warga membuka Halaman Profil di depan kasir supermarket.
   * Kasir melihat kode kupon `ECO-XXXXXX` atau memindai gambar barcode garis yang ada di layar profil warga.
   * Setelah petugas toko menyelesaikan transaksi klaim di sistem, status kupon di layar HP warga otomatis berubah dari **Belum Diklaim** (kuning) menjadi **Selesai** (hijau) secara real-time.

---

## 3. PANDUAN DETIL PORTAL PENGELOLA (DASHBOARD ADMIN)

Bagian internal sistem yang digunakan oleh petugas kebersihan dan staf verifikator. Portal ini bertema gelap untuk memberikan nuansa back-office yang kaku, aman, dan profesional.

### A. Halaman Masuk Khusus Pengelola
* **Deskripsi Tampilan**: Halaman masuk terisolasi yang hanya dapat diakses melalui alamat khusus `/admin/login`.
* **Alur Kerja (Flow) Penggunaan**:
  1. Petugas membuka alamat `/admin/login` pada browser (jika mencoba membuka `/admin` secara langsung tanpa login, sistem secara otomatis mengalihkan petugas ke `/admin/login`).
  2. Tampilan halaman berwarna hitam Slate kelam dengan garis hijau neon tipis di atas kartu masuk. Tidak ada tombol daftar di halaman ini untuk keamanan sistem.
  3. Petugas memasukkan email administrator (`admin@ecotech.id`) dan sandi administrator (`admin123`), lalu menekan tombol **Masuk Portal Admin**.
  4. Sistem mencocokkan akun dengan daftar admin di server. Jika email atau sandi salah, sistem menampilkan kotak peringatan merah di atas form: *"Email atau sandi salah."*
  5. Jika data benar, sesi pengelola diaktifkan dan petugas langsung diarahkan ke halaman Dashboard Utama `/admin`.

---

### B. Menu Navigasi Samping & Mode Simulasi Pengujian
* **Deskripsi Tampilan**: Bilah navigasi vertikal di sisi kiri layar komputer, atau laci menu samping yang ditarik menggunakan tombol hamburger tiga garis di pojok kiri atas pada layar HP (dilengkapi tombol silang `X` untuk menutup laci menu).
* **Mode Uji Coba (Simulator)**:
  * Di bagian bawah bilah samping, terdapat tombol hijau bertuliskan **Lihat Web (Sebagai User)**.
  * *Alur Kerja*:
    1. Admin menekan **Lihat Web (Sebagai User)**.
    2. Sistem secara instan me-reset sesi aktif admin, login sebagai akun warga tester bernama `Tester Admin` dengan saldo awal *500 poin*, dan mengarahkannya ke halaman depan warga (`/`).
    3. Admin dapat menguji seluruh fungsi warga (seperti memindai sampah dengan kamera AI atau mengklaim voucher) untuk mempermudah deteksi kesalahan tampilan.
    4. Selama mode uji coba aktif, tombol emas **Kembali ke Admin** akan terus melayang di bilah navigasi atas halaman warga.
    5. Admin menekan **Kembali ke Admin** -> Sesi warga tester dihancurkan, sesi admin asli dipulihkan kembali, dan halaman otomatis dialihkan kembali ke Dashboard Admin `/admin`.
* **Tombol Lihat Web Utama**: Di samping tombol keluar, terdapat tombol abu-abu bertuliskan **Lihat Web Utama** yang mengarahkan pengelola untuk melihat halaman beranda warga menggunakan peran administrator aslinya saat ini.

---

### C. Menu Ringkasan & Analitik Kerja
* **Deskripsi Tampilan**: Tab default dashboard admin yang menyajikan visualisasi data operasional harian secara cepat.
* **Komponen Visual**:
  * Angka statistik jumlah warga terdaftar, total pengajuan sampah menunggu verifikasi, dan jumlah laporan pengaduan aktif.
  * Tabel ringkasan berisi 5 antrean setoran sampah terbaru warga dan 5 log laporan pengaduan terbaru masuk.
* **Alur Kerja (Flow)**: Pengelola membuka menu ringkasan ini setiap pagi untuk memantau seberapa banyak setoran sampah pending yang harus segera diverifikasi oleh tim kebersihan hari ini.

---

### D. Menu Verifikasi Setoran Sampah Warga
* **Deskripsi Tampilan**: Tab kedua dashboard admin untuk mengelola pengajuan setoran sampah warga dari Kamera AI.
* **Komponen Tampilan**:
  * Form filter untuk mencari nama warga, alamat wilayah, atau menyaring setoran berdasarkan status (Menunggu Persetujuan, Disetujui, Ditolak).
  * Tabel data setoran yang memuat: Nama warga, kategori sampah, jumlah unit yang diklaim warga, nilai potensi poin, tanggal setoran, dan tombol aksi.
* **Alur Kerja (Flow) Persetujuan**:
  1. Pengelola membuka tab **Verifikasi Setoran**.
  2. Pilih baris data setoran berstatus *Menunggu Persetujuan*.
  3. Pengelola membandingkan kuantitas fisik sampah daur ulang yang dibawa warga ke depo kebersihan dengan data pengajuan di layar komputer.
  4. Jika sampah fisik cocok dengan data pengajuan: Klik tombol hijau **Setujui** -> Sistem mengubah status pengajuan menjadi *"Disetujui"*, menghitung poin, dan otomatis mengirimkan poin tersebut ke saldo akun warga bersangkutan secara instan.
  5. Jika sampah fisik tidak cocok (atau warga sengaja memanipulasi jumlah unit): Klik tombol merah **Tolak** -> Sistem membatalkan pengajuan dan status berubah menjadi *"Ditolak"*. Tidak ada poin yang terkirim ke saldo warga.

---

### E. Menu Tindak Lanjut Laporan Pengaduan Warga
* **Deskripsi Tampilan**: Tab ketiga dashboard untuk memantau dan menindaklanjuti laporan pencemaran lingkungan atau tumpukan sampah liar dari warga.
* **Komponen Tampilan**:
  * Daftar tabel laporan pengaduan warga.
  * Form tanggapan berisi kolom **Status Laporan** dan kolom teks area **Catatan Tindakan Admin**.
* **Alur Kerja (Flow) Tindak Lanjut**:
  1. Pengelola masuk ke tab **Pengaduan Lingkungan**.
  2. Klik baris laporan warga untuk membuka detail laporan.
  3. Pengelola melihat deskripsi pencemaran, patokan lokasi, serta gambar bukti foto kondisi lapangan.
  4. Jika petugas kebersihan telah dikirim untuk meninjau lokasi: Pengelola mengubah status laporan menjadi **Ditinjau**.
  5. Setelah tumpukan sampah liar di lokasi tersebut selesai diangkut oleh armada truk kebersihan:
     * Pengelola mengubah status laporan menjadi **Selesai**.
     * Pengelola mengetikkan catatan penyelesaian pada kolom *Catatan Tindakan Admin* (misal: *"Tumpukan sampah liar sudah dibersihkan oleh armada kebersihan wilayah Jakarta Selatan pada pukul 14.00 WIB"*).
     * Klik tombol **Simpan Tindakan** -> Status laporan di layar HP warga langsung berubah menjadi hijau (*Selesai*) dan warga dapat membaca catatan penyelesaian tersebut.

---

### F. Menu Validasi Klaim Kupon Hadiah
* **Deskripsi Tampilan**: Tab keempat dashboard admin untuk melayani pencairan voucer/hadiah fisik yang dibawa warga.
* **Alur Kerja (Flow) Validasi**:
  1. Warga datang ke kantor pengelola dengan menunjukkan kode kupon `ECO-XXXXXX` dari HP mereka.
  2. Pengelola masuk ke tab **Klaim Voucher Hadiah** di dashboard admin.
  3. Ketikkan kode kupon yang dibawa warga pada kolom pencarian filter, lalu tekan Enter.
  4. Sistem menyajikan informasi kupon: Nama warga pemilik kupon, nama hadiah (misal: *Voucher Belanja Rp50.000*), merchant penyedia, dan status kupon saat ini (Belum Diklaim / Selesai).
  5. Jika status kupon tertulis **Belum Diklaim**:
     * Pengelola menyerahkan voucher belanja fisik senilai Rp50.000 kepada warga.
     * Pengelola mengklik tombol **Selesaikan Klaim**.
     * Sistem mengubah status kupon di database menjadi *"Selesai"* (kupon langsung hangus dan tidak bisa digunakan kembali untuk mencegah klaim ganda).
  6. Jika status kupon tertulis **Selesai**: Sistem memunculkan pesan peringatan merah: *"Kupon ini sudah pernah diklaim sebelumnya pada [Tanggal]"* dan tombol selesaikan klaim dikunci.

---

### G. Menu Laporan Eksekutif & Unduh Dokumen
* **Deskripsi Tampilan**: Tab kelima dashboard admin yang menyajikan data sirkulasi poin terintegrasi dan analisis performa wilayah untuk pengarsipan dokumen dinas kebersihan.
* **Komponen Visual**:
  * **Kartu KPI Metrik Utama**:
    * *Poin Beredar*: Jumlah saldo aktif seluruh warga di database.
    * *Rata-rata Poin User*: Rasio sebaran poin per individu warga.
    * *Rasio Verifikasi*: Persentase jumlah setoran sampah yang disetujui dibanding total setoran.
    * *Penyelesaian Pengaduan*: Persentase tingkat penanganan kasus sampah liar yang sukses diselesaikan petugas.
  * **Kartu KPI Kewilayahan (Daerah Teraktif)**:
    * *Provinsi Teraktif*: Nama Provinsi dengan setoran sampah terajin.
    * *Kabupaten/Kota Teraktif*: Nama Kabupaten/Kota dengan setoran sampah terajin.
    * *Kecamatan Teraktif*: Nama Kecamatan dengan setoran sampah terajin.
  * **Tombol Aksi Dokumen**:
    * Hijau: **Ekspor ke Excel (.XLS)**
    * Biru: **Ekspor ke Word (.DOC)**
    * Abu-abu Gelap: **Cetak / Simpan PDF**
* **Alur Kerja (Flow) Unduh Laporan**:
  1. Pengelola membuka tab **Laporan Eksekutif**.
  2. Pengelola menekan tombol **Ekspor ke Excel** di bagian bawah halaman.
  3. Sistem secara otomatis menyusun seluruh metrik KPI utama, rekapitulasi volume sampah per kategori, data rewards terpopuler, daftar kontributor warga teraktif, serta analisis tiga wilayah teraktif ke dalam format berkas Excel yang rapi, kemudian otomatis mengunduhnya langsung ke folder Download komputer pengelola.

---

### H. Menu Kelola Hadiah
* **Deskripsi Tampilan**: Tab keenam dashboard admin untuk mengelola stok dan katalog hadiah yang tampil di warga.
* **Alur Kerja (Flow) Pengelolaan**:
  * **Menambah Hadiah Baru**:
    1. Pengelola menekan tombol **Tambah Hadiah**.
    2. Isi kolom formulir: Nama Hadiah (misal: *Voucher Pulsa Rp10.000*), Nama Penyedia/Provider (misal: *Telkomsel*), Deskripsi detail, Biaya Poin (misal: *150 poin*), Jumlah Stok di Gudang (misal: *50 unit*), dan pilih Kategori Hadiah (Voucher).
    3. Klik **Simpan** -> Hadiah baru tersimpan di sistem dan langsung muncul di katalog Hadiah warga secara real-time.
  * **Mengubah & Menghapus Hadiah**:
    1. Klik tombol **Edit** pada salah satu baris hadiah untuk mengubah harga poin, menambah pasokan stok gudang yang menipis, atau memperbarui foto hadiah.
    2. Klik tombol **Hapus** pada baris hadiah untuk menarik hadiah tersebut agar tidak muncul lagi di katalog warga.

---

### I. Menu Kelola Aturan Poin & Kategori Sampah
* **Deskripsi Tampilan**: Tab ketujuh dashboard admin untuk mengkonfigurasi panduan pemilahan sampah dan besaran tarif perolehan poin warga.
* **Alur Kerja (Flow) Pengelolaan**:
  1. Pengelola membuka tab **Kelola Panduan & Poin**.
  2. Pilih salah satu kategori sampah yang ingin disesuaikan (misalnya: *Plastik*).
  3. Klik tombol **Edit Aturan Poin** -> Tampil form berisi:
     * **Poin Dasar**: Nilai poin tetap yang didapatkan warga setiap kali sistem AI sukses memindai foto sampah kategori ini (misal: *5 pts*).
     * **Poin per Unit**: Nilai poin tambahan yang dikalikan dengan jumlah unit sampah yang disetor warga (misal: *10 pts per unit*).
     * **Instruksi Pemilahan**: Teks panduan yang dibaca warga (misal: *"Pastikan botol kosong, tutupnya dilepas, dan diremas terlebih dahulu"*).
  4. Pengelola mengubah nilai Poin per Unit dari 10 menjadi 15, lalu mengklik **Simpan Aturan**.
  5. Aturan baru tersimpan secara permanen. Sejak detik itu, setiap warga yang menyetorkan sampah plastik otomatis mendapatkan perhitungan poin baru (15 poin per unit) secara dinamis.

---

### J. Menu Audit Papan Peringkat
* **Deskripsi Tampilan**: Tab kedelapan dashboard admin untuk memantau aktivitas persaingan poin warga guna mencegah manipulasi.
* **Alur Kerja (Flow) Pengauditan**:
  1. Pengelola membuka tab **Papan Peringkat Admin**.
  2. Tampil tabel 10 besar kontributor warga teraktif dengan nama asli yang terbuka secara penuh tanpa disamarkan bintang (misal: *Mahin Utsman* tampil lengkap, bukan *Ma***n*).
  3. Pengelola secara berkala mengaudit nama-nama tersebut. Jika mendeteksi adanya kejanggalan (misalnya seorang warga mendapatkan 10.000 poin hanya dalam waktu satu hari), pengelola dapat mengklik nama warga tersebut untuk meninjau detail akunnya secara mendalam.

---

### K. Menu Kelola Akun & Penalti Pemblokiran
* **Deskripsi Tampilan**: Tab kesembilan dashboard admin untuk mengelola profil warga, membenahi poin secara manual, dan menegakkan sanksi akun curang.
* **Alur Kerja (Flow) Tindakan**:
  * **Pencarian Akun**:
    1. Ketikkan nama atau email warga pada kolom pencarian di bagian atas, lalu tekan Enter.
    2. Tampil kartu profil lengkap warga beserta alamat domisili (Provinsi hingga RT/RW).
  * **Penyesuaian Saldo Poin Manual**:
    1. Klik tombol **Sesuaikan Poin** pada baris profil warga.
    2. Masukkan jumlah poin (ketik angka positif untuk menambahkan poin apresiasi khusus, atau ketik angka negatif untuk memotong poin akibat koreksi kesalahan setoran).
    3. Klik **Simpan** -> Saldo poin warga di database langsung disesuaikan secara real-time.
  * **Pemblokiran Akun Curang (Sanksi Mutlak)**:
    1. Jika warga terbukti melakukan kecurangan berulang kali (misalnya berulang kali menyetorkan foto yang sama demi mengelabui verifikator):
    2. Pengelola menekan tombol merah **Blokir Akun** pada baris data warga bersangkutan.
    3. Muncul konfirmasi: *"Apakah Anda yakin ingin memblokir akun ini? Warga tidak akan bisa login kembali dan namanya dihapus dari papan peringkat."*
    4. Pengelola mengklik **Ya, Blokir**.
    5. Sistem memperbarui status warga menjadi terblokir di database secara instan.
    6. Efek Samping Pemblokiran:
       * Sesi masuk warga tersebut langsung dibatalkan secara paksa. Jika warga sedang membuka web, ia otomatis terlempar keluar (*force logout*).
       * Warga tidak dapat login kembali dan akan selalu diblokir dengan pesan error: *"Akun Anda telah diblokir karena indikasi kecurangan."*
       * Nama warga tersebut langsung disaring keluar dan dieliminasi dari seluruh daftar Halaman Papan Peringkat publik secara real-time.
