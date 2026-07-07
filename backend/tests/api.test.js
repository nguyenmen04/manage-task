const request = require('supertest');
const { app, pool } = require('../server');

// Mock pool.query để không gọi DB thật
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    on: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('Backend API Unit Tests', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('Auth API', () => {
    it('should return 400 if missing username or password on register', async () => {
      const res = await request(app).post('/auth/register').send({ username: 'test' });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should register a new user successfully', async () => {
      // Giả lập DB trả về user vừa tạo
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, username: 'testuser' }] });
      
      const res = await request(app).post('/auth/register').send({
        username: 'testuser',
        password: 'password123'
      });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.username).toBe('testuser');
    });
  });

  describe('Tasks API', () => {
    it('should return 401 if accessing /tasks without token', async () => {
      const res = await request(app).get('/tasks');
      expect(res.statusCode).toEqual(401);
    });
  });
});
