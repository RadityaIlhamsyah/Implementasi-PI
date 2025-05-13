// Backend/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');

// Ambil semua pesanan (untuk pelanggan)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId', 'name price').sort({ createdAt: -1 }); // terbaru dulu

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tambah pesanan
exports.createOrder = async (req, res) => {
  try {
    const { customerName, phone, items } = req.body;

    const newOrder = new Order({ customerName, phone, items });
    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Ubah status pesanan (untuk admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) return res.status(404).json({ message: 'Order tidak ditemukan' });

    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Ambil semua pesanan (khusus admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId', 'name price').sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
