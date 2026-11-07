# Panduan Instalasi — Acc Cell WebApp

Link Bio Interaktif + Katalog Smartphone · Cabang Nabire & Serui
Frontend (GitHub Pages) ⇄ Google Apps Script (REST API) + Google Sheets + Google Drive

> © Nabire Kreatif — template berlisensi. Berkas `js/config.js` bebas diedit. Berkas lain **disegel**: bila diubah, halaman akan terkunci.

---

## Isi paket

| Berkas | Untuk apa |
|---|---|
| `acc-cell-frontend.zip` | Website (diunggah ke GitHub Pages). `index.html` ada langsung di dalam ZIP. |
| `Kode.gs`, `Notifikasi.gs`, `CRM.gs`, `Migrasi.gs` | Backend. Ditempel ke editor Google Apps Script. |
| `appsscript.json` | Manifest backend (zona waktu Jayapura + izin akses). |
| `PANDUAN-INSTALASI.md` | Panduan ini. |
| `nk-protect.js` | Khusus penjual (Nabire Kreatif), untuk menyegel ulang bila template diedit. |
| `nk-license-v4.1-footer.js` | Khusus penjual: SDK lisensi versi "mode footer" (belum disegel) untuk menggantikan SDK induk di admin Nabire Kreatif. |

---

## 1. Pasang backend (Google Apps Script)

1. Buka **https://script.google.com** → **Proyek baru**. Beri nama, misalnya `Acc Cell Backend`.
2. Ganti isi `Code.gs` dengan seluruh isi **Kode.gs**. Ganti juga nama berkasnya menjadi `Kode`.
3. Klik **＋ → Skrip** tiga kali untuk membuat `Notifikasi`, `CRM`, dan `Migrasi`. Tempel isi berkas yang sesuai ke masing-masing.
4. Buka **Setelan proyek** (ikon roda gigi) → centang **Tampilkan file manifes "appsscript.json"**. Kembali ke Editor, buka `appsscript.json`, lalu tempel isi **appsscript.json**.
5. Simpan dengan Ctrl+S.
6. Di dropdown fungsi, pilih **`setupAplikasi`** → klik **▶ Jalankan**.
   - Klik **Tinjau izin** → pilih akun Google Anda → **Lanjutan** → **Buka (tidak aman)** → **Izinkan**. Ini normal untuk skrip buatan sendiri.
   - Buka **Log eksekusi**. Di sana tercatat **username `superadmin` dan sandi awal**. Catat sandi itu. Sandi ini hanya muncul di log dan wajib diganti saat login pertama.
   - Setup otomatis membuat folder **📁 Acc Cell WebApp** di Drive (berisi database Sheets dan folder gambar), mengisi **data contoh** (12 produk dengan foto, 3 slide, rekening contoh, QRIS contoh), dan memasang pemicu otomatis tiap 1 menit.
   - `setupAplikasi()` aman dijalankan ulang. Fungsi ini hanya menambahkan yang belum ada, tanpa menggandakan data.
7. **Deploy** → **Deployment baru** → ikon roda gigi → **Aplikasi web**:
   - *Jalankan sebagai*: **Saya**
   - *Yang memiliki akses*: **Siapa saja**
   - Klik **Deploy**, lalu **salin URL yang berakhiran `/exec`**.

> ⚠️ Setiap kali kode backend diubah: **Deploy → Kelola deployment → ✏️ Edit → Versi: Versi baru → Deploy**. Jangan membuat "Deployment baru", karena URL-nya akan berubah dan website berhenti tersambung.

---

## 2. Hubungkan frontend

1. Ekstrak `acc-cell-frontend.zip`. **Folder hasil ekstrak itulah folder proyek**: di dalamnya langsung terlihat `index.html`, `css/`, `js/`, dan `assets/`.
2. Buka `js/config.js` dengan Notepad, lalu tempel URL `/exec` di antara tanda kutip:
   ```js
   GAS_URL: 'https://script.google.com/macros/s/AKfycb.../exec',
   NAMA_USAHA: 'Acc Cell',
   ```
3. Simpan. Bila `GAS_URL` kosong, website tetap tampil dalam **mode demo** memakai data contoh bawaan.

---

## 3. Unggah ke GitHub Pages (lewat terminal)

> Jangan memakai tombol "Upload files" di web GitHub, karena struktur folder `css/` dan `js/` akan rusak.

