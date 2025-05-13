//Backend/Controllers/productController.js
const Product = require('../models/Product');

// GET semua produk
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil produk' });
  }
};

// POST buat produk baru
const createProduct = async (req, res) => {
  const { name, description, price } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      image,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat produk' });
  }
};

// PUT perbarui produk
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    if (image) product.image = image;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui produk' });
  }
};

// DELETE hapus produk
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    res.json({ message: 'Produk berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus produk' });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
