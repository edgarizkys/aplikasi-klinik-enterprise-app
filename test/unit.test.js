const request = require('supertest');
const app = require('../app');

describe('Klinik Enterprise API Tests', () => {
  
  describe('GET /api/patients', () => {
    it('fetch all patients status 200', async () => {
      const res = await request(app).get('/api/patients');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  describe('POST /api/appointments', () => {
    it('create appointment success', async () => {
      const newAppt = {
        patient_id: 'RM001',
        doctor: 'Dr. Budi',
        date: '2023-11-01T10:00:00',
        status: 'scheduled'
      };
      const res = await request(app).post('/api/appointments').send(newAppt);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
    });
  });

  describe('GET /api/prescriptions/:id', () => {
    it('fetch prescription by id', async () => {
      const res = await request(app).get('/api/prescriptions/1');
      expect(res.statusCode).toBe(200);
      expect(res.body.id).toBe(1);
    });
  });

  describe('Error Handling', () => {
    it('return 404 for invalid route', async () => {
      const res = await request(app).get('/api/invalid-endpoint');
      expect(res.statusCode).toBe(404);
    });
  });
});