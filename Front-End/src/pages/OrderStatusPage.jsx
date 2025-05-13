// Front-End/src/pages/OrderStatusPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const OrderStatusPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders?customer=${user.name}`);
        setOrders(res.data);
      } catch (err) {
        console.error('Gagal mengambil data pesanan:', err);
      }
    };

    if (user?.name) {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Status Pesanan Anda</h2>
      {orders.length === 0 ? (
        <p>Belum ada pesanan.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border rounded p-4 mb-4 shadow">
            <p>
              <strong>Tanggal:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {order.status}
            </p>
            <p>
              <strong>Total:</strong> Rp{order.total}
            </p>
            <div className="mt-2">
              <strong>Item:</strong>
              <ul className="list-disc ml-6">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} x{item.qty} - Rp{item.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderStatusPage;
