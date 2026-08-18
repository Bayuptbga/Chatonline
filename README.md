# DriveTok — Website mirip TikTok, video dari Google Drive, deploy di GitHub Pages

## Pembaruan v3 (Subfolder Fix)
Versi ini menyertakan algoritma pengambilan antrean agar batas kuota parameter Google Drive API tidak terpicu saat aplikasi membaca banyak subfolder sekaligus.

Hasilnya:
- **Dukungan Multi-Folder:** Anda bisa meletakkan puluhan subfolder di dalam folder utama, dan aplikasi akan menarik video-video di dalamnya secara berurutan.
- **Toleransi Error:** Jika ada salah satu subfolder yang izin akses (Sharing)-nya keliru tidak diset ke publik, aplikasi akan sekadar mengabaikan folder itu dan otomatis berlanjut mencari video di folder lainnya, tanpa membuat seluruh *feed* mati (crash).
