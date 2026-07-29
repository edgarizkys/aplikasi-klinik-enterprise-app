const express = require('express');
const { createClient } = require('@libsql/client');
const app = express();

app.use(express.json());

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

const tenantMiddleware = (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];
  if (!tenantId) return res.status(403).json({ error: 'Tenant ID required' });
  req.tenantId = tenantId;
  next();
};

app.use(tenantMiddleware);

app.get('/api/patients', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const rs = await db.execute({
      sql: 'SELECT * FROM patients WHERE tenant_id = ? LIMIT ? OFFSET ?',
      args: [req.tenantId, limit, offset]
    });
    res.json(rs.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/appointments', async (req, res) => {
  const { patient_id, doctor, date, status } = req.body;
  try {
    await db.execute({
      sql: 'INSERT INTO appointments (tenant_id, patient_id, doctor, date, status) VALUES (?, ?, ?, ?, ?)',
      args: [req.tenantId, patient_id, doctor, date, status]
    });
    res.status(201).json({ message: 'Created' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/reports/visits', async (req, res) => {
  try {
    const rs = await db.execute({
      sql: 'SELECT doctor, COUNT(*) as total FROM appointments WHERE tenant_id = ? GROUP BY doctor',
      args: [req.tenantId]
    });
    res.json(rs.rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () => console.log('Server running port 3000'));