1. Pasang Git: https://git-scm.com/download/win (pengaturan bawaan). Buka **PowerShell**.
2. Atur identitas Git (cukup sekali seumur komputer):
   ```bash
   git config --global user.name "Nama Anda"
   git config --global user.email "email-github@anda.com"
   ```
3. Di github.com: **＋ → New repository** → beri nama `acc-cell` → pilih **Public** → **jangan** centang README → **Create**.
4. Masuk ke folder hasil ekstrak (yang berisi `index.html`):
   ```bash
   cd "C:\Users\NamaAnda\Downloads\acc-cell-frontend"
   dir
   ```
   Pastikan `index.html` terlihat di daftar. Bila yang terlihat justru sebuah folder, masuk dulu ke folder itu dengan `cd`.
5. Kirim ke GitHub, satu perintah per baris:
   ```bash
   git init
   git add .
   git commit -m "Upload pertama Acc Cell"
   git branch -M main
   git remote add origin https://github.com/USERNAME/acc-cell.git
   git push -u origin main
   ```
   Saat diminta **Password**, tempel **Personal Access Token**, bukan sandi akun GitHub. Buat tokennya di https://github.com/settings/tokens → *Generate new token (classic)* → centang **repo**. Saat token ditempel, layar memang terlihat kosong; itu normal.
6. Di repo GitHub: **Settings → Pages → Deploy from a branch → main → / (root) → Save**. Centang **Enforce HTTPS**.
7. Tunggu 1–2 menit. Website tampil di `https://USERNAME.github.io/acc-cell/`.

**Update berikutnya:**
```bash
git add .
git commit -m "Perbarui"
git push
```
Bila yang tampil masih versi lama, tekan **Ctrl+Shift+R**.

---

## 4. Langkah pertama setelah online

1. Buka **halaman admin tersendiri**: `https://USERNAME.github.io/acc-cell/admin/`. Halaman ini tidak ditautkan dari halaman publik, jadi **simpan sebagai bookmark**. Login sebagai `superadmin` dengan sandi dari Log, lalu ganti sandi saat diminta.
2. **Rekening & QRIS** → ganti semua data **CONTOH** dengan rekening dan QRIS asli toko. Unggah gambar QRIS asli. Ini penting untuk mencegah penipuan.
3. **Cabang & Sosmed** → periksa alamat, nomor WA admin (Nabire 082197649558, Serui 081248245606), dan link Google Maps. Untuk peta mini: Google Maps → Bagikan → Sematkan peta → Salin HTML → tempel.
4. **Admin & Akses** → buat akun **admin_nabire** dan **admin_serui** (isi nomor WA agar ikut menerima notifikasi). Admin cabang hanya bisa mengelola produk cabangnya sendiri.
5. **Produk** → hapus produk contoh atau ganti dengan foto asli. Foto otomatis dikompres sebelum diunggah ke Drive.
6. **Tampilan & Teks → Bagian Link Bio** → setiap bagian link bio (Profil, Slide Hero, Kartu Promo, Tombol Menu, **Slide Produk Pilihan**, Sosial Media, Cabang) bisa digeser naik/turun dengan ▲▼, dinyalakan/dimatikan dengan saklar, dan diubah isinya lewat tombol **Atur**. Klik **Simpan Urutan** setelah mengubah urutan.
   - **Slide Produk Pilihan** menampilkan produk acak (yang tersedia) yang bisa digeser, plus tombol **Lihat semua**. Judul dan jumlahnya diatur lewat **Atur**.
   - **Sosial media** punya 2 gaya: **Tombol lebar** atau **Ikon bulat**. Pilih di **Cabang & Sosmed**, atau lewat **Atur** pada bagian Sosial Media.
   - Menambah sosial media dari HP: pilih platform, lalu cukup ketik **@username** (atau tekan **Tempel**). Tautan lengkap dibuat otomatis dan tampil sebelum disimpan.
7. **Pop-up Promo** dan **Slide Hero** → atur promo. Pop-up bisa dinyalakan atau dimatikan kapan saja.
8. Pasang link website di bio TikTok, Instagram, Facebook, dan WhatsApp Business.

> Di halaman publik, tombol **Menu** (navigasi bawah) membuka semua menu untuk pengunjung: Beranda, Semua Produk, HP Baru, HP Second, Aksesoris, Rekening & QRIS, Servis & Tukar Tambah, Chat Admin, Bagikan, dan sosial media. Katalog punya tombol **Filter** (lokasi toko, kategori, urutan harga/terbaru, sembunyikan stok habis).

---

