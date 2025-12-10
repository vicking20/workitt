/**
 * Authenticated Navbar Component
 * Shared navigation bar for all authenticated pages
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthNavbar: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b-2 border-primary">
            <div className="flex h-16 items-center justify-between px-4 lg:px-12 max-w-[1600px] mx-auto w-full">
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/dashboard')}>
                    <div className="h-8 w-8 bg-primary rotate-45 transition-transform duration-500 group-hover:rotate-[225deg]"></div>
                    <h2 className="font-display text-xl lg:text-2xl tracking-tight uppercase text-primary select-none group-hover:text-brand-accent transition-colors">
                        Workitt
                    </h2>
                </div>

                <div className="flex items-center gap-3 lg:gap-6">
                    {/* Profile Link - Icon on mobile, text on desktop */}
                    <Link
                        to="/profile"
                        className="flex items-center gap-2 text-sm font-bold uppercase text-primary hover:text-brand-accent transition-colors"
                    >
                        <span className="material-symbols-outlined">person</span>
                        <span className="hidden lg:inline">Profile</span>
                    </Link>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold uppercase text-sm hover:bg-brand-accent transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        <span className="hidden lg:inline">Logout</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default AuthNavbar;
