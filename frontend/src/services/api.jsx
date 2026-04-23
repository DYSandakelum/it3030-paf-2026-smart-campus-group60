import axios from 'axios';

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
const defaultBaseUrls = configuredBaseUrl
    ? [configuredBaseUrl]
    : ['http://localhost:8082/api', 'http://localhost:8080/api'];

let activeBaseUrl = defaultBaseUrls[0];

const api = axios.create({
    baseURL: activeBaseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    config.baseURL = config.baseURL || activeBaseUrl;

    const basicUser = localStorage.getItem('authUsername') || 'user';
    const basicPassword = localStorage.getItem('authPassword') || 'password';
    config.auth = {
        username: basicUser,
        password: basicPassword
    };

    // For FormData, don't set Content-Type; let browser handle multipart boundary
    if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    // This module uses backend HTTP Basic auth; do not override Authorization with stale bearer tokens.
    if (config.headers && config.headers.Authorization) {
        delete config.headers.Authorization;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config;
        const statusCode = error?.response?.status;
        const shouldRetryForStatus = statusCode === 404 || statusCode === 405;

        const shouldRetryWithFallback =
            !configuredBaseUrl &&
            originalRequest &&
            !originalRequest.__retryWithFallback &&
            (!error?.response || shouldRetryForStatus);

        if (!shouldRetryWithFallback) {
            return Promise.reject(error);
        }

        const currentIndex = defaultBaseUrls.indexOf(activeBaseUrl);
        const hasFallback = currentIndex >= 0 && currentIndex < defaultBaseUrls.length - 1;

        if (!hasFallback) {
            return Promise.reject(error);
        }

        const nextBaseUrl = defaultBaseUrls[currentIndex + 1];
        activeBaseUrl = nextBaseUrl;

        originalRequest.__retryWithFallback = true;
        originalRequest.baseURL = nextBaseUrl;

        return api.request(originalRequest);
    }
);

export default api;