## 4b. Atur SEMUA tampilan link bio (menu **Tampilan & Teks**)

Template ini bisa dipakai untuk jenis usaha apa pun (toko HP, kuliner, fesyen, jasa, dll). Menu **Tampilan & Teks** punya 5 tab. Setiap tab punya tombol **Simpan**, dan perubahan langsung tampil di link bio. Pengunjung yang sedang membuka situs akan melihatnya paling lambat ±1 menit kemudian.

| Tab | Yang bisa diatur |
|---|---|
| **Bagian Link Bio** | Urutan bagian (▲▼), saklar on/off, dan isi tiap bagian lewat **Atur**: profil, slide promo, kartu promo, tombol menu, slide produk, sosial media, lokasi toko, dan **FAQ (Tanya Jawab)**. |
| **Menu** | Semua menu link bio, yang aktif maupun yang mati. Saklar = tampil/sembunyi di link bio dan lembar Menu. Menu bisa diubah nama, keterangan, dan ikonnya, serta diurutkan. **Tambah Menu** untuk membuat menu sendiri: isi nama, pilih ikon, lalu pilih tujuannya (lihat di bawah). Perubahan langsung tersimpan. |
| **Header & Navigasi** | Saklar header on/off, logo header, dan nama di header. **Tombol di header: maksimal 2 aktif**, dipilih dari semua menu (CS, Install, Mode gelap, Bagikan, Menu, atau menu buatan sendiri). **Tombol navigasi bawah: maksimal 5 aktif**, juga dipilih dari semua menu. Nama dan ikon tiap tombol bisa diganti, ada pratinjau langsung. |
| **Warna & Tema** | 8 pilihan warna cepat, atau atur sendiri 11 warna (tombol utama, teks, latar, kartu, garis, header, harga, tombol WA, tombol sosmed). Ada tombol **Kembalikan bawaan** dan pilihan tema bawaan untuk pengunjung (terang / gelap / ikuti HP). Tombol mode gelap dipasang lewat tab Header & Navigasi dan selalu tersedia di lembar Menu. |
| **Teks & Label** | Semua tulisan katalog dan detail produk: **daftar kategori** (dipisahkan koma), sebutan barang, label spesifikasi (Merek, RAM, Memori, …), tombol pesan, label tersedia/habis, kartu jaminan, dan **pesan WhatsApp otomatis**. Juga teks halaman Rekening, Layanan, Lokasi, footer, dan deskripsi SEO. |

Tips:
- Isi tanda **-** (minus) pada kolom yang punya keterangan "untuk menyembunyikan" bila tulisan itu tidak perlu. Contoh: usaha kuliner bisa menyembunyikan label "RAM" dan "Memori".
- Kosongkan kolom teks untuk kembali ke tulisan bawaan.
- Pengunjung bisa memilih mode gelap/terang sendiri (tombol header/navigasi bila dipasang, atau lewat lembar **Menu**). Pilihannya tersimpan di HP mereka.
- Semua pop-up dan lembar (menu, bagikan, form dasbor) **hanya tertutup lewat tombol X / Batal**. Klik di luar tidak menutupnya, jadi isian tidak hilang tanpa sengaja.

### Menu buatan sendiri (contoh: menu "iPhone")
Buka **Tampilan & Teks → Menu → Tambah Menu**, isi **Nama menu** `iPhone`, pilih ikon, lalu pilih **Tujuan saat diklik**:

| Tujuan | Contoh isian | Hasil |
|---|---|---|
| Halaman di situs | Katalog / Rekening / Layanan / Lokasi / Beranda | Membuka halaman itu |
| Kategori katalog | `HP Baru` | Katalog langsung tersaring kategori itu |
| Cari kata di katalog | `iphone` | Katalog menampilkan hasil pencarian "iphone" |
| Link custom | `#iphone` | Sama dengan mencari "iphone" di katalog |
| Link custom | `contohdomain.com/iphone` | Membuka situs itu di tab baru |

Setelah dibuat, menu tampil di link bio dan lembar Menu, dan bisa dipasang di **navigasi bawah** atau **tombol header** lewat tab Header & Navigasi.

### FAQ (Tanya Jawab)
**Bagian Link Bio → FAQ → Atur**: ubah judul, tambah/hapus/urutkan pertanyaan dan jawaban. Gunakan saklar di daftar bagian untuk menyalakan/mematikan FAQ.

