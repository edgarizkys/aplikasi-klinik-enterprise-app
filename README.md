# README.md

# Aplikasi Klinik Enterprise

Sistem manajemen klinik terintegrasi. Fitur: Rekam Medis, Jadwal Dokter, Resep, Laporan.

## Stack
- Backend: Express.js
- Database: Turso SQLite
- Frontend: Tailwind CSS
- Styling: #0EA5E9 to #6366F1 gradient

## Struktur Data
1. **Pasien**: Data demografi & rekam medis.
2. **Janji Temu**: Penjadwalan & status kunjungan.
3. **Resep**: Manajemen obat & dosis.

## Instalasi
1. `npm install`
2. Set `TURSO_DB_URL` & `TURSO_AUTH_TOKEN` di `.env`.
3. `npm run migrate`
4. `npm start`

## API Endpoints
- `GET /api/patients` - List pasien
- `POST /api/appointments` - Buat janji temu
- `GET /api/prescriptions` - Lihat resep

## Fitur Utama
- **Rekam Medis Elektronik**: Akses riwayat pasien cepat.
- **Manajemen Resep**: Digitalisasi pemberian obat.
- **Laporan Kunjungan**: Analitik performa klinik.

## Lisensi
Proprietary - Klinik Enterprise.