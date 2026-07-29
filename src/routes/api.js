// routes/api.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/appController');

// Middleware: tenant validation
const validateTenant = (req, res, next) => {
    if (!req.headers['x-tenant-id']) return res.status(400).json({ error: 'Tenant ID wajib' });
    next();
};

router.use(validateTenant);

// Pasien
router.get('/patients', controller.getAllPatients);
router.post('/patients', controller.createPatient);

// Dokter
router.get('/doctors', controller.getAllDoctors);
router.post('/doctors', controller.createDoctor);

// Janji Temu
router.get('/appointments', controller.getAllAppointments);
router.post('/appointments', controller.createAppointment);

// Rekam Medis
router.get('/medical-records', controller.getAllMedicalRecords);
router.post('/medical-records', controller.createMedicalRecord);

// Faktur
router.get('/invoices', controller.getAllInvoices);
router.post('/invoices', controller.createInvoice);

module.exports = router;

// controllers/appController.js
const { tursoClient } = require('../config/database');

const handleQuery = async (res, sql, args) => {
    try {
        const result = await tursoClient.execute({ sql, args });
        res.json({ success: true, data: result.rows });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};

exports.getAllPatients = (req, res) => handleQuery(res, 'SELECT * FROM patients WHERE tenant_id = ?', [req.headers['x-tenant-id']]);

exports.createPatient = async (req, res) => {
    const { patient_id, name, dob, gender, address, phone, insurance_provider, medical_history_summary } = req.body;
    try {
        await tursoClient.execute({
            sql: `INSERT INTO patients (tenant_id, patient_id, name, dob, gender, address, phone, insurance_provider, medical_history_summary) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [req.headers['x-tenant-id'], patient_id, name, dob, gender, address, phone, insurance_provider, medical_history_summary]
        });
        res.status(201).json({ success: true });
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
};

// Repeat pattern for doctors, appointments, medical_records, invoices...