### Lokasi toko lebih dari 2 cabang
Buka **Cabang & Sosmed** → **Tambah**. Nama dan nomor WA wajib diisi; alamat, jam buka, link Maps, dan peta mini boleh diisi menyusul. Cabang baru otomatis muncul di halaman **Lokasi**, filter katalog, pilihan cabang produk, akun admin cabang, dan pilihan "chat cabang". Cabang tidak bisa dihapus bila masih dipakai produk atau akun admin; pindahkan dulu ke cabang lain.

Di link bio, bagian Lokasi menampilkan beberapa cabang beserta tombol **Lihat semua**. Tombol ini membuka halaman **Lokasi Toko** berisi semua cabang dan **kolom pencarian** (bisa mencari berdasarkan nama, kota, atau alamat).

### Halaman Layanan
Menu **Halaman Layanan** → **Tambah Layanan**: isi judul, pilih ikon, deskripsi, dan pesan WhatsApp otomatis (`{cabang}` diganti nama cabang). Layanan bisa diurutkan (▲), disembunyikan, atau dihapus. Judul, subjudul, dan kotak tips halaman diatur di bagian bawah menu yang sama.

### Slide Hero & Pop-up: dengan atau tanpa link
Saat mengedit slide, pilih **Tujuan saat diklik**: halaman di situs (Katalog / Rekening / Layanan / Lokasi), **Link manual (URL)** (misalnya `https://...`, terbuka di tab baru), atau **Tanpa link** (slide hanya gambar).

---

## 5. Reset data contoh & reset sandi superadmin (lewat backend)

Keduanya **hanya** bisa dijalankan dari editor Apps Script. Tidak ada tombol di website.

| Kebutuhan | Fungsi yang dijalankan (▶) | Hasil |
|---|---|---|
| Mengisi ulang data contoh | **`jalankanResetDataContoh`** | Produk, slide, rekening, layanan, dan statistik diganti data contoh. **Akun admin, cabang, sosmed, dan pengaturan utama tidak diubah.** |
| Lupa sandi superadmin | **`resetPasswordSuperadmin`** | Sandi sementara tampil di **Log eksekusi**, semua sesi lama dicabut, dan sandi wajib diganti saat login. |
| Menentukan sendiri sandi sementara | Setelan proyek → **Properti skrip** → tambah `SUPERADMIN_SANDI_BARU` = sandi pilihan, lalu jalankan `resetPasswordSuperadmin` | Properti otomatis dihapus setelah dipakai. |
| Lupa sandi admin cabang | Dasbor superadmin → **Admin & Akses → Reset** | Admin tersebut wajib mengganti sandi saat login. |
| Pemicu hilang / antrean WA macet | **`pasangTrigger`** | Pemicu 1 menit dipasang ulang. |
| Data publik belum berubah | **`bersihkanCache`** | Cache dikosongkan sehingga data langsung dimuat ulang. |

---

## 6. Notifikasi WhatsApp (Fonnte) & Email

1. Daftar di **fonnte.com** → **Device** → scan QR dengan nomor WA toko → salin **token**.
2. Dasbor → **WhatsApp & Notifikasi → ⚙️ Konfigurasi** → tempel token → **Cek Perangkat** (harus `connect`) → **Kirim Tes WA** → nyalakan saklar WhatsApp → **Simpan**. Token disimpan aman di server dan tidak pernah tampil ke pengunjung.
3. Email: nyalakan saklar Email → **Kirim Tes**. Kuota Gmail biasa sekitar 100 email/hari.
4. **Matriks notifikasi otomatis**: atur kejadian mana yang dikirim lewat WA dan/atau email, beserta isi pesannya:
   - Admin login (keamanan)
   - Admin cabang menambah produk
   - Produk ditandai HABIS
   - Pop-up promo dinyalakan
   - Sandi admin direset
   - Ringkasan mingguan setiap Senin pagi (kunjungan, klik WA Nabire vs Serui, produk paling ditanyakan)
5. **📣 Blast WhatsApp** (promo ke pelanggan): pilih sasaran (segmen/tag CRM atau tempel nomor) → **Deteksi Nomor WA** → tulis pesan (`{nama}`, `{toko}`, `{link}`) → pilih batch **10/20/50** dan jeda → **Mulai Blast**. Server tetap mengirim 1 batch per menit walau halaman ditutup.
   - **Tips anti-blokir:** pakai nomor yang sudah lama aktif, mulai dengan batch 10, jeda acak `3-8` detik, tambahkan "Balas STOP untuk berhenti", dan jangan kirim tautan yang sama ke ratusan orang dalam satu jam.

