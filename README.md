# Eco Tech - Platform Pemilahan Sampah Pintar & Daur Ulang Berbasis Poin

Eco Tech adalah platform manajemen daur ulang sampah pintar modern berbasis web yang memanfaatkan teknologi **Vision AI** untuk mendeteksi dan mengklasifikasikan sampah secara real-time. Platform ini dirancang untuk mendorong partisipasi aktif masyarakat dalam melestarikan lingkungan melalui insentif berupa poin reward yang dapat ditukarkan dengan hadiah menarik.

---

## 🌟 Fitur Utama

### 1. Pemindaian Kamera AI Cerdas (Vision AI Scanner)
* **Klasifikasi Otomatis**: Mendeteksi dan mengelompokkan sampah (seperti Plastik, Kertas, Logam, Organik) secara otomatis melalui kamera perangkat.
* **Filter Anti-Kecurangan (Anti-Cheat)**: Sistem Master Prompt Vision AI secara ketat menyaring dan menolak gambar non-sampah seperti wajah manusia, swafoto (selfie), hewan peliharaan, serta barang elektronik/perabotan utuh non-sampah demi menjaga integritas pembagian poin.

### 2. Papan Peringkat Kewilayahan & Eco Hero
* **Papan Peringkat Individu (Eco Hero)**: Menampilkan 10 besar pengguna teraktif dengan kontribusi daur ulang sampah terbesar secara transparan (disamarkan untuk privasi).
* **Papan Peringkat Kewilayahan (Eco Region)**: Peringkat daerah teraktif bertingkat mulai dari level **Provinsi**, **Kabupaten/Kota**, **Kecamatan**, **Desa/Kelurahan**, hingga tingkat **Dusun/RT/RW/Kampung** secara real-time dari database.

### 3. Pengaduan Lingkungan Terintegrasi
* Pengguna dapat melaporkan tumpukan sampah liar, pencemaran air sungai, atau polusi lingkungan di sekitar mereka.
* Laporan dilengkapi dengan deskripsi, input lokasi manual, dan unggahan foto bukti yang langsung terkirim ke panel administrator untuk ditindaklanjuti.

### 4. Katalog Hadiah & Voucher (Rewards)
* Penukaran poin yang telah dikumpulkan dengan berbagai voucher belanja, barang ramah lingkungan, atau bibit pohon.
* Setiap klaim menghasilkan kode voucher unik berformat barcode representatif untuk proses verifikasi oleh administrator.

### 5. Portal Back-Office Administrator (Slate Cyber Theme)
* Halaman login admin terpisah (`/admin/login`) dengan skema visual gelap cyber yang kaku dan formal.
* Modul verifikasi setoran sampah pengguna, verifikasi klaim voucher, kontrol pemblokiran akun pengguna yang curang, serta manajemen database panduan/hadiah.
* **Laporan Kinerja Eksekutif**: Menyajikan data sirkulasi poin total, rasio keberhasilan, wilayah teraktif, serta ekspor laporan data ke format Excel (.XLS), Word (.DOC), atau Cetak PDF secara langsung.
* **Mode Uji Coba Simulator**: Tombol pintas "Lihat Web (Sebagai User)" untuk menyimulasikan peran sebagai pengguna tester, dilengkapi tombol pintas navigasi "Kembali ke Admin" setelah selesai.

---

## 🛠️ Stack Teknologi

* **Frontend & Backend**: Next.js 15+ (App Router)
* **Styling CSS**: Tailwind CSS (Premium Natural Emerald Theme untuk User / Slate Cyber Dark Theme untuk Admin)
* **Database & ORM**: PostgreSQL (Neon DB) & Drizzle ORM
* **Autentikasi**: Auth.js v5 (Database Session)
* **Penyimpanan Berkas**: Cloudflare R2 / S3-Compatible Storage
* **Kecerdasan Buatan**: OpenAI Compatible Vision API (Qwen-VL-Plus / GPT-4o-mini)

---

## 🚀 Instalasi & Konfigurasi Lokal

1. **Clone Repositori**:
   ```bash
   git clone https://github.com/velora-1d/EcoTech.git
   cd EcoTech
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable (`.env`)**:
   Salin file `.env.example` menjadi `.env` dan sesuaikan nilainya:
   ```env
   # Database Connection
   DATABASE_URL="postgresql://username:password@host/dbname?sslmode=require"

   # AI Vision API
   AI_API_KEY="kunci_api_openai_atau_aliyun_anda"
   AI_API_BASE="https://api.openai.com/v1"
   AI_MODEL="gpt-4o-mini"

   # Cloudflare R2 Storage (S3-Compatible)
   R2_ACCOUNT_ID="your_account_id"
   R2_ACCESS_KEY_ID="your_access_key_id"
   R2_SECRET_ACCESS_KEY="your_secret_access_key"
   R2_BUCKET_NAME="your_bucket_name"
   ```

4. **Migrasi Database**:
   ```bash
   npx drizzle-kit push
   ```

5. **Jalankan Aplikasi**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000).

---

## 🔑 Kredensial Pengujian (Bypass Env)

* **Portal Administrator**: `/admin/login`
* **Email Staf Admin**: `admin@ecotech.id`
* **Kata Sandi Staf Admin**: `admin123`
