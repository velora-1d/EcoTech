# Panduan Fitur & Alur Kerja Sistem Eco Tech

Dokumen ini menyajikan penjelasan lengkap mengenai seluruh fitur, menu halaman, tampilan visual, serta alur penggunaan sistem Eco Tech bagi masyarakat umum (Pengguna) maupun pengelola internal (Administrator) menggunakan bahasa operasional sehari-hari yang mudah dipahami.

---

## 📂 DAFTAR ISI
1. [Prinsip Utama Layanan](#1-prinsip-utama-layanan)
2. [Panduan Menu Pengguna (Aplikasi Warga)](#2-panduan-menu-pengguna-aplikasi-warga)
   - [A. Halaman Utama (Beranda)](#a-halaman-utama-beranda)
   - [B. Kamera Pemindai AI (Pendeteksi Sampah Cerdas)](#b-kamera-pemindai-ai-pendeteksi-sampah-cerdas)
   - [C. Katalog Penukaran Hadiah](#c-katalog-penukaran-hadiah)
   - [D. Papan Peringkat Eco Hero & Kewilayahan](#d-papan-peringkat-eco-hero--kewilayahan)
   - [E. Formulir Laporan Pengaduan Lingkungan](#e-formulir-laporan-pengaduan-lingkungan)
   - [F. Halaman Profil Saya](#f-halaman-profil-saya)
3. [Panduan Portal Pengelola (Dashboard Admin)](#3-panduan-portal-pengelola-dashboard-admin)
   - [A. Portal Masuk Khusus Pengelola](#a-portal-masuk-khusus-pengelola)
   - [B. Menu Navigasi Samping & Mode Simulasi Pengujian](#b-menu-navigasi-samping--mode-simulasi-pengujian)
   - [C. Menu Ringkasan & Analitik Kerja](#c-menu-ringkasan--analitik-kerja)
   - [D. Menu Verifikasi Setoran Sampah Warga](#d-menu-verifikasi-setoran-sampah-warga)
   - [E. Menu Tindak Lanjut Pengaduan Warga](#e-menu-tindak-lanjut-pengaduan-warga)
   - [F. Menu Validasi Klaim Kupon Hadiah](#f-menu-validasi-klaim-kupon-hadiah)
   - [G. Menu Laporan Eksekutif & Unduh Dokumen](#g-menu-laporan-eksekutif--unduh-dokumen)
   - [H. Menu Kelola Katalog Hadiah](#h-menu-kelola-katalog-hadiah)
   - [I. Menu Kelola Aturan Poin & Kategori Sampah](#i-menu-kelola-aturan-poin--kategori-sampah)
   - [J. Menu Audit Papan Peringkat](#j-menu-audit-papan-peringkat)
   - [K. Menu Kelola Akun & Penalti Pemblokiran](#k-menu-kelola-akun--penalti-pemblokiran)

---

## 1. PRINSIP UTAMA LAYANAN

Eco Tech adalah platform digital ramah lingkungan dengan slogan **"Setor Sampah, Kumpulkan Poin, Tukar Hadiah"**. 
* **Perolehan Poin per Unit**: Setiap sampah yang disetorkan dihitung jumlah unitnya. Nilai poin dihitung berdasarkan jenis kategori sampah (seperti plastik, kertas, organik) secara otomatis oleh sistem.
* **Validasi Kejujuran AI**: Kamera pemindai menggunakan kecerdasan buatan untuk memastikan objek yang difoto benar-benar sampah layak daur ulang guna menghindari manipulasi poin.
* **Gotong Royong Daerah**: Data domisili wilayah yang dimasukkan saat pendaftaran digunakan untuk memetakan tingkat kepedulian kebersihan dari skala RT/RW hingga Provinsi.

---

## 2. PANDUAN MENU PENGGUNA (APLIKASI WARGA)

Bagian ini menjelaskan fitur-fitur yang dapat diakses oleh masyarakat umum. Seluruh tampilan portal ini bernuansa hijau alami segar, bersih, dan tombol yang dirancang pas untuk jari ponsel.

### A. Halaman Utama (Beranda)
* **Deskripsi Tampilan**: Halaman penyambung pertama yang menyajikan rangkuman kontribusi kebersihan warga dan tren aktivitas mingguan.
* **Panduan Visual**:
  * Grafik tren pemilahan sampah 7 hari terakhir yang dapat digeser secara horizontal di layar HP.
  * Tips berkala seputar pemilahan sampah ramah lingkungan yang berganti secara otomatis.
  * Rangkuman 4 riwayat setoran terakhir milik pengguna.
* **Alur Penggunaan**:
  1. Warga membuka halaman utama.
  2. **Jika belum masuk akun**: Tampil statistik total sampah yang berhasil dikumpulkan oleh seluruh warga dan ajakan untuk bergabung.
  3. **Jika sudah masuk akun**: Tampil nama sapaan warga, jumlah saldo poin aktif saat ini, grafik perkembangan setoran sampah pribadi selama seminggu terakhir, dan riwayat setoran singkat.

### B. Kamera Pemindai AI (Pendeteksi Sampah Cerdas)
* **Deskripsi Tampilan**: Fitur utama untuk memindai sampah menggunakan kamera HP atau laptop secara langsung.
* **Panduan Visual**:
  * Layar kamera adaptif (berbentuk potret tegak di HP agar mudah digenggam satu tangan).
  * Tombol penambah/pengurang kuantitas berukuran jumbo agar tidak meleset saat ditekan.
  * Banner merah "Sampah Tidak Layak Setor" yang muncul jika objek foto ditolak oleh AI.
* **Alur Penggunaan**:
  1. Warga membuka menu **Kamera AI** (jika belum masuk akun, akan diarahkan untuk login terlebih dahulu).
  2. Tekan tombol **Aktifkan Kamera** dan berikan izin akses kamera pada HP Anda.
  3. Arahkan kamera pada objek sampah yang ingin disetor, lalu tekan tombol **Pindai Cerdas**.
  4. **Penyaringan Sistem AI Anti-Curang**:
     * *Diterima*: Botol plastik kosong, kardus bekas lipatan, kaleng bekas penyok, sisa makanan organik, kertas kering, dsb.
     * *Ditolak*: Wajah/selfie orang, hewan peliharaan, barang elektronik utuh yang bukan sampah (laptop, HP aktif, keyboard), furnitur utuh (meja/kursi), atau ruangan kosong bersih.
  5. Jika **Ditolak**: Muncul alasan penolakan dari sistem (misal: *"Foto ditolak karena berupa wajah manusia"*). Warga wajib menekan tombol *"Scan Sampah Lain"* untuk mengulang.
  6. Jika **Diterima**: Tampil nama benda yang dikenali dan tingkat kecocokannya. Masukkan jumlah unit sampah yang disetorkan menggunakan tombol tambah/kurang (`+` / `-`), lalu tekan **Ajukan Setoran**.
  7. Setoran terdaftar dengan status **Menunggu Persetujuan** dari pihak pengelola.

### C. Katalog Penukaran Hadiah
* **Deskripsi Tampilan**: Daftar hadiah menarik yang bisa ditukarkan dengan poin kebersihan yang telah terkumpul.
* **Panduan Visual**:
  * Kotak-kotak pilihan hadiah yang dikelompokkan berdasarkan kategori (Voucher Belanja, Barang Daur Ulang, dan Bibit Pohon).
  * Saldo poin aktif pengguna yang tertera di bagian atas katalog.
* **Alur Penggunaan**:
  1. Warga membuka menu **Hadiah**.
  2. Pilih kategori hadiah yang diinginkan (misalnya: *Bibit Pohon* atau *Voucher E-Wallet*).
  3. Jika poin cukup, tombol **Tukarkan Hadiah** akan aktif. Jika kurang, tombol akan otomatis terkunci dengan keterangan *"Poin Tidak Cukup"*.
  4. Tekan **Tukarkan Hadiah** -> Sistem memotong saldo poin warga dan mengeluarkan kode kupon rahasia berformat `ECO-XXXXXX`.
  5. Warga diarahkan ke halaman profil untuk melihat kode kupon tersebut.

### D. Papan Peringkat Eco Hero & Kewilayahan
* **Deskripsi Tampilan**: Menu kompetisi sehat untuk melihat siapa dan daerah mana yang paling rajin mengumpulkan sampah.
* **Panduan Visual**:
  * Pilihan tab **Individu (Eco Hero)** dan **Kewilayahan (Eco Region)**.
  * Podium visual juara 1, 2, dan 3 bergradasi warna emas, perak, dan perunggu yang rapi.
  * Tombol pilihan daerah (Provinsi, Kabupaten/Kota, Kecamatan, Desa/Kelurahan, Dusun/RT/RW).
* **Alur Penggunaan**:
  1. Warga membuka menu **Papan Peringkat**.
  2. **Pilihan Peringkat Individu**: Menampilkan 10 warga teraktif. Nama warga disamarkan sebagian (seperti `Ma***n` dari `Mahin`) demi menjaga privasi.
  3. **Pilihan Peringkat Kewilayahan**:
     * Warga memilih tingkatan wilayah (misalnya: *Kecamatan*).
     * Tampil podium 3 besar kecamatan teraktif dengan akumulasi setoran sampah terbanyak, serta tabel peringkat 4 hingga 10 di bawahnya secara real-time.

### E. Formulir Laporan Pengaduan Lingkungan
* **Deskripsi Tampilan**: Fitur bagi warga untuk melaporkan adanya pencemaran lingkungan atau tumpukan sampah liar di fasilitas umum.
* **Panduan Visual**:
  * Formulir laporan ringkas dengan kolom judul, deskripsi kronologi, lokasi kejadian, dan tombol unggah foto bukti laporan.
  * Kartu status pengaduan warga berkode warna formal: **Pending (Menunggu)**, **Ditinjau**, **Selesai**, dan **Ditolak**.
* **Alur Penggunaan**:
  1. Warga membuka menu **Pengaduan**.
  2. Tulis judul aduan (misal: *"Tumpukan Sampah Liar di Pinggir Sungai"*), deskripsi detail, lokasi spesifik, dan unggah foto kondisi di lapangan.
  3. Klik **Kirim Laporan** -> Laporan tersimpan di sistem antrean admin. Warga dapat memantau perkembangan status laporan dan tanggapan admin secara real-time pada riwayat aduan di bagian bawah halaman.

### F. Halaman Profil Saya
* **Deskripsi Tampilan**: Kartu identitas digital warga yang merangkum hasil kerja kebersihan dan kupon hadiah yang dimiliki.
* **Panduan Visual**:
  * Kartu identitas berisi Nama, Email, dan Tanggal Bergabung.
  * Tiga kotak metrik pencapaian (Total Poin yang Disetujui, Jumlah Item Sampah Terverifikasi, dan Jumlah Voucher yang Ditukar).
  * Bagian kupon aktif yang menampilkan representasi gambar barcode garis digital.
* **Alur Penggunaan**:
  1. Warga membuka menu **Profil** (dengan mengklik foto/nama di navbar).
  2. Tinjau statistik kontribusi kebersihan yang sudah dilakukan selama bergabung.
  3. Untuk mengklaim hadiah fisik: Tunjukkan kode kupon `ECO-XXXXXX` atau barcode garis di halaman ini kepada petugas pengelola/toko rekanan.

---

## 3. PANDUAN PORTAL PENGELOLA (DASHBOARD ADMIN)

Bagian khusus back-office untuk petugas kebersihan dan staf verifikator internal Eco Tech. Tampilannya bertema gelap cyber yang kokoh dan berorientasi keamanan sistem (*security-first*).

### A. Portal Masuk Khusus Pengelola
* **Alamat Akses**: `/admin/login` (Halaman khusus terpisah dari warga biasa).
* **Alur Penggunaan**:
  1. Petugas membuka alamat `/admin/login`.
  2. Masukkan email khusus admin (`admin@ecotech.id`) dan password admin (`admin123`).
  3. Sistem memverifikasi akses. Jika email/sandi salah atau tidak memiliki peran pengelola, akses ditolak secara otomatis.
  4. Jika sukses, pengelola diarahkan masuk ke Dashboard Admin.

### B. Menu Navigasi Samping & Mode Simulasi Pengujian
* **Deskripsi Tampilan**: Bilah navigasi permanen di sebelah kiri pada komputer, atau laci menu yang ditarik dari kiri atas pada layar HP (dilengkapi tombol silang `X` untuk menutup).
* **Mode Uji Coba (Simulator)**: 
  1. Pengelola menekan tombol **Lihat Web (Sebagai User)** di bagian bawah menu samping.
  2. Sistem mengubah akun pengelola sementara menjadi akun warga tester bernama `Tester Admin` dengan saldo awal 500 poin untuk mempermudah simulasi pengujian.
  3. Pengelola dialihkan ke halaman depan warga dan bebas menguji kamera AI atau menukarkan poin.
  4. Untuk kembali, cukup klik tombol emas melayang **Kembali ke Admin** di navigasi atas untuk memulihkan akun pengelola asli dan kembali ke `/admin`.

### C. Menu Ringkasan & Analitik Kerja
* **Deskripsi Tampilan**: Dashboard utama admin untuk memantau grafik tren pemilahan sampah harian secara agregat, antrean setoran sampah masuk, dan laporan pengaduan terbaru.
* **Alur Penggunaan**: Pengelola membuka menu ini untuk melihat volume pekerjaan masuk hari ini secara cepat.

### D. Menu Verifikasi Setoran Sampah Warga
* **Deskripsi Tampilan**: Pusat kendali persetujuan setoran sampah warga dari Halaman Kamera AI.
* **Alur Penggunaan**:
  1. Pengelola masuk ke menu **Verifikasi Setoran**.
  2. Cari pengajuan setoran warga yang berstatus *Menunggu Persetujuan*.
  3. Bandingkan foto sampah yang dikirim warga dengan data kategori dan jumlah item yang dimasukkan.
  4. Jika data sesuai: Klik **Setujui** -> Poin secara otomatis dikirim ke saldo akun warga tersebut.
  5. Jika data tidak sesuai (curang/jumlah dimanipulasi): Klik **Tolak** -> Pengajuan ditolak dan poin tidak dikirim ke akun warga.

### E. Menu Tindak Lanjut Pengaduan Warga
* **Deskripsi Tampilan**: Pusat penanganan laporan pencemaran lingkungan dari warga.
* **Alur Penggunaan**:
  1. Pengelola masuk ke menu **Pengaduan Lingkungan**.
  2. Tinjau foto laporan kejadian dan lokasi yang dikirim warga.
  3. Jika laporan sedang diproses/staf kebersihan meluncur ke lokasi: Ubah status menjadi **Ditinjau**.
  4. Jika sampah liar sudah dibersihkan/kasus selesai: Ketik catatan penyelesaian (misal: *"Armada sampah dinas kebersihan sudah mengangkut tumpukan sampah"*), lalu klik **Selesaikan Laporan**. Status di sisi warga akan berubah menjadi *Selesai*.

### F. Menu Validasi Klaim Kupon Hadiah
* **Deskripsi Tampilan**: Alat verifikasi kupon penukaran hadiah warga.
* **Alur Penggunaan**:
  1. Warga menyerahkan kode kupon `ECO-XXXXXX` kepada petugas.
  2. Pengelola mengetikkan kode kupon pada kolom pencarian menu **Klaim Voucher Hadiah**.
  3. Periksa kecocokan nama warga dan jenis hadiah yang diklaim.
  4. Jika data kupon terbukti sah dan belum pernah ditukarkan sebelumnya: Berikan hadiah fisik ke warga, lalu klik **Selesaikan Klaim**. Status kupon berubah menjadi *Selesai* dan hangus (tidak bisa diklaim ulang).

### G. Menu Laporan Eksekutif & Unduh Dokumen
* **Deskripsi Tampilan**: Rangkuman data kinerja utama platform dan statistik sirkulasi poin total untuk kebutuhan rapat pengurus kebersihan daerah.
* **Fitur Utama**:
  * Kartu KPI utama (Total poin aktif beredar, rata-rata poin warga, persentase setoran sukses, persentase aduan terselesaikan).
  * **Kartu KPI Kewilayahan**: Menampilkan secara dinamis nama Provinsi Teraktif, Kabupaten/Kota Teraktif, dan Kecamatan Teraktif.
  * Tombol unduh dokumen: **Ekspor ke Excel (.XLS)**, **Ekspor ke Word (.DOC)**, dan **Cetak / Simpan PDF**.
* **Alur Penggunaan**:
  1. Pengelola membuka menu **Laporan Eksekutif**.
  2. Tinjau grafik volume sampah terkumpul per kategori dan daftar voucher hadiah terpopuler.
  3. Tekan tombol ekspor (misal: **Ekspor ke Excel**) -> Sistem mengunduh file laporan lengkap yang merangkum metrik kinerja utama, rekapitulasi sampah, popularitas voucher, kontributor warga teraktif, dan data daerah terajin ke komputer pengelola.

### H. Menu Kelola Hadiah
* **Deskripsi Tampilan**: Tempat untuk menambah, mengubah, atau menghapus item hadiah yang ada di katalog warga.
* **Alur Penggunaan**:
  * *Tambah Hadiah*: Isi form nama hadiah, nama penyedia (merchant/provider), deskripsi hadiah, harga poin penukaran, jumlah stok awal, dan pilih kategori hadiah -> Klik Simpan. Hadiah akan langsung tampil di katalog warga.
  * *Ubah/Hapus*: Memperbarui stok gudang hadiah atau menghapus hadiah yang masa berlakunya sudah habis.

### I. Menu Kelola Aturan Poin & Kategori Sampah
* **Deskripsi Tampilan**: Tempat untuk mengatur jumlah perolehan poin per kategori sampah.
* **Alur Penggunaan**:
  * Pengelola dapat mengubah nilai **Poin Dasar** (poin awal saat melakukan scan foto) dan **Poin per Unit** (poin tambahan per unit sampah) untuk masing-masing kategori sampah (Plastik, Kertas, Logam, Organik).
  * Perubahan ini langsung berlaku secara otomatis pada sistem deteksi kamera AI warga.

### J. Menu Audit Papan Peringkat
* **Deskripsi Tampilan**: Menu untuk melihat 10 besar kontributor warga teraktif secara transparan (tanpa penyamaran bintang) guna kebutuhan audit internal.
* **Alur Penggunaan**: Pengelola memantau dan mengawasi nama-nama warga di papan peringkat teratas untuk mendeteksi potensi penyalahgunaan sistem secara berkala.

### K. Menu Kelola Akun & Penalti Pemblokiran
* **Deskripsi Tampilan**: Tempat pencarian data warga, penyesuaian poin manual, dan penegakan sanksi akun curang.
* **Alur Penggunaan**:
  * *Pencarian*: Cari akun warga berdasarkan nama atau email.
  * *Sesuaikan Poin*: Ketikkan jumlah poin untuk ditambah/dikurangi dari saldo warga (misalnya untuk koreksi kesalahan setoran).
  * *Blokir Akun*: Jika warga terbukti curang (mengunggah foto palsu berulang kali), klik tombol **Blokir Akun**. Sesi masuk warga tersebut akan dibatalkan paksa secara instan, warga tidak dapat login kembali, dan namanya dieliminasi dari papan peringkat publik.