## 7. CRM Kontak

- **Sinkron** otomatis memasukkan tim admin. Pelanggan masuk lewat **Import CSV** (kolom `nama, wa, email, segmen, tag`; ada template) atau **Tambah Kontak**. Nomor 62/+62 otomatis diubah jadi 08, dan kontak ganda dilewati sehingga import aman diulang.
- Kartu KPI bisa diklik sebagai filter: WA terverifikasi, belum dicek, opt-out, duplikat.
- Aksi massal: deteksi WA, beri tag, **Blast ke terpilih**, opt-out/opt-in, gabungkan duplikat, hapus, dan ekspor CSV.
- Kontak **opt-out** tidak pernah ikut blast.

## 8. Migrasi data dari app/katalog lama

Dasbor → **Migrasi Data** → tempel URL spreadsheet lama → pilih data → **Pindai (Dry-run)** → periksa angka → **Jalankan Import**.
- Spreadsheet lama hanya **dibaca**, tidak diubah.
- Kolom dikenali dari nama header, termasuk variasinya: "Nama Produk", "Harga Jual", "Lokasi", "Stok", "Foto", dan lainnya.
- Import ulang tidak membuat data dobel. Jalankan sekali lagi tepat sebelum pindah untuk menangkap data terbaru.
- Gunakan **akun Google yang sama** agar foto Drive lama tetap tampil.
- Tersedia juga **Import produk dari CSV** (ada template).

## 9. Pasang sebagai aplikasi (PWA) & bagikan link

- **Tombol Install** ada di header (bila dipasang di tab Header & Navigasi), di lembar **Menu**, dan di lembar **Bagikan**. Warnanya mengikuti warna utama tema.
  - Android/Chrome: ketuk **Install** → **Pasang**. Tombol **hilang otomatis** setelah aplikasi terpasang, dan tidak tampil saat link bio dibuka dari aplikasi yang sudah terpasang.
  - iPhone: tombol menampilkan petunjuk *Bagikan → Tambah ke Layar Utama*.
- Saat dibuka sebagai aplikasi terpasang, tampilannya seperti APK: **zoom dimatikan** (cubit, ketuk ganda, Ctrl+gulir), tidak ada tarik-untuk-muat-ulang, teks tidak ikut terseleksi saat ditekan lama, ada animasi pindah halaman, dan warna bilah status mengikuti warna header.
- Saat pop-up atau menu terbuka, halaman di belakangnya **tidak ikut tergulir**.
- **Menu → Bagikan** menampilkan:
  - **QR Code** yang bisa dipindai langsung dari layar atau **diunduh** sebagai gambar PNG berbingkai, siap dicetak atau ditempel di toko.
  - Tautan yang bisa **disalin**.
  - Tombol bagikan ke **WhatsApp, Facebook, Telegram, X**, dan aplikasi lain.
- Tombol bagikan di halaman detail produk memakai lembar yang sama, jadi QR-nya langsung membuka produk tersebut.

## 10. Lisensi template (Nabire Kreatif)

- Domain yang belum berlisensi tampil dalam **mode DEMO**: hanya ada **pita merah "DEMO"** di pojok kiri atas. Tidak ada bilah melayang di bawah, dan semua fitur tetap berjalan.
- Cara aktivasi (pilih salah satu):
  - ketuk **pita DEMO**;
  - buka **`domain-anda/#key`**;
  - dasbor → menu **Lisensi**.

  Lalu masukkan kode `NK-XXXX-XXXX`. Cukup **sekali per domain**; setelah itu semua pengunjung tidak diminta kode lagi. Panel aktivasi juga punya tautan **Beli lisensi** ke halaman produk di Nabire Kreatif.
- Setelah berlisensi, **pita DEMO hilang** dan footer menampilkan **"© 2026 <nama usaha>. by Nabirekreatif.com"** (nama usaha diambil dari profil di dasbor). Footer ini dijaga: bila disembunyikan atau teksnya diubah, halaman terkunci.
- **Jangan** mengubah berkas selain `js/config.js`, dan jangan menghapus atau menutupi hak cipta. Halaman akan **terkunci**.
- Wajib HTTPS (GitHub Pages sudah HTTPS). Bila memakai Cloudflare, matikan *Auto Minify* dan *Rocket Loader* karena bisa memicu kunci yang keliru.
- Pencabutan lisensi berlaku paling lambat 24 jam kemudian.

---

## Update dari versi sebelumnya

