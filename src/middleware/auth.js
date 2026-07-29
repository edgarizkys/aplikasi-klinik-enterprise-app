// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.headers['authorization'];
    
    if (!token) {
        return res.status(401).json({ error: 'Token diperlukan' });
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'klinik_enterprise_secret_2024');
        req.user = decoded;
        
        // Multi-tenant check
        if (req.headers['x-clinic-id'] && req.user.clinic_id !== req.headers['x-clinic-id']) {
            return res.status(403).json({ error: 'Akses klinik tidak diizinkan' });
        }
        
        next();
    } catch(e) {
        res.status(401).json({ error: 'Token tidak valid' });
    }
};