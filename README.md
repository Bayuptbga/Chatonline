# DriveTok — Fix API Error

Versi ini memperbaiki bug **"API gagal merespon"** dengan mengembalikan jalur pemuatan video ke mode `uc?export=download`. 
Kombinasi sistem multi-folder berantai (queue) tetap dipertahankan, namun kini pemutaran video jauh lebih stabil dari batasan error 403 Google Drive API.
