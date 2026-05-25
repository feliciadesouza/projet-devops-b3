const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../models/index', () => ({
  Patient: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn()
  },
  User: {}
}));

const { Patient } = require('../models/index');
const app = require('../app');
const sequelize = require('../config/database');

describe('Patients API', () => {
  let token;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';

    token = jwt.sign(
      { id: 1, email: 'medecin@example.com', role: 'medecin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should reject access without token', async () => {
    const response = await request(app).get('/api/patients');

    expect(response.statusCode).toBe(401);
  });

  it('should return patients for authenticated doctor', async () => {
    const patients = [
      {
        id: 1,
        userId: 2,
        medecinId: 1,
        dateNaissance: '2000-01-01',
        typeDiabete: 'type 2',
        telephone: '90000000'
      }
    ];

    Patient.findAll.mockResolvedValue(patients);

    const response = await request(app)
      .get('/api/patients')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(Patient.findAll).toHaveBeenCalled();
  });

  it('should return a patient by id', async () => {
    Patient.findByPk.mockResolvedValue({
      id: 1,
      userId: 2,
      medecinId: 1,
      dateNaissance: '2000-01-01',
      typeDiabete: 'type 1',
      telephone: '90000000'
    });

    const response = await request(app)
      .get('/api/patients/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(1);
    expect(Patient.findByPk).toHaveBeenCalled();
  });

  it('should return 404 when patient is not found', async () => {
    Patient.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .get('/api/patients/999')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
  });

  it('should create a patient', async () => {
    Patient.create.mockResolvedValue({
      id: 1,
      userId: 2,
      medecinId: 1,
      dateNaissance: '2000-01-01',
      typeDiabete: 'type 2',
      telephone: '90000000'
    });

    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: 2,
        dateNaissance: '2000-01-01',
        typeDiabete: 'type 2',
        telephone: '90000000'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.id).toBe(1);
    expect(Patient.create).toHaveBeenCalled();
  });

  it('should update a patient', async () => {
    const updateMock = jest.fn().mockResolvedValue(true);

    Patient.findByPk.mockResolvedValue({
      id: 1,
      userId: 2,
      medecinId: 1,
      dateNaissance: '2000-01-01',
      typeDiabete: 'type 1',
      telephone: '90000000',
      update: updateMock
    });

    const response = await request(app)
      .put('/api/patients/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        dateNaissance: '2000-01-01',
        typeDiabete: 'type 2',
        telephone: '91111111'
      });

    expect(response.statusCode).toBe(200);
    expect(updateMock).toHaveBeenCalled();
  });

  it('should return 404 when updating unknown patient', async () => {
    Patient.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .put('/api/patients/999')
      .set('Authorization', `Bearer ${token}`)
      .send({
        dateNaissance: '2000-01-01',
        typeDiabete: 'type 2',
        telephone: '91111111'
      });

    expect(response.statusCode).toBe(404);
  });

  it('should return my patient profile', async () => {
    Patient.findOne.mockResolvedValue({
      id: 1,
      userId: 1,
      medecinId: 3,
      dateNaissance: '2000-01-01',
      typeDiabete: 'type 2',
      telephone: '90000000'
    });

    const response = await request(app)
      .get('/api/patients/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(1);
    expect(Patient.findOne).toHaveBeenCalled();
  });
});