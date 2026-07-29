const express = require('express');
const { createClient } = require('@libsql/client');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Middleware: Tenant isolation
app.use((req, res, next) => {
  req.clinic_id = req.headers['x-clinic-id'] || 'default';
  next();
});

// CRUD Patients
app.get('/patients', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const result = await db.execute({
    sql: 'SELECT * FROM patients WHERE clinic_id = ? LIMIT ? OFFSET ?',
    args: [req.clinic_id, limit, offset]
  });
  res.json(result.rows);
});

app.post('/patients', async (req, res) => {
  const { name, phone, birth_date, address, bpjs_number } = req.body;
  await db.execute({
    sql: 'INSERT INTO patients (clinic_id, name, phone, birth_date, address, bpjs_number) VALUES (?, ?, ?, ?, ?, ?)',
    args: [req.clinic_id, name, phone, birth_date, address, bpjs_number]
  });
  res.status(201).json({ message: 'Pasien created' });
});

// Appointments
app.get('/appointments', async (req, res) => {
  const result = await db.execute({
    sql: 'SELECT * FROM appointments WHERE clinic_id = ? ORDER BY schedule ASC',
    args: [req.clinic_id]
  });
  res.json(result.rows);
});

// Doctors
app.get('/doctors', async (req, res) => {
  const result = await db.execute({
    sql: 'SELECT * FROM doctors WHERE clinic_id = ?',
    args: [req.clinic_id]
  });
  res.json(result.rows);
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));