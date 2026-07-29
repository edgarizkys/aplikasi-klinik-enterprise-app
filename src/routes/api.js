// controllers/klinikController.js
const { tursoClient } = require('../config/database');

exports.getPatients = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default';
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        const data = await tursoClient.execute({
            sql: 'SELECT * FROM patients WHERE tenant_id = ? LIMIT ? OFFSET ?',
            args: [tenantId, limit, offset]
        });

        res.json({ success: true, data: data.rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createPatient = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default';
        const { name, phone, birth_date, address, bpjs_number } = req.body;

        await tursoClient.execute({
            sql: `INSERT INTO patients (tenant_id, name, phone, birth_date, address, bpjs_number) 
                  VALUES (?, ?, ?, ?, ?, ?)`,
            args: [tenantId, name, phone, birth_date, address, bpjs_number]
        });

        res.status(201).json({ success: true, message: 'Pasien terdaftar' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default';
        const data = await tursoClient.execute({
            sql: 'SELECT * FROM appointments WHERE tenant_id = ? ORDER BY schedule ASC',
            args: [tenantId]
        });
        res.json({ success: true, data: data.rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createAppointment = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default';
        const { patient_name, doctor_name, schedule, status, notes } = req.body;

        await tursoClient.execute({
            sql: `INSERT INTO appointments (tenant_id, patient_name, doctor_name, schedule, status, notes) 
                  VALUES (?, ?, ?, ?, ?, ?)`,
            args: [tenantId, patient_name, doctor_name, schedule, status || 'pending', notes]
        });

        res.status(201).json({ success: true, message: 'Janji dibuat' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getDoctors = async (req, res) => {
    try {
        const tenantId = req.headers['x-tenant-id'] || 'default';
        const data = await tursoClient.execute({
            sql: 'SELECT * FROM doctors WHERE tenant_id = ?',
            args: [tenantId]
        });
        res.json({ success: true, data: data.rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};