**v5 → v6** (modul Menu, FAQ, tombol header maks 2 / navigasi maks 5, pop-up hanya tutup via X, mode aplikasi, lisensi SDK v6):
1. Di Apps Script, ganti isi **Kode.gs** saja, lalu **Deploy → Kelola deployment → Edit → Versi baru → Deploy**. Bagian FAQ muncul otomatis di daftar bagian.
2. Timpa semua berkas frontend dengan isi ZIP baru, termasuk `nk-license.js` (tetap pakai `js/config.js` lama yang berisi URL). Lalu `git add .` → `git commit -m "v6"` → `git push`, dan tekan **Ctrl+Shift+R**.
3. Buka **Tampilan & Teks → Header & Navigasi**, pilih ulang tombol header (bawaan: Install + CS) karena saklar CS/Install/Mode gelap lama diganti pilihan tombol. Simpan.

**v4 → v5** (performa, Layanan bisa ditambah, Migrasi rapi):
1. Di Apps Script, ganti isi **Kode.gs** saja (berkas lain tidak berubah), lalu **Deploy → Kelola deployment → Edit → Versi baru → Deploy**.
2. Timpa berkas frontend dengan isi ZIP baru (tetap pakai `js/config.js` lama yang berisi URL), lalu `git add .` → `git commit -m "v5"` → `git push`. Buka situs dan tekan **Ctrl+Shift+R**.

**v3 → v4**: ganti **Kode.gs**, **Notifikasi.gs**, **Migrasi.gs**, jalankan `setupAplikasi()` sekali (aman, hanya menambah kolom `kota`), lalu deploy **Versi baru**.

## Kecepatan & PageSpeed

- Pengunjung yang **pernah membuka** link bio langsung melihat tampilan terakhir (warna, header/navigasi, isi), lalu data terbaru dicek di latar. Hasil edit dasbor tampil begitu data terbaru datang (±1–3 detik), tanpa tampilan bawaan muncul lebih dulu.
- Pengunjung **pertama kali** melihat kerangka abu-abu netral sampai data dari Apps Script datang. Header/navigasi bawaan tidak lagi ditampilkan lalu dihilangkan, sehingga halaman tidak "melompat".
- Batas yang tersisa: kunjungan pertama tetap menunggu jawaban Apps Script (biasanya 1–3 detik, lebih lama bila server baru "bangun"). Ini sifat layanan gratis Google, bukan kode template.
- Nilai PageSpeed bervariasi tiap pengujian. Uji 2–3 kali dan lihat rata-ratanya.

## Pemecahan masalah

| Gejala | Penyebab & solusi |
|---|---|
| Situs 404 di GitHub Pages | `index.html` tidak berada di root repo. Ulangi `git init` dari folder yang berisi `index.html`. |
| "Data belum bisa dimuat" | `GAS_URL` salah, deploy belum *Versi baru*, atau akses deploy bukan "Siapa saja". |
| "Backend belum disiapkan" | Jalankan `setupAplikasi()`. |
| Login terkunci 15 menit | Lima kali salah sandi. Tunggu, atau superadmin melakukan reset. |
| Gambar gagal diunggah | Kebijakan Google Workspace melarang berbagi publik. Minta admin Workspace mengizinkan berbagi "Siapa saja yang memiliki link". |
| WA tidak terkirim | Cek token dan status perangkat Fonnte (harus `connect`), lihat tab **Antrean**, lalu jalankan `pasangTrigger()`. |
| Tampilan lama sempat muncul sebentar | Normal bagi pengunjung yang pernah berkunjung: tampilan terakhir ditampilkan seketika lalu diperbarui. Pastikan frontend sudah versi v5. |
| Warna/teks baru belum tampil | Tunggu ±1 menit atau muat ulang halaman. Pastikan backend sudah *Versi baru* v4. |
| Halaman terkunci "Template tidak berlisensi" | Ada berkas tersegel yang diubah, atau hosting mengubah berkas. Unggah ulang berkas asli. |

## Batasan yang perlu diketahui

- **Foto produk contoh** memakai gambar dari referensi desain Google Stitch yang di-hosting Google. Ganti dengan foto asli toko dari dasbor, karena tautan contoh tidak dijamin selamanya.
- Pengiriman WA bergantung pada status perangkat Fonnte. Balasan WA dari pelanggan tidak tercatat otomatis.
- Pencabutan lisensi berlaku paling lambat 24 jam kemudian. Proteksi di browser mempersulit pembajakan, tetapi tidak 100% anti-bobol.
