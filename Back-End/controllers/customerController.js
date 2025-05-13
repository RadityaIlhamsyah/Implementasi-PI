//Back-End/controllers/customerController.js
const Customer = require('../models/Customer');

// Ambil semua pelanggan (untuk total pelanggan di dashboard)
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pelanggan' });
  }
};

module.exports = {
  getAllCustomers,
};
