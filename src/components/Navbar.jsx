// src/components/Navbar.jsx
import { Menu, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ toggleSidebar }) => {
    const { user } = useAuth();

    return (
        <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
            {/* Left side: Hamburger (Mobile) & Brand Logo */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <span className="text-xl font-bold text-slate-800 tracking-tight">
                    Task<span className="text-indigo-600">Pro</span>
                </span>
            </div>

            {/* Right side: Current Logged In User Profile Card */}
            <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                    <User className="h-5 w-5" />
                </div>
            </div>
        </header>
    );
};

export default Navbar;