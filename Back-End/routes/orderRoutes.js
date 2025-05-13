//Back-End/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders, // untuk pelanggan (filter by customer)
  getAllOrders, // hanya admin
  updateOrderStatus, // hanya admin
} = require('../controllers/orderController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// Public
router.post('/', createOrder);
router.get('/', getOrders); // Bisa gunakan query ?customer=...

// Admin Only
router.get('/all', verifyAdminToken, getAllOrders);
router.put('/:id/status', verifyAdminToken, updateOrderStatus);

module.exports = router;
