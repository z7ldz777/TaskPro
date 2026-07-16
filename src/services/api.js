// src/services/api.js
import axios from 'axios';

// Create a central Axios instance pointing to your local Laravel server
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Laravel's default 'php artisan serve' URL
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// REQUEST INTERCEPTOR: Automatically attaches the Sanctum Bearer token if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Automatically handles token expiration (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear local session and redirect if the token is invalid/expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;