const express = require('express');
const { createClient } = require('@libsql/client');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_TOKEN
});

// Middleware: Multi-tenant check
app.use((req, res, next) => {
  const clinicId = req.headers['x-clinic-id'];
  if (!clinicId) return res.status(403).json({ error: 'Clinic ID required' });
  req.clinicId = clinicId;
  next();
});

// CRUD Patients
app.get('/patients', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const rs = await db.execute({
    sql: 'SELECT * FROM patients WHERE clinic_id = ? LIMIT ? OFFSET ?',
    args: [req.clinicId, limit, offset]
  });
  res.json(rs.rows);
});

app.post('/patients', async (req, res) => {
  const { name, phone, birth_date, address, bpjs_number } = req.body;
  await db.execute({
    sql: 'INSERT INTO patients (clinic_id, name, phone, birth_date, address, bpjs_number) VALUES (?, ?, ?, ?, ?, ?)',
    args: [req.clinicId, name, phone, birth_date, address, bpjs_number]
  });
  res.status(201).json({ message: 'Pasien created' });
});

// Appointments
app.get('/appointments', async (req, res) => {
  const rs = await db.execute({
    sql: 'SELECT * FROM appointments WHERE clinic_id = ? ORDER BY schedule ASC',
    args: [req.clinicId]
  });
  res.json(rs.rows);
});

app.post('/appointments', async (req, res) => {
  const { patient_name, doctor_name, schedule, status, notes } = req.body;
  await db.execute({
    sql: 'INSERT INTO appointments (clinic_id, patient_name, doctor_name, schedule, status, notes) VALUES (?, ?, ?, ?, ?, ?)',
    args: [req.clinicId, patient_name, doctor_name, schedule, status, notes]
  });
  res.status(201).json({ message: 'Janji created' });
});

// Doctors
app.get('/doctors', async (req, res) => {
  const rs = await db.execute({
    sql: 'SELECT * FROM doctors WHERE clinic_id = ?',
    args: [req.clinicId]
  });
  res.json(rs.rows);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));