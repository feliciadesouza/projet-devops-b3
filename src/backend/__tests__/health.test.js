const request = require('supertest');
const app = require('../app');
const sequelize = require('../config/database');

describe('Health API', () => {
  afterAll(async () => {
    await sequelize.close();
  });

  it('should return API health status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
    expect(response.body.message).toBe('DiabèteTrack API is running');
  });
});