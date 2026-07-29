const request = require('supertest');
const app = require('../app');

describe('Klinik Enterprise API Endpoints', () => {
  const entities = ['patients', 'doctors', 'appointments', 'medical_records', 'invoices'];

  entities.forEach(entity => {
    describe(`GET /api/${entity}`, () => {
      it(`should return 200 and list of ${entity}`, async () => {
        const res = await request(app).get(`/api/${entity}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
      });
    });
  });

  describe('POST /api/appointments', () => {
    it('should create new appointment', async () => {
      const newAppt = {
        appointment_id: 'A999',
        patient_name: 'Test User',
        doctor_name: 'Dr. Test',
        date: '2024-12-31',
        time: '09:00',
        status: 'Terjadwal',
        reason: 'Checkup'
      };
      const res = await request(app).post('/api/appointments').send(newAppt);
      expect(res.statusCode).toBe(201);
      expect(res.body.appointment_id).toBe('A999');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for invalid route', async () => {
      const res = await request(app).get('/api/nonexistent');
      expect(res.statusCode).toBe(404);
    });
  });
});