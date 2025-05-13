//Front-End/context/CartContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

// Membuat konteks untuk keranjang belanja
const CartContext = createContext();

// Provider untuk Cart
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Mengambil data keranjang dari localStorage atau API saat komponen dimuat
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        let fetchedCart = [];

        if (user) {
          // Jika user login, ambil keranjang dari API
          const response = await api.get('/api/cart');
          fetchedCart = response.data;
        } else {
          // Jika tidak login, ambil dari localStorage
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            fetchedCart = JSON.parse(savedCart);
          }
        }

        // Validasi item dalam cart agar tidak error
        const validCart = fetchedCart.filter((item) => item && item.product && typeof item.product.price === 'number' && typeof item.quantity === 'number');

        setCart(validCart);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Gagal memuat data keranjang');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // Menyimpan perubahan keranjang ke localStorage jika tidak login
  useEffect(() => {
    if (!user && cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  // Menambahkan produk ke keranjang
  const addToCart = async (product, quantity = 1) => {
    try {
      setError(null);

      const existingItemIndex = cart.findIndex((item) => item.product._id === product._id);
      let newCart;

      if (existingItemIndex >= 0) {
        newCart = [...cart];
        newCart[existingItemIndex].quantity += quantity;
      } else {
        newCart = [...cart, { product, quantity }];
      }

      if (user) {
        await api.post(
          '/api/cart',
          {
            productId: product._id,
            quantity,
          },
          {
            withCredentials: true,
          }
        );
      }

      setCart(newCart);
      return newCart;
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Gagal menambahkan produk ke keranjang');
      throw err;
    }
  };

  // Mengubah quantity produk di keranjang
  const updateQuantity = async (productId, quantity) => {
    try {
      setError(null);

      if (quantity <= 0) {
        return removeFromCart(productId);
      }

      const newCart = cart.map((item) => (item.product._id === productId ? { ...item, quantity } : item));

      if (user) {
        await api.put(
          `/api/cart/${productId}`,
          {
            quantity,
          },
          {
            withCredentials: true,
          }
        );
      }

      setCart(newCart);
      return newCart;
    } catch (err) {
      console.error('Error updating cart quantity:', err);
      setError('Gagal mengubah jumlah produk');
      throw err;
    }
  };

  // Menghapus produk dari keranjang
  const removeFromCart = async (productId) => {
    try {
      setError(null);

      const newCart = cart.filter((item) => item.product._id !== productId);

      if (user) {
        await api.delete(`/api/cart/${productId}`, {
          withCredentials: true,
        });
      }

      setCart(newCart);
      return newCart;
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Gagal menghapus produk dari keranjang');
      throw err;
    }
  };

  // Mengosongkan keranjang
  const clearCart = async () => {
    try {
      setError(null);

      if (user) {
        await api.delete('/api/cart', {
          withCredentials: true,
        });
      }

      setCart([]);
      localStorage.removeItem('cart');
      return [];
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Gagal mengosongkan keranjang');
      throw err;
    }
  };

  // Perhitungan total jumlah item dan subtotal (lebih aman)
  const cartSummary = {
    totalItems: cart.reduce((total, item) => {
      if (item && typeof item.quantity === 'number') {
        return total + item.quantity;
      }
      return total;
    }, 0),
    subtotal: cart.reduce((total, item) => {
      if (item && item.product && typeof item.product.price === 'number' && typeof item.quantity === 'number') {
        return total + item.product.price * item.quantity;
      }
      return total;
    }, 0),
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    ...cartSummary,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
