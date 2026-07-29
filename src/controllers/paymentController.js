// controllers/paymentController.js
const paymentService = require('../services/paymentService');
const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

exports.processPayment = async (req, res) => {
  try {
    const { orderId, amount, method, bank, tenantId } = req.body;
    
    if (!orderId || !amount || !tenantId) {
      return res.status(400).json({ error: 'Data tidak lengkap' });
    }

    let result;
    if (method === 'QRIS') {
      result = await paymentService.createQrisTransaction(orderId, amount);
    } else if (method === 'VA') {
      result = await paymentService.createVirtualAccountTransaction(orderId, amount, bank);
    } else {
      return res.status(400).json({ error: 'Metode tidak didukung' });
    }

    await db.execute({
      sql: 'INSERT INTO payments (order_id, tenant_id, amount, status, reference_no) VALUES (?, ?, ?, ?, ?)',
      args: [orderId, tenantId, amount, 'pending', result.referenceNo || result.vaNumber]
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.handleWebhook = async (req, res) => {
  const signature = req.headers['x-payment-signature'];
  const isValid = paymentService.verifyWebhookSignature(req.body, signature);

  if (!isValid) return res.status(403).json({ error: 'Signature invalid' });

  const { order_id, status } = req.body;
  
  try {
    await db.execute({
      sql: 'UPDATE payments SET status = ? WHERE order_id = ?',
      args: [status, order_id]
    });
    res.status(200).send('OK');
  } catch (err) {
    res.status(500).json({ error: 'Database update failed' });
  }
};

exports.getPaymentHistory = async (req, res) => {
  const { tenantId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const rs = await db.execute({
      sql: 'SELECT * FROM payments WHERE tenant_id = ? LIMIT ? OFFSET ?',
      args: [tenantId, limit, offset]
    });
    res.status(200).json(rs.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};