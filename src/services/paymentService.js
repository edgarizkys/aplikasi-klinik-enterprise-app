// services/paymentService.js
const crypto = require('crypto');

class PaymentGatewayService {
    constructor() {
        this.serverKey = process.env.PAYMENT_GATEWAY_KEY || 'sk_live_klinik_enterprise';
        this.merchantId = process.env.PAYMENT_MERCHANT_ID || 'M-KLINIK-001';
    }

    async createQrisTransaction(orderId, amount, patientData = {}) {
        const referenceNo = `QRIS-${orderId}-${Date.now()}`;
        return {
            success: true,
            provider: 'Midtrans / Xendit',
            referenceNo,
            orderId,
            amount,
            currency: 'IDR',
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${referenceNo}`,
            deepLink: `gopay://pay?amount=${amount}&ref=${referenceNo}`,
            patient: patientData.name || 'Pasien Umum',
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        };
    }

    async createVirtualAccountTransaction(orderId, amount, bank = 'BCA') {
        const vaNumber = `88008${Math.floor(10000000 + Math.random() * 90000000)}`;
        return {
            success: true,
            provider: `${bank.toUpperCase()} Virtual Account`,
            orderId,
            amount,
            vaNumber,
            instructions: `Transfer ke ${bank.toUpperCase()} VA: ${vaNumber} untuk pembayaran layanan klinik.`,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
    }

    async processBpjsClaim(appointmentId, bpjsNumber) {
        if (!bpjsNumber) throw new Error('Nomor BPJS wajib diisi');
        return {
            success: true,
            status: 'PENDING_VERIFICATION',
            claimId: `BPJS-${appointmentId}-${Date.now()}`,
            message: 'Klaim BPJS diajukan ke sistem verifikasi pusat.'
        };
    }

    verifyWebhookSignature(payload, signature) {
        if (!signature) return false;
        const expectedSig = crypto.createHmac('sha256', this.serverKey)
            .update(JSON.stringify(payload)).digest('hex');
        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig));
    }
}

module.exports = new PaymentGatewayService();