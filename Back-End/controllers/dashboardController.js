// Back-End/controllers/dashboardController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

exports.getDashboardData = async (req, res) => {
  try {
    // 1. Total Pendapatan
    const orders = await Order.find();
    const revenue = orders.reduce((total, order) => {
      let orderTotal = 0;
      order.items.forEach((item) => {
        const product = req.productsMap[item.productId];
        if (product) {
          orderTotal += product.price * item.quantity;
        }
      });
      return total + orderTotal;
    }, 0);

    // 2. 5 Order Terbaru
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('items.productId');

    // 3. Produk Terlaris
    const productSales = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const id = item.productId.toString();
        productSales[id] = (productSales[id] || 0) + item.quantity;
      });
    });

    const allProducts = await Product.find();
    const topProducts = allProducts
      .map((product) => ({
        name: product.name,
        sold: productSales[product._id.toString()] || 0,
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    // 4. Total Customer
    const customerCount = await Customer.countDocuments();

    res.json({
      revenue,
      recentOrders,
      topProducts,
      customerCount,
    });
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware helper (di server.js bisa dipasang): preload products ke req.productsMap
exports.preloadProductsMap = async (req, res, next) => {
  const products = await Product.find();
  req.productsMap = products.reduce((map, product) => {
    map[product._id] = product;
    return map;
  }, {});
  next();
};
