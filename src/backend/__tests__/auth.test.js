const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models/index', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  }
}));

const { User } = require('../models/index');
const app = require('../app');
const sequelize = require('../config/database');

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: 1 });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'SOUZA',
          prenom: 'Felicia',
          email: 'felicia@example.com',
          password: 'password123',
          role: 'user'
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.userId).toBe(1);
      expect(User.findOne).toHaveBeenCalled();
      expect(User.create).toHaveBeenCalled();
    });

    it('should reject registration when email already exists', async () => {
      User.findOne.mockResolvedValue({ id: 1, email: 'felicia@example.com' });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          nom: 'SOUZA',
          prenom: 'Felicia',
          email: 'felicia@example.com',
          password: 'password123',
          role: 'user'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.message).toContain('Email');
      expect(User.create).not.toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a valid user and return a token', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);

      User.findOne.mockResolvedValue({
        id: 1,
        nom: 'SOUZA',
        prenom: 'Felicia',
        email: 'felicia@example.com',
        password: hashedPassword,
        role: 'user'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'felicia@example.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.nom).toBe('SOUZA');
    });

    it('should reject login when user is not found', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'unknown@example.com',
          password: 'password123'
        });

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBeDefined();
    });

    it('should reject login with invalid password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);

      User.findOne.mockResolvedValue({
        id: 1,
        nom: 'SOUZA',
        prenom: 'Felicia',
        email: 'felicia@example.com',
        password: hashedPassword,
        role: 'user'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'felicia@example.com',
          password: 'wrongpassword'
        });

      expect(response.statusCode).toBe(401);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return the authenticated user', async () => {
      const token = jwt.sign(
        { id: 1, email: 'felicia@example.com', role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      User.findByPk.mockResolvedValue({
        id: 1,
        nom: 'SOUZA',
        prenom: 'Felicia',
        email: 'felicia@example.com',
        role: 'user'
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.email).toBe('felicia@example.com');
    });

    it('should reject access without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.statusCode).toBe(401);
    });
  });
});