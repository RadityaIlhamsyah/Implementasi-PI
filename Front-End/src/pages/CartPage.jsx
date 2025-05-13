// Front-End/src/pages/CartPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ChevronLeft, Plus, Minus, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate total
  const subtotal = cart.reduce((total, item) => {
    return total + item.price * (item.qty || 1);
  }, 0);

  // Format price to Indonesian Rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty >= 1) {
      updateQty(id, newQty);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      // If user is not logged in, redirect to login page with return URL
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Keranjang Belanja</h1>
          <Link to="/products" className="text-teal-600 hover:text-teal-700 font-medium flex items-center">
            <ChevronLeft size={16} className="mr-1" />
            Lanjutkan Belanja
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <ShoppingBag size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Keranjang Anda Kosong</h2>
            <p className="text-gray-600 mb-6">Anda belum menambahkan produk apapun ke keranjang.</p>
            <Link to="/products" className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 transition duration-200">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800">Produk yang Dipesan</h2>
                    <button onClick={clearCart} className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
                      <Trash2 size={14} className="mr-1" />
                      Kosongkan Keranjang
                    </button>
                  </div>
                </div>

                <ul>
                  {cart.map((item) => (
                    <li key={item._id} className="p-4 border-b flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="sm:w-24 h-24">
                        {item.image ? (
                          <img src={`/uploads/${item.image}`} alt={item.name} className="w-full h-full object-cover rounded" />
                        ) : (
                          <div className="bg-gray-200 w-full h-full flex items-center justify-center rounded">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <Link to={`/products/${item._id}`} className="font-semibold text-gray-800 hover:text-teal-600">
                          {item.name}
                        </Link>
                        <p className="text-gray-500 text-sm">{formatPrice(item.price)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center">
                        <button onClick={() => handleQuantityChange(item._id, item.qty || 1, -1)} className="border border-gray-300 rounded-l p-1 hover:bg-gray-100 transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="border-t border-b border-gray-300 py-1 px-3 min-w-[40px] text-center">{item.qty || 1}</span>
                        <button onClick={() => handleQuantityChange(item._id, item.qty || 1, 1)} className="border border-gray-300 rounded-r p-1 hover:bg-gray-100 transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Item Total & Remove Button */}
                      <div className="flex flex-col items-end justify-between">
                        <span className="font-bold text-gray-800">{formatPrice(item.price * (item.qty || 1))}</span>
                        <button onClick={() => removeFromCart(item._id)} className="text-red-600 hover:text-red-700">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-semibold text-xl text-gray-800 mb-4">Ringkasan Pesanan</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="border-t pt-3 font-bold flex justify-between">
                    <span>Total</span>
                    <span className="text-teal-600">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <button onClick={handleCheckout} className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-200">
                  Lanjutkan ke Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
