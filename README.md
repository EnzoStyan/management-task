# Proyek Sistem Manajemen Tugas (Tes Nexa) 📝

Halo! Ini adalah aplikasi web Fullstack yang dirancang untuk membantu karyawan mengelola tugas harian mereka. Proyek ini dibuat menggunakan Laravel untuk backend dan React untuk frontend (akan segera menyusul), sebagai bagian dari proses seleksi Fullstack Developer di Nexa.

## Teknologi yang Digunakan 💻

* **Backend:** Laravel 12 (membutuhkan PHP 8.2+)
* **Frontend:** React
* **Database:** MySQL
* **Styling:** TailwindCSS (akan digunakan di Frontend)
* **Autentikasi:** Menggunakan JWT (via package `tymon/jwt-auth`)
* **Dokumentasi API:** Disediakan dalam bentuk Postman Collection (`postman_collection.json`)
* **Lingkungan Development:** Menggunakan Laragon (untuk kemudahan setup Apache/Nginx, PHP, MySQL)

## Struktur Database 🗄️

Secara garis besar, struktur tabelnya seperti ini:

* **`users`**: Menyimpan data pengguna (ID, nama, username, email, password yang sudah di-hash).
* **`tasks`**: Menyimpan detail tugas (ID tugas, ID user pemilik, judul, deskripsi, status ['To Do', 'In Progress', 'Done'], deadline, ID user pembuat).

(Untuk detail kolom yang lebih lengkap, silakan cek file migrasi di `backend/database/migrations/`)

## Akun Contoh untuk Login 🧑‍💻

Anda bisa menggunakan akun ini untuk mencoba login:

* **Email:** `johndoe@example.com`
* **Password:** `password123`
    *(lebih baik daftarkan user baru)*

## Cara Menjalankan Proyek Ini 🚀

## Cara Menjalankan Proyek Ini 🚀

### A. Menggunakan Docker Compose (Direkomendasikan)

1.  Pastikan Docker dan Docker Compose sudah terinstal di komputermu.
2.  Clone repository:
    ```bash
    git clone https://github.com/EnzoStyan/management-task
    cd task-management
    ```
3.  **Salin Konfigurasi Backend:**
    ```bash
    cd backend
    cp .env.example .env
    php artisan key:generate
    php artisan jwt:secret
    cd ..
    ```
    * **Penting:** Salin nilai `APP_KEY` dan `JWT_SECRET` dari `backend/.env` dan masukkan ke dalam file `docker-compose.yml` menggantikan `${APP_KEY}` dan `${JWT_SECRET}`. Atau, buat file `.env` di *root* `task-management/` dan definisikan `APP_KEY` serta `JWT_SECRET` di sana.
4.  **Build & Jalankan Containers:**
    ```bash
    docker-compose up -d --build
    ```
    Perintah ini akan membuat *images* dan menjalankan semua *container* di *background*. Tunggu beberapa saat sampai semua *service* siap.
5.  **Jalankan Migrasi Database di Container:**
    ```bash
    docker-compose exec backend php artisan migrate
    ```
6.  **Akses Aplikasi:**
    * Frontend: Buka `http://localhost:3000` di browser.
    * Backend API: Tersedia di `http://localhost:8000/api`.
    * Database (jika perlu akses): Host `127.0.0.1`, Port `33061`, User `nexa_user`, Pass `nexa_password`, DB `nexa_task_mgt`.

7.  **Menghentikan Containers:**
    ```bash
    docker-compose down
    ```

### B. Setup Manual (Tanpa Docker)

Berikut langkah-langkah untuk menjalankan aplikasi di lingkungan lokal Anda:

1.  **Clone Repository:**
    ```bash
    git clone https://github.com/EnzoStyan/management-task
    cd task-management
    ```
2.  **Setup Backend:**
    ```bash
    cd backend
    composer install         
    cp .env.example .env       
    php artisan key:generate   
    php artisan jwt:secret     T
    # Buka dan edit file .env, sesuaikan detail koneksi database (DB_DATABASE, DB_USERNAME, DB_PASSWORD)
    ```
3.  **Setup Database:**
    * Siapkan database kosong di MySQL (contoh: `nexa_task_mgt`).
    * Impor struktur dan data dari file `db.sql` (ada di folder utama proyek) ke database yang baru dibuat. Anda bisa menggunakan tool seperti HeidiSQL, phpMyAdmin, atau command line `mysql`.
        ```bash
        # Contoh command line:
        mysql -u <username> -p <nama_database> < ../db.sql
        ```
    * *(Alternatif)* Jika tidak ingin mengimpor `db.sql`, Anda bisa menjalankan migrasi Laravel:
        ```bash
        php artisan migrate
        ```
4.  **Jalankan Server Backend:**
    ```bash
    php artisan serve --port=8000
    ```
    * Backend API akan aktif di `http://127.0.0.1:8000`.

5.  **Setup Frontend (Menyusul):**
    ```bash
    cd ../frontend
    npm install
    ```
6.  **Jalankan Frontend (Menyusul):**
    ```bash
    npm start
    ```
    * Frontend biasanya akan berjalan di `http://localhost:3000`.

7.  **Pengujian API:**
    * Gunakan Postman atau tool serupa. Impor file `postman_collection.json` (ada di folder utama) untuk mendapatkan daftar *endpoint* API beserta contoh *request*. Jangan lupa sertakan Bearer Token yang didapat saat login untuk mengakses *endpoint* yang terproteksi.

## Tampilan Aplikasi (Screenshots) 📸

*(Screenshot akan ditambahkan setelah antarmuka pengguna (frontend) selesai dikembangkan)*

* Halaman Login (`screenshots/login.png`)
* Halaman Dashboard (`screenshots/dashboard.png`)
* Form/Modal CRUD Task (`screenshots/task_crud.png`)