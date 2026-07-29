// app.js - Express + Turso SQLite
require('dotenv').config();
const express = require('express');
const { createClient } = require('@libsql/client');
const cors = require('cors');

const app = express();
const db = createClient({ url: process.env.TURSO_URL, authToken: process.env.TURSO_TOKEN });

app.use(cors());
app.use(express.json());

// Middleware: Multi-tenant context
app.use((req, res, next) => {
    req.clinic_id = req.headers['x-clinic-id'] || 'default';
    next();
});

// CRUD Patients
app.get('/api/patients', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const rs = await db.execute({
        sql: 'SELECT * FROM patients WHERE clinic_id = ? LIMIT ? OFFSET ?',
        args: [req.clinic_id, limit, offset]
    });
    res.json(rs.rows);
});

app.post('/api/patients', async (req, res) => {
    const { name, phone, birth_date, address, bpjs_number } = req.body;
    await db.execute({
        sql: 'INSERT INTO patients (clinic_id, name, phone, birth_date, address, bpjs_number) VALUES (?, ?, ?, ?, ?, ?)',
        args: [req.clinic_id, name, phone, birth_date, address, bpjs_number]
    });
    res.status(201).json({ status: 'success' });
});

// Appointments
app.get('/api/appointments', async (req, res) => {
    const rs = await db.execute({
        sql: 'SELECT * FROM appointments WHERE clinic_id = ? ORDER BY schedule ASC',
        args: [req.clinic_id]
    });
    res.json(rs.rows);
});

// Financial Report
app.get('/api/reports/finance', async (req, res) => {
    const rs = await db.execute({
        sql: 'SELECT SUM(amount) as total FROM payments WHERE clinic_id = ? AND status = "paid"',
        args: [req.clinic_id]
    });
    res.json(rs.rows[0]);
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));