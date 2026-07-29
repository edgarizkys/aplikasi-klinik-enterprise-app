// controllers/appController.js
const { tursoClient } = require('../config/database');

const getTenant = (req) => req.headers['x-tenant-id'] || 'default_tenant';

exports.getPatients = async (req, res) => {
    try {
        const tenantId = getTenant(req);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const data = await tursoClient.execute({
            sql: 'SELECT * FROM patients WHERE tenant_id = ? LIMIT ? OFFSET ?',
            args: [tenantId, limit, offset]
        });

        const count = await tursoClient.execute({
            sql: 'SELECT COUNT(*) as total FROM patients WHERE tenant_id = ?',
            args: [tenantId]
        });

        res.json({ success: true, data: data.rows, total: count.rows[0].total });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createPatient = async (req, res) => {
    try {
        const tenantId = getTenant(req);
        const { name, phone, birth_date, address, bpjs_number } = req.body;

        const result = await tursoClient.execute({
            sql: `INSERT INTO patients (tenant_id, name, phone, birth_date, address, bpjs_number) 
                  VALUES (?, ?, ?, ?, ?, ?)`,
            args: [tenantId, name, phone, birth_date, address, bpjs_number]
        });

        res.status(201).json({ success: true, id: Number(result.lastInsertRowid) });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getAppointments = async (req, res) => {
    try {
        const tenantId = getTenant(req);
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
        const tenantId = getTenant(req);
        const { patient_name, doctor_name, schedule, status, notes } = req.body;

        await tursoClient.execute({
            sql: `INSERT INTO appointments (tenant_id, patient_name, doctor_name, schedule, status, notes) 
                  VALUES (?, ?, ?, ?, ?, ?)`,
            args: [tenantId, patient_name, doctor_name, schedule, status || 'pending', notes]
        });

        res.status(201).json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getDoctors = async (req, res) => {
    try {
        const tenantId = getTenant(req);
        const data = await tursoClient.execute({
            sql: 'SELECT * FROM doctors WHERE tenant_id = ?',
            args: [tenantId]
        });
        res.json({ success: true, data: data.rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};