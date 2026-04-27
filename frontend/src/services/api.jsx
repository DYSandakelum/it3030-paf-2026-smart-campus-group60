import axios from 'axios';
import { applyBasicAuth } from './basicAuth';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081'}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    applyBasicAuth(config);

    // For FormData, don't set Content-Type; let browser handle multipart boundary
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    if (config.headers && config.headers.Authorization) {
        delete config.headers.Authorization;
    }

    return config;
});

export default api;
