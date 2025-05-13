import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    paymentMethod: 'cod',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: shipping, 2: payment, 3: confirmation
  const [orderId, setOrderId] = useState(null);

  // Calculate total
  const subtotal = cart.reduce((total, item) => {
    return total + item.price * (item.qty || 1);
  }, 0);

  const deliveryFee = 10000; // Fixed delivery fee
  const total = subtotal + deliveryFee;

  // Format price to Indonesian Rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateShippingForm = () => {
    if (!form.name || !form.phone || !form.address) {
      setError('Semua field bertanda * wajib diisi');
      return false;
    }

    // Validate phone number (simple validation)
    if (!/^\d{10,13}$/.test(form.phone)) {
      setError('Nomor telepon tidak valid');
      return false;
    }

    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateShippingForm()) {
        setStep(2);
      }
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      setError('Keranjang Anda kosong');
      return;
    }

    try {
      setLoading(true);

      const orderItems = cart.map((item) => ({
        productId: item._id,
        quantity: item.qty || 1,
        price: item.price,
      }));

      const orderData = {
        customerName: form.name,
        phone: form.phone,
        address: form.address,
        items: orderItems,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
        subtotal,
        deliveryFee,
        total,
      };

      const response = await axios.post('/api/orders', orderData);

      setOrderId(response.data._id);
      clearCart();
      setTimeout(() => {
        navigate(`/orders/${response.data._id}`);
      }, 3000);

      setLoading(false);
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Gagal melakukan checkout. Silakan coba lagi.');
      setLoading(false);
    }
  };

  // If the cart is empty, redirect to cart page
  if (cart.length === 0 && !orderId) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="mb-4">Keranjang Anda kosong. Tidak ada yang dapat di-checkout.</p>
          <button onClick={() => navigate('/products')} className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 transition duration-200">
            Kembali Belanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

        {/* Order Success Message */}
        {orderId ? (
          <div className="bg-green-50 p-8 rounded-lg text-center">
            <CheckCircle size={64} className="mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Pesanan Berhasil!</h2>
            <p className="text-gray-600 mb-6">Terima kasih atas pesanan Anda. Kami akan segera memproses pesanan Anda.</p>
            <p className="text-gray-600 mb-6">
              Nomor Pesanan: <span className="font-semibold">{orderId}</span>
            </p>
            <p className="text-gray-500 mb-6">Anda akan dialihkan ke halaman status pesanan dalam beberapa detik...</p>
            <button onClick={() => navigate(`/orders/${orderId}`)} className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 transition duration-200">
              Lihat Status Pesanan
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Checkout Form */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Stepper */}
                <div className="bg-gray-50 p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center ${step >= 1 ? 'text-teal-600' : 'text-gray-400'}`}>
                      <div className={`rounded-full h-8 w-8 flex items-center justify-center mr-2 border-2 ${step >= 1 ? 'border-teal-600 bg-teal-50' : 'border-gray-300'}`}>1</div>
                      <span className="font-medium">Pengiriman</span>
                    </div>
                    <div className="flex-1 h-1 mx-4 bg-gray-200">
                      <div className="h-full bg-teal-600" style={{ width: step > 1 ? '100%' : '0%', transition: 'width 0.3s ease' }}></div>
                    </div>
                    <div className={`flex items-center ${step >= 2 ? 'text-teal-600' : 'text-gray-400'}`}>
                      <div className={`rounded-full h-8 w-8 flex items-center justify-center mr-2 border-2 ${step >= 2 ? 'border-teal-600 bg-teal-50' : 'border-gray-300'}`}>2</div>
                      <span className="font-medium">Pembayaran</span>
                    </div>
                    <div className="flex-1 h-1 mx-4 bg-gray-200">
                      <div className="h-full bg-teal-600" style={{ width: step > 2 ? '100%' : '0%', transition: 'width 0.3s ease' }}></div>
                    </div>
                    <div className={`flex items-center ${step >= 3 ? 'text-teal-600' : 'text-gray-400'}`}>
                      <div className={`rounded-full h-8 w-8 flex items-center justify-center mr-2 border-2 ${step >= 3 ? 'border-teal-600 bg-teal-50' : 'border-gray-300'}`}>3</div>
                      <span className="font-medium">Konfirmasi</span>
                    </div>
                  </div>
                </div>

                {/* Step 1: Shipping Information */}
                {step === 1 && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Truck size={20} className="mr-2" />
                      Informasi Pengiriman
                    </h2>

                    {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 mb-1">Nama Lengkap *</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500" required />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1">Nomor Telepon *</label>
                        <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500" placeholder="contoh: 08123456789" required />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1">Alamat Lengkap *</label>
                        <textarea name="address" value={form.address} onChange={handleChange} className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500" rows="3" required></textarea>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1">Catatan (opsional)</label>
                        <textarea
                          name="notes"
                          value={form.notes}
                          onChange={handleChange}
                          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                          rows="2"
                          placeholder="Instruksi khusus untuk pesanan Anda"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Method */}
                {step === 2 && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <CreditCard size={20} className="mr-2" />
                      Metode Pembayaran
                    </h2>

                    {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer">
                          <input type="radio" name="paymentMethod" value="cod" checked={form.paymentMethod === 'cod'} onChange={handleChange} className="mr-2" />
                          <div>
                            <p className="font-medium">Cash on Delivery (COD)</p>
                            <p className="text-sm text-gray-500">Bayar saat pesanan tiba</p>
                          </div>
                        </label>
                      </div>

                      <div>
                        <label className="flex items-center p-4 border rounded-lg cursor-pointer">
                          <input type="radio" name="paymentMethod" value="transfer" checked={form.paymentMethod === 'transfer'} onChange={handleChange} className="mr-2" />
                          <div>
                            <p className="font-medium">Transfer Bank</p>
                            <p className="text-sm text-gray-500">Transfer ke rekening kami</p>
                          </div>
                        </label>
                      </div>

                      {form.paymentMethod === 'transfer' && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="font-medium mb-2">Rekening Tujuan:</p>
                          <p>Bank XYZ</p>
                          <p>No. Rekening: 1234567890</p>
                          <p>Atas Nama: Toko Cici Kitchen</p>
                          <p className="text-sm text-gray-500 mt-2">Setelah melakukan pembayaran, silakan konfirmasi dengan mengirimkan bukti transfer ke nomor 08123456789</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Order Confirmation */}
                {step === 3 && (
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <CheckCircle size={20} className="mr-2" />
                      Konfirmasi Pesanan
                    </h2>

                    {error && <div className="bg-red-50 text-red-700 p-3 rounded mb-4">{error}</div>}

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Informasi Pengiriman:</h3>
                        <div className="bg-gray-50 p-3 rounded">
                          <p>
                            <span className="font-medium">Nama:</span> {form.name}
                          </p>
                          <p>
                            <span className="font-medium">Telepon:</span> {form.phone}
                          </p>
                          <p>
                            <span className="font-medium">Alamat:</span> {form.address}
                          </p>
                          {form.notes && (
                            <p>
                              <span className="font-medium">Catatan:</span> {form.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Metode Pembayaran:</h3>
                        <div className="bg-gray-50 p-3 rounded">
                          <p>{form.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Transfer Bank'}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">Pesanan:</h3>
                        <div className="bg-gray-50 p-3 rounded">
                          <ul className="divide-y">
                            {cart.map((item) => (
                              <li key={item._id} className="py-2 flex justify-between">
                                <span>
                                  {item.name} x {item.qty || 1}
                                </span>
                                <span className="font-medium">{formatPrice(item.price * (item.qty || 1))}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Navigation */}
                <div className="bg-gray-50 p-4 border-t flex justify-between">
                  {step > 1 ? (
                    <button onClick={handlePrevStep} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                      Kembali
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {step < 3 ? (
                    <button onClick={handleNextStep} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                      Lanjutkan
                    </button>
                  ) : (
                    <button onClick={handleSubmitOrder} disabled={loading} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400">
                      {loading ? 'Memproses...' : 'Selesaikan Pesanan'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="font-semibold text-xl text-gray-800 mb-4">Ringkasan Pesanan</h2>

                <div className="max-h-60 overflow-y-auto mb-4 pr-2">
                  <ul className="divide-y">
                    {cart.map((item) => (
                      <li key={item._id} className="py-3 flex justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.qty || 1}</p>
                        </div>
                        <span className="font-medium">{formatPrice(item.price * (item.qty || 1))}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 mb-6 border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Biaya Pengiriman</span>
                    <span className="font-semibold">{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="border-t pt-3 font-bold flex justify-between">
                    <span>Total</span>
                    <span className="text-teal-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
