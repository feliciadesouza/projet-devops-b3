const request = require('supertest');
const app = require('../src/backend/app');

describe('Auth API', () => {
  it('GET /api/health - should return OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  it('POST /api/auth/register - should fail without data', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({});
    expect(res.status).toBe(500);
  });

  it('POST /api/auth/login - should fail with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'wrongpassword' });
    expect(res.status).toBe(404);
  });
});