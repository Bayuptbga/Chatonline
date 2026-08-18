# DriveTok — Website mirip TikTok, video dari Google Drive, deploy di GitHub Pages

## Pembaruan UI/UX Tanpa Iframe (TikTok Style murni)
Versi ini sudah membuang sepenuhnya sistem `<iframe>` bawaan Google Drive yang sebelumnya menutupi antarmuka aplikasi. Sekarang file memanggil API `alt=media` secara langsung. 

Hasilnya:
- **UI Kustom Sepenuhnya Berfungsi:** Fitur Double Tap to Like, dan animasi pop hati tidak akan pernah terhalangi.
- **Kontrol Penuh JavaScript:** Play dan pause melalui ketukan tunggal dijamin responsif.
- **Tampilan Bersih:** Pemutar video Google Drive (yang sebelumnya ada tombol play besar di tengah) sudah hilang. Tampilan 100% menggunakan estetika Glassmorphism dari DriveTok.

## Cara Deploy ke GitHub Pages
1. Ekstrak file zip ini.
2. Buat repository baru di GitHub (misal: `drivetok`).
3. Upload `index.html` dan `config.js` ke repo tersebut.
4. Masuk ke tab **Settings > Pages** di repositori GitHub Anda.
5. Di bagian **Source**, pilih branch `main` (atau `master`) dan simpan.
6. Tunggu beberapa menit, website akan aktif.
