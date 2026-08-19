# DriveTok v7 — Multi-Folder Support

Versi 7 ini membawa pembaruan besar pada sistem `config.js` sehingga Anda bisa memasukkan lebih dari satu ID folder utama. Sangat berguna jika Anda memiliki banyak folder Google Drive yang ingin disatukan ke dalam satu *feed* aplikasi.

## Cara Pakai Fitur Multi-Folder:
1. Buka file `config.js`.
2. Pada bagian `FOLDER_IDS`, masukkan ID folder Anda ke dalam kurung siku `[]`.
3. Pastikan format penulisannya benar menggunakan tanda kutip `""` dan dipisahkan dengan koma `,`. 

Contoh:
```javascript
FOLDER_IDS: [
  "1Zz47e3-ewXqt1y3qvEgBQWnug1LLt2fA",
  "1AbCdEfGhIjKlMnOpQrStUvWxYz",
  "1QwErTyUiOpAsDfGhJkLzXcVbNm"
],
```

Aplikasi secara otomatis akan membaca seluruh video dari folder pertama (beserta subfoldernya) terlebih dahulu. Jika sudah habis, akan langsung beralih memompa video dari folder kedua, dan seterusnya.
