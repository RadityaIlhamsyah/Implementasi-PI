import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image: null });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('/api/products');
    setProducts(res.data);
  };

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    if (form.image) formData.append('image', form.image);

    try {
      if (isEditing) {
        await axios.put(`/api/products/${editId}`, formData);
        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post('/api/products', formData);
      }
      fetchProducts();
      setForm({ name: '', price: '', image: null });
    } catch (err) {
      console.error('Gagal menyimpan produk:', err);
    }
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, price: product.price, image: null });
    setIsEditing(true);
    setEditId(product._id);
  };

  const handleDelete = async (id) => {
    if (confirm('Yakin hapus produk ini?')) {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Kelola Produk</h2>

      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input type="text" name="name" placeholder="Nama Produk" value={form.name} onChange={handleChange} required className="border p-2 w-full" />
        <input type="number" name="price" placeholder="Harga" value={form.price} onChange={handleChange} required className="border p-2 w-full" />
        <input type="file" name="image" onChange={handleChange} className="border p-2 w-full" />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {isEditing ? 'Simpan Perubahan' : 'Tambah Produk'}
        </button>
        {isEditing && (
          <button
            type="button"
            className="ml-2 bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => {
              setIsEditing(false);
              setForm({ name: '', price: '', image: null });
            }}
          >
            Batal Edit
          </button>
        )}
      </form>

      <div>
        {products.map((product) => (
          <div key={product._id} className="mb-2 border p-2 rounded shadow-sm">
            <p className="font-semibold">
              {product.name} - Rp{product.price}
            </p>
            {product.image && <img src={`/uploads/${product.image}`} alt={product.name} className="w-32 mt-2" />}
            <div className="mt-2 space-x-2">
              <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-3 py-1 rounded">
                Edit
              </button>
              <button onClick={() => handleDelete(product._id)} className="bg-red-600 text-white px-3 py-1 rounded">
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManagement;
