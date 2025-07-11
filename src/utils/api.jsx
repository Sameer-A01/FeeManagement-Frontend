// src/utils/api.jsx
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

// Automatically attach Bearer token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('ims_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
