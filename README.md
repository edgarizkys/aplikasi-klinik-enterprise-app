# Aplikasi Klinik Enterprise

Sistem manajemen klinik terintegrasi. Fitur: pasien, dokter, janji temu, rekam medis, faktur.

## Stack
- Backend: Node.js, Express.js
- Database: Turso (SQLite)
- Frontend: Tailwind CSS, Vite
- Auth: JWT

## Setup
1. `npm install`
2. `.env` setup:
   ```
   TURSO_DATABASE_URL=...
   TURSO_AUTH_TOKEN=...
   ```
3. `npm run dev`

## Struktur Entitas
- `patients`: Data demografi pasien.
- `doctors`: Profil dokter & spesialisasi.
- `appointments`: Penjadwalan kunjungan.
- `medical_records`: EMR & riwayat medis.
- `invoices`: Penagihan & status pembayaran.

## API
- `GET /api/patients` - List pasien
- `POST /api/appointments` - Buat janji temu
- `GET /api/medical-records/:id` - Ambil rekam medis

## Lisensi
MIT.