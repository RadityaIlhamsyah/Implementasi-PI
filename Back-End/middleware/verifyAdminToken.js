//Back-End/middleware/verifyAdminToken.js
const jwt = require('jsonwebtoken');

const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak tersedia.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'adminsecretkey');
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token tidak valid atau kadaluarsa.' });
  }
};

module.exports = verifyAdminToken;
