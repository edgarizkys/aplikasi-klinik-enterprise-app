# Aplikasi Klinik Enterprise

Sistem manajemen klinik terpadu. Fitur: CRUD pasien, jadwal dokter, rekam medis, pembayaran, laporan keuangan, antrian online.

## Tech Stack
- Backend: Node.js, Express.js
- Database: Turso (SQLite)
- Frontend: React, Tailwind CSS (#14B8A6 → #0EA5E9)
- ORM: Drizzle

## Setup
1. `npm install`
2. `.env` setup: `TURSO_DB_URL`, `TURSO_AUTH_TOKEN`
3. `npm run db:push`
4. `npm run dev`

## Struktur Data
- `patients`: name, phone, birth_date, address, bpjs_number
- `appointments`: patient_name, doctor_name, schedule, status, notes
- `doctors`: name, speciality, schedule

## Fitur Utama
- **Manajemen Pasien**: Registrasi & riwayat medis.
- **Jadwal Dokter**: Pengaturan shift & spesialisasi.
- **Antrian**: Real-time tracking status janji.
- **Keuangan**: Laporan transaksi BPJS/Umum.

## Deployment
- Backend: Fly.io / Render
- Database: Turso
- Frontend: Vercel