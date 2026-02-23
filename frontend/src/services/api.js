import axios from 'axios';

// Simple in-memory cache for analytics data
const cache = {
  analytics: { data: null, timestamp: 0 }
};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = (credentials) => api.post('/login', credentials);
export const register = (userData) => api.post('/register', userData);
export const predictRisk = (data) => api.post('/predict/', data);
export const getHistory = () => api.get('/history/');
export const deletePrediction = (id) => api.delete(`/history/${id}`);
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);
export const changePassword = (data) => api.post('/change-password', data);

// Cached analytics to reduce server load
export const getAnalytics = async () => {
  const now = Date.now();
  if (cache.analytics.data && (now - cache.analytics.timestamp) < CACHE_TTL) {
    return cache.analytics.data;
  }
  const response = await api.get('/analytics/');
  cache.analytics = { data: response, timestamp: now };
  return response;
};

export default api;
