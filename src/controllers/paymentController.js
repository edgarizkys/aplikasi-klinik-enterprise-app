// controllers/paymentController.js
const paymentService = require('../services/paymentService');

const createPayment = async (req, res) => {
    try {
        const { orderId, amount, type, bank, customerInfo } = req.body;
        const tenantId = req.headers['x-tenant-id'];

        if (!tenantId) return res.status(400).json({ error: 'Tenant ID wajib' });

        let result;
        if (type === 'QRIS') {
            result = await paymentService.createQrisTransaction(orderId, amount, customerInfo);
        } else if (type === 'VA') {
            result = await paymentService.createVirtualAccountTransaction(orderId, amount, bank);
        } else {
            return res.status(400).json({ error: 'Tipe pembayaran tidak valid' });
        }

        res.status(201).json({ success: true, data: { ...result, tenantId } });
    } catch (err) {
        res.status(500).json({ error: 'Gagal proses pembayaran', details: err.message });
    }
};

const handleWebhook = (req, res) => {
    const signature = req.headers['x-payment-signature'];
    const isValid = paymentService.verifyWebhookSignature(req.body, signature);

    if (!isValid) return res.status(403).json({ error: 'Signature tidak valid' });

    // Logic update status database Turso
    console.log('Webhook diterima:', req.body);
    res.status(200).json({ status: 'OK' });
};

module.exports = { createPayment, handleWebhook };