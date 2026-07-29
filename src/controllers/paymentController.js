// controllers/paymentController.js
const paymentService = require('../services/paymentService');

const createPayment = async (req, res) => {
    try {
        const { orderId, amount, type, bank, customerInfo } = req.body;
        const tenantId = req.headers['x-tenant-id'];

        if (!tenantId) return res.status(400).json({ error: 'Tenant ID wajib' });
        if (!orderId || !amount) return res.status(400).json({ error: 'Data tidak lengkap' });

        let result;
        if (type === 'QRIS') {
            result = await paymentService.createQrisTransaction(orderId, amount, customerInfo);
        } else if (type === 'VA') {
            result = await paymentService.createVirtualAccountTransaction(orderId, amount, bank);
        } else {
            return res.status(400).json({ error: 'Tipe pembayaran tidak valid' });
        }

        res.status(201).json({ ...result, tenantId });
    } catch (err) {
        res.status(500).json({ error: 'Gagal proses pembayaran', details: err.message });
    }
};

const handleWebhook = (req, res) => {
    const signature = req.headers['x-payment-signature'];
    const isValid = paymentService.verifyWebhookSignature(req.body, signature);

    if (!isValid) return res.status(403).json({ error: 'Signature tidak valid' });

    // Update status faktur di database Turso
    const { orderId, status } = req.body;
    console.log(`Update faktur ${orderId} ke ${status}`);

    res.status(200).json({ received: true });
};

module.exports = { createPayment, handleWebhook };