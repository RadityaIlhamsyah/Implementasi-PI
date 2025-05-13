import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { _id, name, price, image, stock = 0, description = '' } = product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock > 0) {
      addToCart(product);
    }
  };

  // Format price to Indonesian Rupiah
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-100">
      <Link to={`/products/${_id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          {image ? (
            <img src={`/uploads/${image}`} alt={name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}

          {stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Stok Habis</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{name}</h3>
          <p className="text-teal-600 font-bold mb-2">{formattedPrice}</p>

          {description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>}

          <div className="flex items-center justify-between mt-2">
            <button
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className={`px-3 py-1.5 rounded flex items-center justify-center transition-colors duration-200 ${stock > 0 ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              <ShoppingCart size={16} className="mr-1" />
              <span className="text-sm">Add to Cart</span>
            </button>

            <Link to={`/products/${_id}`} className="px-3 py-1.5 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 flex items-center" onClick={(e) => e.stopPropagation()}>
              <Eye size={16} className="mr-1" />
              <span className="text-sm">Detail</span>
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
