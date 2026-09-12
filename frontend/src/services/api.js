import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for attaching auth token and language
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jeevanvani_token');
    const lang = localStorage.getItem('jeevanvani_language') || 'hi';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['x-language'] = lang;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for session expiry handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear local storage
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('jeevanvani_token');
        localStorage.removeItem('jeevanvani_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
