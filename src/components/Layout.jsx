// src/components/Layout.jsx
import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Navigation Bar */}
            <Navbar toggleSidebar={toggleSidebar} />

            {/* Collapsible Sidebar Navigation Panel */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Core Main Content Frame */}
            <main className="pt-16 lg:pl-64">
                <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;