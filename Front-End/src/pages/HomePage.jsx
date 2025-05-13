//Front-End/src/pages/HomePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes] = await Promise.all([
          axios.get('/api/products'),
          // Add more API calls here if needed, like for promotions
        ]);

        // For now, we'll just use the first 4 products as featured products
        setFeaturedProducts(productRes.data.slice(0, 4));

        // Mock promotions until we have a real API endpoint
        setPromotions([
          {
            id: 1,
            title: 'Buy 1 Get 1 Free',
            description: 'Beli satu gratis satu untuk semua jajanan tradisional setiap hari Jumat',
            image: 'https://images.pexels.com/photos/4040691/pexels-photo-4040691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            url: '/products',
          },
          {
            id: 2,
            title: 'Diskon 25%',
            description: 'Dapatkan diskon 25% untuk pembelian di atas Rp 100.000',
            image: 'https://images.pexels.com/photos/4099124/pexels-photo-4099124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            url: '/products',
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Gagal memuat data. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-pulse text-xl">Memuat data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-100 p-4 rounded text-red-700">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {/* Hero Banner */}
      <div className="relative bg-teal-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Rasakan Kelezatan Jajanan Tradisional</h1>
            <p className="text-lg md:text-xl mb-8">Nikmati beragam jajanan tradisional autentik yang dibuat dengan resep turun-temurun dan bahan berkualitas.</p>
            <Link to="/products" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300">
              Jelajahi Katalog
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 z-[-1] opacity-20 bg-[url('https://images.pexels.com/photos/6025870/pexels-photo-6025870.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover bg-center"></div>
      </div>

      {/* Promotions Section */}
      {promotions.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Promo Spesial</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {promotions.map((promo) => (
                <Link to={promo.url} key={promo.id} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="h-48 overflow-hidden">
                      <img src={promo.image} alt={promo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">{promo.title}</h3>
                      <p className="text-gray-600 mb-4">{promo.description}</p>
                      <div className="flex items-center text-teal-600 font-medium group-hover:text-teal-700">
                        <span>Lihat detail</span>
                        <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Produk Unggulan</h2>
            <Link to="/products" className="text-teal-600 hover:text-teal-700 font-medium flex items-center">
              Lihat Semua <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">Belum ada produk unggulan.</div>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Tentang Toko Cici Kitchen</h2>
            <p className="text-lg text-gray-600 mb-8">
              Toko Cici Kitchen adalah destinasi terbaik untuk menikmati jajanan tradisional berkualitas. Dengan pengalaman lebih dari 10 tahun, kami berkomitmen menyajikan kelezatan autentik dengan bahan-bahan pilihan dan resep
              turun-temurun.
            </p>
            <Link to="/contact" className="inline-block bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
