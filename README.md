# Kuis 1 - Refactor RESTful API

## Identitas

Nama: Angga Syahputra Azis
NIM: 2428240065
Kelas: SI5B

## Deskripsi

Project ini merupakan hasil refactoring dari Tugas 1 RESTful API dengan menerapkan arsitektur backend yang lebih terstruktur menggunakan Route, Controller, Model, dan Middleware.

Topik yang digunakan adalah **Transportasi Umum** dengan resource **Rute Bus**. API dibuat menggunakan Express.js dan menggunakan data sementara (in-memory) tanpa database.

## Teknologi yang Digunakan

* Node.js
* Express.js
* CORS
* dotenv
* Postman

## Struktur Project

```text
si5b_kuis1_anggasyahputra/
│
├── controllers/
│   └── busRouteController.js
│
├── middlewares/
│   ├── cekApiKey.js
│   ├── errorHandler.js
│   └── logger.js
│
├── models/
│   └── busRouteModel.js
│
├── routes/
│   └── busRouteRoutes.js
│
├── .env
├── .env.example
├── .gitignore
├── app.js
├── package.json
└── README.md
```

## Instalasi

Pastikan Node.js sudah terpasang pada komputer. Jalankan perintah berikut pada terminal:

```bash
npm init -y
npm install express cors dotenv
```

Jika project sudah memiliki `package.json`, cukup jalankan:

```bash
npm install
```

## Konfigurasi Environment

Buat file `.env` pada folder utama project dengan isi:

```env
PORT=4000
API_KEY=SI5B_2428240065
```

Contoh konfigurasi dapat disimpan pada file `.env.example`:

```env
PORT=4000
API_KEY=isi_api_key_anda
```

File `.env` dimasukkan ke `.gitignore` agar API Key tidak ikut di-upload ke GitHub.

## Menjalankan Server

Untuk menjalankan server gunakan perintah:

```bash
npm start
```

Server akan berjalan pada:

```text
http://localhost:4000
```

## Endpoint API

### 1. GET Seluruh Rute Bus

Endpoint:

```http
GET /bus-routes
```

URL:

```text
http://localhost:4000/bus-routes
```

Endpoint ini digunakan untuk menampilkan seluruh data rute bus yang tersedia.

### 2. GET Rute Berdasarkan ID

Endpoint:

```http
GET /bus-routes/:id
```

Contoh:

```text
http://localhost:4000/bus-routes/1
```

Endpoint ini digunakan untuk mengambil satu data rute bus berdasarkan ID.

### 3. Filter Rute Berdasarkan Kota

Endpoint:

```http
GET /bus-routes?kota=Palembang
```

Endpoint ini digunakan untuk menampilkan rute bus berdasarkan nama kota.

### 4. POST Menambahkan Rute Bus

Endpoint:

```http
POST /bus-routes
```

Header:

```text
x-api-key: SI5B_2428240065
Content-Type: application/json
```

Body:

```json
{
  "kodeRute": "K4-2428240065",
  "asal": "Terminal Angga Syahputra",
  "tujuan": "Ampera",
  "kota": "Palembang",
  "tarif": 8000
}
```

Endpoint ini digunakan untuk menambahkan data rute bus baru.

### 5. PUT Memperbarui Rute Bus

Endpoint:

```http
PUT /bus-routes/:id
```

Header:

```text
x-api-key: SI5B_2428240065
Content-Type: application/json
```

Endpoint ini digunakan untuk memperbarui data rute bus berdasarkan ID.

### 6. DELETE Menghapus Rute Bus

Endpoint:

```http
DELETE /bus-routes/:id
```

Header:

```text
x-api-key: SI5B_2428240065
```

Endpoint ini digunakan untuk menghapus data rute bus berdasarkan ID. Jika berhasil, server mengembalikan status `204 No Content`.

## Middleware

Project ini menggunakan beberapa middleware untuk mendukung proses API.

### Logger

Middleware Logger digunakan untuk mencatat waktu, method, dan URL setiap request yang masuk ke server.

### API Key

Middleware API Key digunakan untuk melakukan pemeriksaan terhadap header `x-api-key`. Middleware ini digunakan pada endpoint POST, PUT, dan DELETE.

Jika API Key tidak diberikan atau tidak sesuai, server akan memberikan response:

```text
401 Unauthorized
```

### Error Handler

Error Handler digunakan untuk menangani kesalahan yang terjadi pada server, termasuk JSON yang memiliki format tidak valid.

### Not Found

Middleware Not Found digunakan untuk menangani request menuju endpoint yang tidak tersedia dan memberikan response `404 Not Found`.

## Arsitektur Backend

Alur request pada aplikasi:

```text
Client
   ↓
Route
   ↓
Middleware
   ↓
Controller
   ↓
Model
   ↓
Response
```

Pembagian tugas setiap bagian adalah:

* Routes menentukan endpoint yang tersedia.
* Middleware menjalankan proses tambahan sebelum request diteruskan.
* Controller mengatur request dan response.
* Model mengelola data rute bus.

Pemisahan tersebut membuat kode lebih terstruktur dan setiap bagian memiliki tanggung jawab masing-masing.

## Pengujian API

Pengujian dilakukan menggunakan Postman dengan beberapa skenario berikut:

| Kode | Pengujian                      | Status |
| ---- | ------------------------------ | -----: |
| T01  | GET seluruh rute               |    200 |
| T02  | GET rute berdasarkan ID        |    200 |
| T03  | POST rute baru                 |    201 |
| T04  | PUT rute                       |    200 |
| T05  | DELETE rute                    |    204 |
| N01  | POST tanpa API Key             |    401 |
| N02  | POST dengan body tidak lengkap |    400 |
| N03  | JSON tidak valid               |    400 |
| N04  | ID tidak ditemukan             |    404 |

## Contoh Data Awal

Project menggunakan tiga data awal rute bus:

```json
[
  {
    "id": 1,
    "kodeRute": "K1",
    "asal": "Terminal Alang-Alang Lebar",
    "tujuan": "Ampera",
    "kota": "Palembang",
    "tarif": 5000
  },
  {
    "id": 2,
    "kodeRute": "K2",
    "asal": "Terminal Sako",
    "tujuan": "Plaju",
    "kota": "Palembang",
    "tarif": 6000
  },
  {
    "id": 3,
    "kodeRute": "K3",
    "asal": "Terminal Jakabaring",
    "tujuan": "Bukit Besar",
    "kota": "Palembang",
    "tarif": 7000
  }
]
```

## Catatan

Data rute bus pada project ini masih menggunakan penyimpanan sementara atau in-memory sehingga belum menggunakan database.

Data yang ditambahkan, diperbarui, atau dihapus akan kembali ke kondisi awal apabila server dihentikan dan dijalankan kembali.

Project ini dibuat untuk memenuhi Kuis 1 dengan menerapkan konsep refactoring RESTful API menggunakan arsitektur Route, Controller, Model, dan Middleware
