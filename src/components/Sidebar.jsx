// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { logout } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
    ];

    return (
        <>
            {/* Mobile Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`fixed top-0 bottom-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white pt-16 transition-transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                {/* Navigation Links */}
                <nav className="flex-1 space-y-1 px-4 py-6">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => {
                                    // Close mobile sidebar on click
                                    if (isOpen) toggleSidebar();
                                }}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${isActive
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`
                                }
                            >
                                <Icon className="h-5 w-5" />
                                {item.name}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Quick Logout Button at the bottom */}
                <div className="border-t border-slate-100 p-4">
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;