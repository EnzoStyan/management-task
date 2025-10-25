# Backend Sistem Manajemen Tugas (Laravel) ⚙️

Ini adalah bagian backend (API server) untuk aplikasi Sistem Manajemen Tugas, yang dibangun menggunakan framework Laravel 11.

## Cara Menjalankan Backend Saja

Jika Anda hanya ingin menjalankan bagian backend:

1.  Pastikan sudah menjalankan `composer install` di direktori ini.
2.  Pastikan file `.env` sudah ada (salin dari `.env.example`) dan sudah dikonfigurasi dengan benar, terutama `APP_KEY`, `JWT_SECRET`, dan detail koneksi database.
3.  Pastikan database sudah disiapkan dan tabel-tabelnya sudah dibuat (melalui `php artisan migrate` atau impor dari file `db.sql`).
4.  Setelah semua siap, jalankan server development Laravel:
    ```bash
    php artisan serve
    ```
    Server akan berjalan, biasanya di `http://127.0.0.1:8000`. dan bisa menguji API menggunakan Postman atau tool lainnya. 
    Jika AuthController error di undefined method abaikan saja