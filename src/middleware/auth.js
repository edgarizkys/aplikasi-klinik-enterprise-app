// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const authHeader = req.headers['authorization'];
    const tenantId = req.headers['x-tenant-id'];

    if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID wajib' });
    }

    if (!authHeader) {
        req.user = { id: 'guest', role: 'public', tenantId };
        return next();
    }

    try {
        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'klinik-secret-key');
        
        if (decoded.tenantId !== tenantId) {
            return res.status(403).json({ error: 'Akses tenant ditolak' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token tidak valid' });
    }
};