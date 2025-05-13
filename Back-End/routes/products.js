// routes/products.js
const express = require('express');
const router = express.Router();

// Contoh data produk dummy
const dummyProducts = [
  { id: 1, name: 'Kue Cucur', price: 10000 },
  { id: 2, name: 'Lemper Ayam', price: 8000 },
];

// GET semua produk
router.get('/', (req, res) => {
  res.json(dummyProducts);
});

module.exports = router;
