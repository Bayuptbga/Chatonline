// ============================================
// KONFIGURASI — isi bagian ini sebelum deploy
// ============================================

const CONFIG = {
  // Dapatkan dari Google Cloud Console > APIs & Services > Credentials
  // Aktifkan "Google Drive API" dulu, lalu buat API Key
  // WAJIB dibatasi (restrict) ke domain GitHub Pages kamu di halaman kredensial
  API_KEY: "ISI_API_KEY_KAMU_DI_SINI",

  // ID folder Google Drive yang berisi video-video
  // Contoh link: https://drive.google.com/drive/folders/1AbCdEfGhIjKlMnOpQrSt
  // ID-nya adalah bagian setelah /folders/  ->  1AbCdEfGhIjKlMnOpQrSt
  FOLDER_ID: "ISI_FOLDER_ID_KAMU_DI_SINI",

  // Jumlah video yang diambil per load
  PAGE_SIZE: 10,
};
