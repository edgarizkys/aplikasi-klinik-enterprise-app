const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/appController');
const payCtrl = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.get('/analytics', auth, ctrl.getAnalytics);
router.post('/payment/qris', auth, payCtrl.createQris);
router.post('/payment/va', auth, payCtrl.createVa);
router.post('/payment/webhook', payCtrl.handleWebhook);

router.get('/patients', auth, ctrl.getAllPatients);
router.post('/patients', auth, ctrl.createPatients);
router.delete('/patients/:id', auth, ctrl.deletePatients);
router.get('/appointments', auth, ctrl.getAllAppointments);
router.post('/appointments', auth, ctrl.createAppointments);
router.delete('/appointments/:id', auth, ctrl.deleteAppointments);
router.get('/doctors', auth, ctrl.getAllDoctors);
router.post('/doctors', auth, ctrl.createDoctors);
router.delete('/doctors/:id', auth, ctrl.deleteDoctors);

module.exports = router;