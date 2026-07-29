// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token akses diperlukan' 
        });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'klinik-enterprise-secret-2024');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ 
            success: false, 
            message: 'Token tidak valid atau kadaluarsa' 
        });
    }
};