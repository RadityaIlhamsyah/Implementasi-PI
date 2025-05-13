// Back-End/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const verifyAdminToken = require('../middleware/verifyAdminToken');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Public - Semua orang bisa lihat produk
router.get('/', getProducts);

// Admin Only
router.post('/', verifyAdminToken, upload.single('image'), createProduct);
router.put('/:id', verifyAdminToken, upload.single('image'), updateProduct);
router.delete('/:id', verifyAdminToken, deleteProduct);

module.exports = router;
