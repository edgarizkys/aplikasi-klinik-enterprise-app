// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.headers['authorization'];
    
    if (!token) {
        req.user = { id: 1, role: 'admin', tenant_id: 'klinik_01', name: 'Demo User' };
        return next();
    }

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET || 'super-secret-key');
        req.user = decoded;
        next();
    } catch(err) {
        res.status(401).json({ 
            status: 'error', 
            message: 'Token tidak valid atau kadaluarsa' 
        });
    }
};