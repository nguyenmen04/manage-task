const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  // Lấy token từ header Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Truy cập bị từ chối: Thiếu token.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
    
    // Lưu thông tin user vào request để dùng ở các route sau
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
