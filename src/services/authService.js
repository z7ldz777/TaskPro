// src/services/authService.js
import api from './api';

// --- SWITCH FLAG FOR ADMIN ---
// Set to true to use offline mock data. Set to false to use the real Laravel API!
const USE_MOCK = true;

export const authService = {
    login: async (email, password) => {
        if (USE_MOCK) {
            // --- OFFLINE MOCK SIMULATION ---
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (email === 'test@example.com' && password === 'password123') {
                        resolve({
                            user: { id: 1, name: 'Test User', email: 'test@example.com' },
                            token: '1|simulated_token_abcdef123456',
                        });
                    } else {
                        reject({ message: 'Invalid email or password.' });
                    }
                }, 1000);
            });
        } else {
            // --- REAL LARAVEL API CONNECTION ---
            const response = await api.post('/login', { email, password });
            return response.data.data; // Returns { user, token } matching the Resource shape
        }
    },

    logout: async () => {
        if (USE_MOCK) {
            return Promise.resolve();
        } else {
            // Real API logout to revoke the token on backend
            return api.post('/logout');
        }
    }
};