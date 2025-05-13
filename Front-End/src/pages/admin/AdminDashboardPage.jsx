//Front-end/pages/admin/AdminDashboardPage.jsx 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@/components/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingCart, Package, Users, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [orderStats, setOrderStats] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productRes, orderRes, customerRes] = await Promise.all([axios.get('/api/products'), axios.get('/api/orders'), axios.get('/api/customers')]);

      const products = productRes.data;
      const orders = orderRes.data;
      const customers = customerRes.data;

      setProductCount(products.length);
      setOrderCount(orders.length);
      setCustomerCount(customers.length);
      setTotalRevenue(orders.reduce((total, order) => total + order.totalAmount, 0));

      setRecentOrders([...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));

      const productSalesMap = {};
      orders.forEach((order) => {
        order.items.forEach((item) => {
          if (!productSalesMap[item.name]) productSalesMap[item.name] = 0;
          productSalesMap[item.name] += item.quantity;
        });
      });

      const sortedProducts = Object.entries(productSalesMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, quantity]) => ({ name, quantity }));
      setTopProducts(sortedProducts);

      const statsByDate = {};
      orders.forEach((order) => {
        const date = new Date(order.createdAt).toLocaleDateString();
        if (!statsByDate[date]) statsByDate[date] = 0;
        statsByDate[date] += 1;
      });
      setOrderStats(Object.entries(statsByDate).map(([date, count]) => ({ date, count })));
    } catch (error) {
      console.error('Gagal memuat data dashboard:', error);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Admin Dashboard</h2>

      {/* Cards summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Total Produk" value={productCount} icon={<Package />} bgColor="bg-green-100" />
        <Card title="Total Pesanan" value={orderCount} icon={<ShoppingCart />} bgColor="bg-blue-100" />
        <Card title="Total Pelanggan" value={customerCount} icon={<Users />} bgColor="bg-yellow-100" />
        <Card title="Pendapatan" value={`Rp ${totalRevenue.toLocaleString()}`} icon={<DollarSign />} bgColor="bg-purple-100" />
      </div>

      {/* Charts and top products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow">
          <p className="font-semibold mb-2">📈 Tren Pesanan</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={orderStats}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 bg-white rounded-2xl shadow">
          <p className="font-semibold mb-2">📦 Produk Terlaris</p>
          <ul className="space-y-1">
            {topProducts.map((p, i) => (
              <li key={i}>
                {p.name} - {p.quantity} terjual
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent orders */}
      <div className="p-4 bg-white rounded-2xl shadow">
        <p className="font-semibold mb-2">🕒 5 Pesanan Terbaru</p>
        <ul className="space-y-1">
          {recentOrders.map((order) => (
            <li key={order._id}>
              {order.customerName} - {order.status} - Rp {order.totalAmount.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
