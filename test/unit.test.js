// unit.test.js
const request = require('supertest');
const app = require('./app');

describe('Klinik Enterprise API Tests', () => {
  
  describe('GET /api/patients', () => {
    it('fetch all patients with pagination', async () => {
      const res = await request(app).get('/api/patients?page=1&limit=10');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/appointments', () => {
    it('create appointment with valid data', async () => {
      const newAppt = {
        patient_name: 'Budi Santoso',
        doctor_name: 'Dr. Andi',
        schedule: '2026-08-01T10:00:00Z',
        status: 'pending',
        notes: 'Konsultasi rutin'
      };
      const res = await request(app).post('/api/appointments').send(newAppt);
      expect(res.statusCode).toBe(201);
      expect(res.body.patient_name).toBe(newAppt.patient_name);
    });

    it('reject appointment without required fields', async () => {
      const res = await request(app).post('/api/appointments').send({});
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/doctors', () => {
    it('return list of doctors', async () => {
      const res = await request(app).get('/api/doctors');
      expect(res.statusCode).toBe(200);
      expect(res.body).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('return 404 for non-existent route', async () => {
      const res = await request(app).get('/api/invalid-route');
      expect(res.statusCode).toBe(404);
    });
  });
});