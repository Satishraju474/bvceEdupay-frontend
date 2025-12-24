import axios from 'axios';

// Force local development URL for debugging
const baseURL = 'https://backend-202n.onrender.com';

console.log('API Base URL (Forced):', baseURL);

const api = axios.create({
    baseURL,
});

// Add a request interceptor to inject the token
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const token = JSON.parse(userInfo).token;
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
