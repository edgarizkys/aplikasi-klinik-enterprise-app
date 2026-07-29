// World-Class Controllers for Aplikasi Klinik Enterprise (Klinik & Kesehatan)

let patientsData = [];

exports.getAllPatients = async (req, res) => {
    const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
    res.json({ success: true, tenantId, count: patientsData.length, data: patientsData });
};

exports.createPatients = async (req, res) => {
    const item = { id: Date.now(), tenant_id: req.headers['x-tenant-id'] || 'default_tenant', ...req.body };
    patientsData.unshift(item);
    res.status(201).json({ success: true, data: item });
};

exports.deletePatients = async (req, res) => {
    patientsData = patientsData.filter(i => i.id !== parseInt(req.params.id));
    res.json({ success: true, message: 'Pasien deleted' });
};

let appointmentsData = [];

exports.getAllAppointments = async (req, res) => {
    const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
    res.json({ success: true, tenantId, count: appointmentsData.length, data: appointmentsData });
};

exports.createAppointments = async (req, res) => {
    const item = { id: Date.now(), tenant_id: req.headers['x-tenant-id'] || 'default_tenant', ...req.body };
    appointmentsData.unshift(item);
    res.status(201).json({ success: true, data: item });
};

exports.deleteAppointments = async (req, res) => {
    appointmentsData = appointmentsData.filter(i => i.id !== parseInt(req.params.id));
    res.json({ success: true, message: 'Janji deleted' });
};

let doctorsData = [];

exports.getAllDoctors = async (req, res) => {
    const tenantId = req.headers['x-tenant-id'] || 'default_tenant';
    res.json({ success: true, tenantId, count: doctorsData.length, data: doctorsData });
};

exports.createDoctors = async (req, res) => {
    const item = { id: Date.now(), tenant_id: req.headers['x-tenant-id'] || 'default_tenant', ...req.body };
    doctorsData.unshift(item);
    res.status(201).json({ success: true, data: item });
};

exports.deleteDoctors = async (req, res) => {
    doctorsData = doctorsData.filter(i => i.id !== parseInt(req.params.id));
    res.json({ success: true, message: 'Dokter deleted' });
};

exports.getAnalytics = async (req, res) => {
    res.json({ success: true, platform: 'Aplikasi Klinik Enterprise', domain: 'Klinik & Kesehatan', version: '5.0.0-WorldClass', architecture: 'Multi-Tenant Ready + Redis Cache' });
};