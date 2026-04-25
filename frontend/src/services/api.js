import axios from 'axios';
import { applyBasicAuth, clearAuthState } from './basicAuth';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return applyBasicAuth(config);
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthState();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;