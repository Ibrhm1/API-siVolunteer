# Backend siVolunteer

Backend ini adalah API untuk aplikasi siVolunteer, sebuah platform manajemen event dan relawan. Backend dibangun menggunakan Node.js, Express, dan MongoDB, serta mendukung dokumentasi API dengan Swagger.

## Fitur Utama

- Autentikasi dan otorisasi untuk user dan organizer
- Manajemen event, kategori, FAQ, region, dan relawan event
- Upload gambar (Cloudinary)
- Pengiriman email (Nodemailer)
- Dokumentasi API otomatis (Swagger)

## Struktur Folder

- `src/controllers/` — Logic untuk setiap endpoint (auth, event, kategori, dsb)
- `src/models/` — Skema Mongoose untuk MongoDB
- `src/routes/` — Routing utama API
- `src/middlewares/` — Middleware (auth, ACL, error handler, dsb)
- `src/utils/` — Utilitas (database, JWT, response, dsb)
- `src/docs/` — Dokumentasi Swagger

## Menjalankan Secara Lokal

1. **Clone repo & install dependencies**
   ```bash
   npm install
   ```
2. **Buat file `.env`** sesuai kebutuhan (lihat contoh di `src/utils/env.ts`)
3. **Jalankan server**
   ```bash
   npm run dev
   ```
4. **Akses API** di `http://localhost:3000/api`
5. **Dokumentasi Swagger** di `http://localhost:3000/api-docs`

## Script NPM

- `npm run dev` — Menjalankan server dengan nodemon (development)
- `npm run docs` — Generate dokumentasi Swagger

## Deployment

- Sudah disiapkan untuk deployment di Vercel (`vercel.json`)

## Dependencies Utama

- express, mongoose, dotenv, cors, multer, cloudinary, nodemailer, swagger-ui-express, ejs
- TypeScript & ts-node-dev untuk development

## Kontribusi

Pull request dan issue sangat terbuka untuk pengembangan lebih lanjut.

---

**Author:** Ibrhm1
