import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-orange-500 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white font-bold text-xl">
          Toko Cici Kitchen
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-orange-200">
            Home
          </Link>
          <Link to="/products" className="text-white hover:text-orange-200">
            Produk
          </Link>
          <Link to="/cart" className="text-white hover:text-orange-200">
            Keranjang
          </Link>
          <Link to="/login" className="text-white hover:text-orange-200">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
