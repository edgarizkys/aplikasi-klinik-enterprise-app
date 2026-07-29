const express = require('express');
const { createClient } = require('@libsql/client');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

// Init tables
db.execute(`CREATE TABLE IF NOT EXISTS patients (id INTEGER PRIMARY KEY, name TEXT, phone TEXT, birth_date DATE, address TEXT, bpjs_number TEXT)`);
db.execute(`CREATE TABLE IF NOT EXISTS doctors (id INTEGER PRIMARY KEY, name TEXT, speciality TEXT, schedule TEXT)`);
db.execute(`CREATE TABLE IF NOT EXISTS appointments (id INTEGER PRIMARY KEY, patient_name TEXT, doctor_name TEXT, schedule DATETIME, status TEXT, notes TEXT)`);

// CRUD Patients
app.get('/api/patients', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  const result = await db.execute({ sql: 'SELECT * FROM patients LIMIT ? OFFSET ?', args: [limit, offset] });
  res.json(result.rows);
});

app.post('/api/patients', async (req, res) => {
  const { name, phone, birth_date, address, bpjs_number } = req.body;
  await db.execute({ 
    sql: 'INSERT INTO patients (name, phone, birth_date, address, bpjs_number) VALUES (?, ?, ?, ?, ?)', 
    args: [name, phone, birth_date, address, bpjs_number] 
  });
  res.status(201).send('Pasien created');
});

// CRUD Appointments
app.get('/api/appointments', async (req, res) => {
  const result = await db.execute('SELECT * FROM appointments');
  res.json(result.rows);
});

app.post('/api/appointments', async (req, res) => {
  const { patient_name, doctor_name, schedule, status, notes } = req.body;
  await db.execute({
    sql: 'INSERT INTO appointments (patient_name, doctor_name, schedule, status, notes) VALUES (?, ?, ?, ?, ?)',
    args: [patient_name, doctor_name, schedule, status, notes]
  });
  res.status(201).send('Janji created');
});

// CRUD Doctors
app.get('/api/doctors', async (req, res) => {
  const result = await db.execute('SELECT * FROM doctors');
  res.json(result.rows);
});

app.listen(3000, () => console.log('Server running port 3000'));