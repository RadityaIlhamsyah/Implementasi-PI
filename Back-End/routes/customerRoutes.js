//Back-End/routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { getAllCustomers } = require('../controllers/customerController');

// Register pelanggan baru
router.post('/register', async (req, res) => {
  try {
    const { name, phone } = req.body;
    const existing = await Customer.findOne({ phone });

    if (existing) return res.status(400).json({ message: 'Customer sudah terdaftar' });

    const newCustomer = new Customer({ name, phone });
    await newCustomer.save();

    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verifikasi pelanggan (login sederhana dengan nomor HP)
router.post('/verify', async (req, res) => {
  try {
    const { phone } = req.body;
    const customer = await Customer.findOne({ phone });

    if (!customer) {
      return res.status(404).json({ message: 'Pelanggan tidak ditemukan' });
    }

    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cari pelanggan berdasarkan nomor HP
router.get('/phone/:phone', async (req, res) => {
  try {
    const customer = await Customer.findOne({ phone: req.params.phone });

    if (!customer) {
      return res.status(404).json({ message: 'Pelanggan tidak ditemukan' });
    }

    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ambil semua pelanggan (untuk dashboard admin)
router.get('/', getAllCustomers);

module.exports = router;
