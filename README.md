# Frequency — Random Stranger Video + Text Chat

Clone gaya Omegle: chat video & teks acak dengan orang asing, dibangun pakai
Node.js + Socket.io (signaling/matchmaking) dan WebRTC (koneksi video peer-to-peer).

## Struktur folder

```
frequency-chat/
├── server.js           # server signaling + matchmaking
├── package.json
└── public/
    ├── index.html       # landing page
    ├── chat.html        # halaman chat (video + teks)
    ├── css/style.css
    └── js/chat.js        # logic WebRTC + socket client
```

## Menjalankan di lokal

```bash
cd frequency-chat
npm install
npm start
```

Buka `http://localhost:3000` di dua tab/browser berbeda (atau dua device)
untuk mencoba matching. Izinkan akses kamera & mikrofon saat diminta.

## Deploy supaya bisa diakses publik

Karena ini butuh server yang selalu menyala (untuk Socket.io & matchmaking),
kamu perlu hosting yang support Node.js persisten — bukan hosting statis biasa.

Pilihan yang mudah:

- **Render.com** — buat "Web Service" baru, connect ke repo GitHub kamu,
  build command `npm install`, start command `npm start`.
- **Railway.app** — mirip Render, tinggal connect repo dan deploy.
- **VPS (misal DigitalOcean/Ubuntu)** — clone repo, `npm install`, jalankan
  dengan `pm2 start server.js` supaya tetap hidup, lalu pasang Nginx +
  SSL (Let's Encrypt) di depannya karena WebRTC/getUserMedia butuh HTTPS.

### Penting soal WebRTC di production

Server ini cuma pakai STUN server publik Google
(`stun:stun.l.google.com:19302`). Ini cukup untuk kebanyakan koneksi,
tapi sebagian user di balik NAT/firewall ketat (kantor, kampus, beberapa
provider mobile) tidak akan bisa connect tanpa **TURN server**. Untuk
production yang lebih andal, tambahkan TURN server (misalnya lewat
[Twilio STUN/TURN](https://www.twilio.com/docs/stun-turn) atau jalankan
[coturn](https://github.com/coturn/coturn) sendiri) di `ICE_SERVERS`
pada `public/js/chat.js`.

## Hal yang perlu kamu pikirkan sebelum go-live

Platform chat acak dengan orang asing (terutama video) punya risiko
penyalahgunaan yang nyata — ini alasan utama Omegle asli akhirnya tutup.
Sebelum deploy ke publik, pertimbangkan menambahkan:

- **Verifikasi/peringatan umur** — minimal disclaimer 18+ di landing page (sudah ada draftnya), idealnya age-gate.
- **Tombol Report/Block** — supaya user bisa melaporkan perilaku buruk; saat ini skip/ganti kanal sudah ada, tapi belum ada sistem laporan.
- **Moderasi konten** — untuk video real-time ini sulit diotomatisasi penuh, tapi setidaknya siapkan cara user melapor dan proses banned IP/hash.
- **Kebijakan privasi & ToS** — terutama karena app ini menangani stream kamera/mic.
- **Rate limiting** — supaya satu user tidak bisa spam buka koneksi baru terus-menerus.

Kode ini adalah pondasi teknis yang jalan (matchmaking, WebRTC, chat teks) —
bagian moderasi & keamanan di atas perlu kamu tambahkan sendiri sesuai
skala dan target penggunanya.
