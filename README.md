# DriveTok — Website mirip TikTok, video dari Google Drive, deploy di GitHub Pages

## Pembaruan UI/UX (TikTok Style)
Versi ini sudah dilengkapi dengan:
- **Double Tap untuk Like:** Ketuk dua kali pada video untuk memberikan "Love", lengkap dengan animasi hati (heart pop) layaknya TikTok asli.
- **Glassmorphism UI:** Ikon aksi samping (Like, Suara, Bagikan) dan info video bawah dengan gradien gelap yang elegan.
- **Auto-Play Pintar:** Video otomatis berputar saat di-scroll dan otomatis dijeda saat tidak terlihat.
- **Mobile First:** Struktur CSS dan viewport sudah disesuaikan agar pas satu layar (full screen) di perangkat HP.

## Cara Deploy ke GitHub Pages
1. Ekstrak file zip ini.
2. Buat repository baru di GitHub (misal: `drivetok`).
3. Upload `index.html` dan `config.js` ke repo tersebut.
4. Masuk ke tab **Settings > Pages** di repositori GitHub Anda.
5. Di bagian **Source**, pilih branch `main` (atau `master`) dan simpan.
6. Tunggu beberapa menit, website akan aktif.

Catatan: Karena Anda sering menggunakan PWA Builder atau bermain dengan Supabase, jika ke depannya ingin membuat status "Like" atau "Komentar" bisa tersimpan permanen dan memiliki backend asli, Anda bisa dengan mudah memodifikasi logika JavaScript di file `index.html` ini.
