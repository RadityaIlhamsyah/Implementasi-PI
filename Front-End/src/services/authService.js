//Front-End/src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Mendaftar pelanggan baru
const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/customers/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

// Login ditangani melalui verifikasi pelanggan
// Catatan: Karena API Anda tidak memiliki titik akhir login yang spesifik,
// kita menggunakan endpoint pendaftaran pelanggan untuk memverifikasi keberadaan pengguna
const login = async (credentials) => {
  try {
    // Dalam aplikasi yang sebenarnya, Anda akan memiliki endpoint login khusus
    // Ini adalah solusi berdasarkan struktur API Anda saat ini
    const { phone } = credentials;

    // Kita perlu memeriksa apakah pelanggan ada dengan nomor telepon yang diberikan
    // Karena tidak ada titik akhir langsung, kita akan menyesuaikannya nanti ketika Anda menambahkan titik akhir login yang tepat
    const response = await axios.post(`${API_URL}/customers/verify`, { phone });

    // Jika berhasil, kembalikan data pengguna
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

const authService = {
  register,
  login,
};

export default authService;
