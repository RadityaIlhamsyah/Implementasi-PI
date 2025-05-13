//Back-End/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dashboardController = require('../controllers/dashboardController');
const verifyAdminToken = require('../middleware/verifyAdminToken'); // tanpa destructuring
const isAdmin = require('../middleware/isAdmin');

// Rute hanya bisa diakses oleh admin
router.get('/data', isAdmin, (req, res) => {
  res.json({ message: 'Data rahasia hanya untuk admin' });
});

module.exports = router;

// Dummy Admin Credentials
const ADMIN_USER = {
  username: 'admin',
  password: 'admin123', // Gunakan bcrypt di produksi!
};

// Endpoint login admin
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    const token = jwt.sign({ username }, 'adminsecretkey', { expiresIn: '2h' });
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Username atau password salah' });
});

// Cek apakah semua middleware adalah fungsi valid
if (typeof verifyAdminToken === 'function' && typeof dashboardController.preloadProductsMap === 'function' && typeof dashboardController.getDashboardData === 'function') {
  router.get('/dashboard', verifyAdminToken, dashboardController.preloadProductsMap, dashboardController.getDashboardData);
} else {
  console.error('❌ Middleware atau controller belum terdefinisi dengan benar!');
}

module.exports = router;
