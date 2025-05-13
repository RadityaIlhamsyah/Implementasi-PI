const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // Tambahan untuk middleware

const router = express.Router();

// Register endpoint dengan validasi
router.post(
  '/register',
  [
    // Validasi input
    body('username').notEmpty().withMessage('Username diperlukan'),
    body('email').isEmail().withMessage('Email tidak valid'),
    body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  ],
  async (req, res) => {
    try {
      // Cek hasil validasi
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;

      // Cek apakah email sudah terdaftar
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
      }

      // Buat user baru (password akan di-hash oleh pre-save hook)
      const user = new User({
        username,
        email,
        password,
      });

      // Simpan user ke database
      await user.save();

      res.status(201).json({
        success: true,
        message: 'Registrasi berhasil',
        userId: user._id,
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login endpoint
router.post('/login', [body('email').isEmail().withMessage('Email tidak valid'), body('password').notEmpty().withMessage('Password diperlukan')], async (req, res) => {
  try {
    // Cek hasil validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    // Verifikasi password dengan method dari model User
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    // Buat JWT token
    const token = jwt.sign({ id: user._id, email: user.email, username: user.username, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: '1d' });

    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint validasi token (opsional)
router.get('/validate-token', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ valid: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ valid: false });
    }

    res.json({ valid: true, user });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

// Endpoint untuk ambil data user berdasarkan token
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Auth Me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
