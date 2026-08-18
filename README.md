# DriveTok — Website mirip TikTok, video dari Google Drive, deploy di GitHub Pages

## Cara Setup

### 1. Siapkan folder Google Drive
1. Buat folder di Google Drive, isi dengan video-video kamu.
2. Klik kanan folder → **Share** → ubah akses jadi **"Anyone with the link" → Viewer**.
3. Salin ID folder dari URL-nya:
   `https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrSt`
   ID-nya adalah `1AbCdEfGhIjKlMnOpQrSt`.

### 2. Buat API Key Google Drive
1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat project baru (atau pakai yang sudah ada).
3. Buka **APIs & Services > Library**, cari **Google Drive API**, klik **Enable**.
4. Buka **APIs & Services > Credentials** → **Create Credentials** → **API Key**.
5. Klik **Restrict Key**:
   - **Application restrictions** → HTTP referrers → tambahkan:
     `https://USERNAME.github.io/*` (ganti USERNAME dengan username GitHub kamu)
   - **API restrictions** → pilih **Google Drive API** saja.
6. Simpan.

### 3. Isi config.js
Buka `config.js`, isi:
```js
API_KEY: "AIzaSy...punya kamu...",
FOLDER_ID: "1AbCdEfGhIjKlMnOpQrSt",
```

### 4. Deploy ke GitHub Pages
1. Buat repository baru di GitHub, misal `drivetok`.
2. Upload `index.html` dan `config.js` ke repo tersebut.
3. Masuk ke **Settings > Pages**.
4. Di bagian **Source**, pilih branch `main` dan folder `/ (root)`.
5. Tunggu 1-2 menit, website akan aktif di:
   `https://USERNAME.github.io/drivetok/`

## Cara Pakai
- Scroll vertikal (atau swipe di HP) untuk pindah video, mirip TikTok.
- Tap video untuk play/pause.
- Tombol ❤️ untuk like (hanya tersimpan sementara di browser, bukan permanen).
- Tombol 🔇/🔊 untuk mute/unmute.
- Video otomatis dimuat lagi (infinite scroll) saat mendekati video terakhir.

## Keterbatasan yang Perlu Diketahui
- **File besar (>100MB)**: Google kadang menampilkan peringatan "tidak bisa memindai virus" 
  yang membuat video gagal di-embed langsung. Kode ini otomatis fallback ke iframe preview 
  kalau itu terjadi, tapi kontrolnya (mute, autoplay presisi) jadi terbatas.
- **Like/komentar/view count**: karena GitHub Pages tidak punya database/server, semua data 
  interaksi ini TIDAK tersimpan permanen — hilang setiap refresh. Kalau mau permanen, perlu 
  tambahan layanan gratis seperti **Firebase Firestore** atau **Supabase** sebagai backend.
- **API Key terlihat di source code** (karena situs statis, semua kode berjalan di browser). 
  Ini aman selama kamu sudah restrict API key ke domain GitHub Pages kamu (langkah 2 di atas), 
  jadi tidak bisa dipakai orang lain dari domain berbeda.
- **Kuota Google Drive API**: gratis, tapi ada limit harian (biasanya cukup besar untuk 
  penggunaan personal/kecil).
- **Bukan sistem upload**: video harus kamu masukkan manual ke folder Drive; tidak ada fitur 
  upload dari website (karena statis, tanpa server untuk memproses upload).

## Struktur File
```
drivetok/
├── index.html    # Halaman utama + semua logic (JS inline)
├── config.js     # API key & folder ID (edit ini)
└── README.md     # Panduan ini
```
