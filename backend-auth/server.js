const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const authenticateToken = require('./middleware/auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_123';

// Middleware
app.use(cors());
app.use(express.json());

// Metrics Middleware (Prometheus)
const promBundle = require("express-prom-bundle");
const metricsMiddleware = promBundle({ 
  includeMethod: true, 
  includePath: true, 
  includeStatusCode: true,
  promClient: {
    collectDefaultMetrics: {}
  }
});
app.use(metricsMiddleware);

// =======================
// Xử lý Đăng ký / Đăng nhập
// =======================

// Đăng ký (Register)
app.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Vui lòng điền đủ username và password' });
    }

    // Kiểm tra user đã tồn tại chưa
    const userExist = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: 'Tên người dùng đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Lưu vào DB
    const newUser = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, passwordHash]
    );

    res.status(201).json({ message: 'Đăng ký thành công', user: newUser.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Đăng nhập (Login)
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Tìm user trong DB
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
    }

    // So sánh mật khẩu
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu' });
    }

    // Tạo JWT Token
    const token = jwt.sign(
      { id: user.rows[0].id, username: user.rows[0].username },
      JWT_SECRET,
      { expiresIn: '1d' } // Hết hạn sau 1 ngày
    );

    res.json({ token, user: { id: user.rows[0].id, username: user.rows[0].username } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { app, pool };
