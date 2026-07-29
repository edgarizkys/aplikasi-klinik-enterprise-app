const express = require('express');
const { createClient } = require('@libsql/client');
const cors = require('cors');

const app = express();
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

app.use(cors());
app.use(express.json());

// Middleware: Tenant Isolation
const tenant = (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];
  if (!tenantId) return res.status(403).json({ error: 'Tenant ID required' });
  req.tenantId = tenantId;
  next();
};

// CRUD: Patients
app.get('/patients', tenant, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const rs = await db.execute({
      sql: 'SELECT * FROM patients WHERE tenant_id = ? LIMIT ? OFFSET ?',
      args: [req.tenantId, limit, offset]
    });
    res.json(rs.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/patients', tenant, async (req, res) => {
  const { name, dob, medical_record_id } = req.body;
  try {
    await db.execute({
      sql: 'INSERT INTO patients (tenant_id, name, dob, medical_record_id) VALUES (?, ?, ?, ?)',
      args: [req.tenantId, name, dob, medical_record_id]
    });
    res.status(201).json({ status: 'success' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// CRUD: Appointments
app.get('/appointments', tenant, async (req, res) => {
  try {
    const rs = await db.execute({
      sql: 'SELECT * FROM appointments WHERE tenant_id = ? ORDER BY date ASC',
      args: [req.tenantId]
    });
    res.json(rs.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// CRUD: Prescriptions
app.post('/prescriptions', tenant, async (req, res) => {
  const { appointment_id, medication, dosage } = req.body;
  try {
    await db.execute({
      sql: 'INSERT INTO prescriptions (tenant_id, appointment_id, medication, dosage) VALUES (?, ?, ?, ?)',
      args: [req.tenantId, appointment_id, medication, dosage]
    });
    res.status(201).json({ status: 'success' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(3000, () => console.log('Server running on port 3000'));