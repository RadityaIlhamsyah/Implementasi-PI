import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed">
      <h2 className="text-xl font-bold p-4">Admin Panel</h2>
      <nav className="flex flex-col p-4 gap-4">
        <Link to="/admin/dashboard" className="hover:underline">
          Dashboard
        </Link>
        <Link to="/admin/products" className="hover:underline">
          Kelola Produk
        </Link>
        <Link to="/admin/orders" className="hover:underline">
          Kelola Pesanan
        </Link>
        <button onClick={handleLogout} className="mt-8 bg-red-600 p-2 rounded hover:bg-red-700">
          Logout
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
