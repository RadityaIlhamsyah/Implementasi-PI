import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // URL backend kamu
  withCredentials: true, // Kirim cookie kalau diperlukan
});

export default api;
