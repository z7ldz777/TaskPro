// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // 1. Instantly initialize state from localStorage (synchronous)
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    // Set loading to false immediately if we already have the data
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Session is read, stop the loading spinner
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);

            // Save to localStorage FIRST
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Then update State
            setToken(data.token);
            setUser(data.user);

            return { success: true };
        } catch (error) {
            const errorMsg = error.message || error.response?.data?.message || 'Login failed.';
            const validationErrors = error.response?.data?.errors || null;
            return { success: false, message: errorMsg, errors: validationErrors };
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.warn('Backend logout failed, clearing local state anyway.', err);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {/* This prevents protected routes from mounting and instantly kicking 
        the user out before the context finishes its boot cycle.
      */}
            {!loading ? children : (
                <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);