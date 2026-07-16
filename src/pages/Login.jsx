// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    // 1. Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 2. Validation & Alert States
    const [errors, setErrors] = useState({});
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 3. Client-Side Validation Logic
    const validateForm = () => {
        const newErrors = {};

        // Email Validation
        if (!email.trim()) {
            newErrors.email = 'Email address is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        // Password Validation
        if (!password) {
            newErrors.password = 'Password is required.';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // 4. Form Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setStatusMessage({ type: '', text: '' });

        if (!validateForm()) return;

        setIsSubmitting(true);

        // We call the real login flow from AuthContext.
        // It will automatically use Mock Data if USE_MOCK is true in services!
        const result = await login(email, password);

        setIsSubmitting(false);

        if (result.success) {
            setStatusMessage({ type: 'success', text: 'Login successful! Redirecting...' });

            // Redirect to Dashboard after a brief delay so they see the success state
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 1000);
        } else {
            // Display error messages directly from mock database or validation
            setStatusMessage({
                type: 'error',
                text: result.message || 'Invalid email or password.'
            });
            if (result.errors) {
                setErrors(result.errors);
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-md border border-slate-100">

                {/* Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Use <span className="font-semibold text-slate-700">test@example.com</span> & <span className="font-semibold text-slate-700">password123</span>
                    </p>
                </div>

                {/* Global Success / Error Messages */}
                {statusMessage.text && (
                    <div className={`p-4 rounded-lg flex items-center gap-3 text-sm ${statusMessage.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                        {statusMessage.type === 'success' ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
                        )}
                        <span>{statusMessage.text}</span>
                    </div>
                )}

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email Address
                            </label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`block w-full rounded-lg border py-2.5 pl-10 pr-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 sm:text-sm ${errors.email
                                            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                                            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                                        }`}
                                    placeholder="name@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="relative mt-1">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`block w-full rounded-lg border py-2.5 pl-10 pr-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 sm:text-sm ${errors.password
                                            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200'
                                            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
                                        }`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" /> {errors.password}
                                </p>
                            )}
                        </div>

                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="group relative flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 transition-colors"
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Login;