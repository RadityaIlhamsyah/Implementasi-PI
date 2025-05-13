import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, ChevronLeft, Plus, Minus } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);

        // Fetch related products (products that might be similar)
        // This is a simple implementation - you might want to have a more sophisticated
        // recommendation system on the server side in a real app
        const allProductsRes = await axios.get('/api/products');
        const related = allProductsRes.data
          .filter((p) => p._id !== id) // exclude current product
          .slice(0, 4); // just get 4 products
        setRelatedProducts(related);
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setError('Gagal memuat produk. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart({
        ...product,
        qty: quantity,
      });
    }
  };

  // Format price to Indonesian Rupiah
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-pulse text-xl">Memuat produk...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-100 p-4 rounded text-red-700">{error || 'Produk tidak ditemukan'}</div>
          <Link to="/products" className="mt-4 inline-block text-teal-600 hover:text-teal-700 font-medium">
            <ChevronLeft size={16} className="inline mr-1" />
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="inline-block mb-6 text-teal-600 hover:text-teal-700 font-medium">
          <ChevronLeft size={16} className="inline mr-1" />
          Kembali ke Katalog
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              {product.image ? (
                <img src={`/uploads/${product.image}`} alt={product.name} className="w-full h-96 object-cover" />
              ) : (
                <div className="bg-gray-200 h-96 w-full flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="md:w-1/2 p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-2xl text-teal-600 font-bold mb-4">{formatPrice(product.price)}</p>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">
                  Ketersediaan:
                  <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>{product.stock > 0 ? ' Tersedia' : ' Stok Habis'}</span>
                </p>

                {product.description && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Deskripsi:</h3>
                    <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                  </div>
                )}
              </div>

              {product.stock > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Jumlah:</h3>
                  <div className="flex items-center">
                    <button onClick={() => handleQuantityChange(-1)} className="border border-gray-300 rounded-l p-2 hover:bg-gray-100 transition-colors">
                      <Minus size={16} />
                    </button>
                    <span className="border-t border-b border-gray-300 py-2 px-4">{quantity}</span>
                    <button onClick={() => handleQuantityChange(1)} className="border border-gray-300 rounded-r p-2 hover:bg-gray-100 transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-colors duration-200 ${
                  product.stock > 0 ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={20} className="mr-2" />
                {product.stock > 0 ? 'Tambahkan ke Keranjang' : 'Stok Habis'}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Produk Terkait</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Link to={`/products/${relatedProduct._id}`}>
                    {relatedProduct.image ? (
                      <img src={`/uploads/${relatedProduct.image}`} alt={relatedProduct.name} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="bg-gray-200 h-48 w-full flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800">{relatedProduct.name}</h3>
                      <p className="text-teal-600 font-bold mt-1">{formatPrice(relatedProduct.price)}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
