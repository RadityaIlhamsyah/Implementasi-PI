//Front-End/services/customerService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/customers';

// Mendaftar pelanggan baru
const registerCustomer = async (customerData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, customerData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

// Dapatkan pelanggan dengan nomor telepon
// Catatan: Anda harus membuat titik akhir ini di backend Anda
const getCustomerByPhone = async (phone) => {
  try {
    const response = await axios.get(`${API_URL}/phone/${phone}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Customer not found';
  }
};

const customerService = {
  registerCustomer,
  getCustomerByPhone,
};

export default customerService;
