# Aplikasi Klinik Enterprise

Sistem manajemen klinik terintegrasi. Fitur: CRUD Pasien, Jadwal Dokter, Rekam Medis, Pembayaran, Laporan Keuangan, Antrian Online.

## Tech Stack
- Backend: Node.js, Express.js
- Database: Turso SQLite (LibSQL)
- Frontend: React, Tailwind CSS
- Styling: #14B8A6 (Teal) to #0EA5E9 (Sky)

## Struktur Entitas
1. **Pasien**: Data demografi, BPJS.
2. **Dokter**: Spesialisasi, jadwal praktik.
3. **Janji**: Antrian, status, catatan medis.

## Instalasi
1. `npm install`
2. Konfigurasi `TURSO_DB_URL` & `TURSO_AUTH_TOKEN` di `.env`.
3. `npm run migrate`
4. `npm run dev`

## API Endpoints
- `GET /api/patients` - List pasien
- `POST /api/appointments` - Buat janji
- `GET /api/doctors` - Jadwal dokter
- `GET /api/reports` - Laporan keuangan

## Lisensi
MIT.