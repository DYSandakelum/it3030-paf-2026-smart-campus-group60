import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const basicUser = localStorage.getItem('authUsername') || 'user';
    const basicPassword = localStorage.getItem('authPassword') || 'password';
    config.auth = {
        username: basicUser,
        password: basicPassword
    };

    // This module uses backend HTTP Basic auth; do not override Authorization with stale bearer tokens.
    if (config.headers && config.headers.Authorization) {
        delete config.headers.Authorization;
    }

    return config;
});

export default api;
