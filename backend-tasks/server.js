const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const authenticateToken = require('./middleware/auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;
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
// Quản lý Tasks (Đã bảo mật)
// =======================

// 1. GET /tasks - Truy vấn công việc CỦA USER ĐANG ĐĂNG NHẬP
app.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 2. POST /tasks - Thêm công việc mới cho user
app.post('/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, priority, due_date } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const result = await pool.query(
      'INSERT INTO tasks (title, user_id, priority, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, req.user.id, priority || 'Medium', due_date || null]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 3. PUT /tasks/:id - Cập nhật task (status, title, priority, due_date)
app.put('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, title, priority, due_date } = req.body;
    
    // Đảm bảo user chỉ update được task của mình
    const result = await pool.query(
      'UPDATE tasks SET status = COALESCE($1, status), title = COALESCE($2, title), priority = COALESCE($3, priority), due_date = COALESCE($4, due_date) WHERE id = $5 AND user_id = $6 RETURNING *',
      [status, title, priority, due_date, id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 4. DELETE /tasks/:id - Xóa công việc
app.delete('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Đảm bảo user chỉ xóa được task của mình
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *', 
      [id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    res.json({ message: 'Task deleted successfully' });
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
