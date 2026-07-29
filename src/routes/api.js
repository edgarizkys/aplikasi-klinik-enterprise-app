// controllers/clinicController.js
const { tursoClient } = require('../config/database');

const getTenant = (req) => req.headers['x-tenant-id'] || 'default_tenant';

exports.getItems = async (req, res) => {
    try {
        const { entity } = req.params;
        const tenantId = getTenant(req);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const data = await tursoClient.execute({
            sql: `SELECT * FROM ${entity} WHERE tenant_id = ? LIMIT ? OFFSET ?`,
            args: [tenantId, limit, offset]
        });

        const count = await tursoClient.execute({
            sql: `SELECT COUNT(*) as total FROM ${entity} WHERE tenant_id = ?`,
            args: [tenantId]
        });

        res.json({
            success: true,
            data: data.rows,
            pagination: { page, limit, total: count.rows[0].total }
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.createItem = async (req, res) => {
    try {
        const { entity } = req.params;
        const tenantId = getTenant(req);
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        
        const sql = `INSERT INTO ${entity} (tenant_id, ${keys.join(', ')}) VALUES (?, ${keys.map(() => '?').join(', ')})`;
        const result = await tursoClient.execute({
            sql,
            args: [tenantId, ...values]
        });

        res.status(201).json({ success: true, id: Number(result.lastInsertRowid) });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

// routes/api.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/clinicController');

router.get('/:entity', ctrl.getItems);
router.post('/:entity', ctrl.createItem);

module.exports = router;

// frontend/components/ClinicTable.jsx
/* 
Tailwind classes: bg-[#0EA5E9] hover:bg-[#6366F1] transition-all
Use for buttons and headers.
*/
const ClinicTable = ({ data, columns }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-[#0EA5E9] text-white">
                <tr>
                    {columns.map(c => <th key={c.key} className="p-3">{c.label}</th>)}
                </tr>
            </thead>
            <tbody>
                {data.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                        {columns.map(c => <td key={c.key} className="p-3">{row[c.key]}</td>)}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);