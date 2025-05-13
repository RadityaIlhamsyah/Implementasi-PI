import React, { useEffect, useState } from 'react';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await axios.get('/api/orders');
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    await axios.put(`/api/orders/${id}`, { status });
    fetchOrders();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Kelola Pesanan</h2>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order._id} className="border p-3 rounded">
            <p>
              <strong>Nama:</strong> {order.customerName}
            </p>
            <p>
              <strong>No HP:</strong> {order.phone}
            </p>
            <p>
              <strong>Status:</strong>
              <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="ml-2 border p-1 rounded">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
              </select>
            </p>
            <p className="mt-2 font-semibold">Item:</p>
            <ul className="list-disc pl-5">
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.productId?.name || 'Produk dihapus'} - Qty: {item.quantity}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderManagement;
