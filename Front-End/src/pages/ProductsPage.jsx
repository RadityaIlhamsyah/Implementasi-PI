import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get filter values from URL parameters
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/products', {
          params: {
            category: categoryParam,
            search: searchParam,
          },
        });
        setProducts(response.data);

        // Extract unique categories from products
        const uniqueCategories = [...new Set(response.data.map((product) => product.category))];
        setCategories(uniqueCategories);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError('Gagal memuat produk. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, searchParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchValue = formData.get('search');

    // Update URL parameters
    const newParams = new URLSearchParams(searchParams);
    if (searchValue) {
      newParams.set('search', searchValue);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleCategoryFilter = (category) => {
    // Update URL parameters
    const newParams = new URLSearchParams(searchParams);
    if (category) {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    // Preserve search parameter if exists
    if (searchParam) {
      newParams.set('search', searchParam);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="animate-pulse text-xl">Memuat produk...</div>
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

      <div className="bg-teal-700 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-2">Katalog Produk</h1>
          <p className="text-teal-100">Temukan jajanan tradisional favorit Anda</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row justify-between mb-8">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mb-4 lg:mb-0 lg:w-1/3">
            <div className="relative">
              <input type="text" name="search" placeholder="Cari produk..." defaultValue={searchParam} className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <button type="submit" className="absolute right-2 top-1.5 bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700">
                Cari
              </button>
            </div>
          </form>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => clearFilters()} className={`px-4 py-2 rounded-full text-sm font-medium ${!categoryParam ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              Semua
            </button>

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${categoryParam === category ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {(categoryParam || searchParam) && (
          <div className="mb-6 flex items-center">
            <span className="text-gray-600 mr-2">Filter aktif:</span>
            {categoryParam && (
              <span className="bg-teal-100 text-teal-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded flex items-center">
                Kategori: {categoryParam}
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('category');
                    setSearchParams(newParams);
                  }}
                  className="ml-1 text-teal-800 hover:text-teal-900"
                >
                  ✕
                </button>
              </span>
            )}
            {searchParam && (
              <span className="bg-teal-100 text-teal-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded flex items-center">
                Pencarian: {searchParam}
                <button
                  onClick={() => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.delete('search');
                    setSearchParams(newParams);
                  }}
                  className="ml-1 text-teal-800 hover:text-teal-900"
                >
                  ✕
                </button>
              </span>
            )}
            <button onClick={clearFilters} className="text-teal-600 text-sm hover:text-teal-800 underline ml-2">
              Reset semua filter
            </button>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Tidak ada produk yang ditemukan</h3>
            <p className="text-gray-500">Coba ubah filter atau kata kunci pencarian Anda</p>
            <button onClick={clearFilters} className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">
              Lihat semua produk
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
