import axios from 'axios';

const configuredBaseURL = import.meta.env.VITE_API_BASE_URL?.trim();
const api = axios.create({
  baseURL: configuredBaseURL || (import.meta.env.DEV ? 'http://127.0.0.1:8000/api' : '/api'),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (import.meta.env.PROD && !configuredBaseURL) {
      return Promise.reject(new Error('API produksi belum dikonfigurasi. Backend KBMLeague belum tersedia.'));
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
