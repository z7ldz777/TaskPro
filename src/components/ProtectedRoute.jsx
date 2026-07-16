// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { token: contextToken, loading } = useAuth();
    const location = useLocation();

    // Synchronous fallback check to prevent React state update lag/race conditions
    const hasSavedToken = !!localStorage.getItem('token');

    // 1. If context is actively booting up, wait
    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    // 2. If no token in context AND no token in localStorage, kick them out
    if (!contextToken && !hasSavedToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Otherwise, they are allowed in!
    return children;
};

export default ProtectedRoute;