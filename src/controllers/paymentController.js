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
    if (!orderId || !amount || !method) return res.status(400).json({ error: 'Data kurang' });

    let result;
    if (method === 'QRIS') {
      result = await paymentService.createQrisTransaction(orderId, amount);
    } else if (method === 'VA') {
      result = await paymentService.createVirtualAccountTransaction(orderId, amount, bank);
    }

    await db.execute({
      sql: 'INSERT INTO payments (order_id, tenant_id, amount, status, provider, ref_no) VALUES (?, ?, ?, ?, ?, ?)',
      args: [orderId, tenantId, amount, 'pending', result.provider, result.referenceNo || result.vaNumber]
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Gagal proses pembayaran' });
  }
};

exports.handleWebhook = async (req, res) => {
  const signature = req.headers['x-payment-signature'];
  if (!paymentService.verifyWebhookSignature(req.body, signature)) {
    return res.status(403).json({ error: 'Signature tidak valid' });
  }

  const { order_id, status } = req.body;
  try {
    await db.execute({
      sql: 'UPDATE payments SET status = ? WHERE order_id = ?',
      args: [status, order_id]
    });
    res.status(200).send('OK');
  } catch (err) {
    res.status(500).json({ error: 'Gagal update status' });
  }
};

exports.getPaymentHistory = async (req, res) => {
  const { tenantId, page = 1 } = req.query;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const rs = await db.execute({
      sql: 'SELECT * FROM payments WHERE tenant_id = ? LIMIT ? OFFSET ?',
      args: [tenantId, limit, offset]
    });
    res.json(rs.rows);
  } catch (err) {
    res.status(500).json({ error: 'Gagal ambil data' });
  }
};