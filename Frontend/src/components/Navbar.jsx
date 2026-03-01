import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Activity, Menu, X, Moon, Sun, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        ...(user ? [
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Predict Disease', path: '/predict' },
            { name: 'Profile', path: '/profile' },
            { name: 'Settings', path: '/settings' },
            ...(user.role === 'admin' ? [{ name: 'Admin Panel', path: '/admin' }] : [])
        ] : [])
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${theme === 'dark' ? 'bg-[#050814]/80 backdrop-blur-xl border-b border-primary/20 shadow-[0_4px_30px_rgba(14,165,233,0.1)]' : 'bg-white/80 backdrop-blur-xl border-b border-gray-200'}`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <Activity className="h-8 w-8 text-primary group-hover:animate-pulse group-hover:text-neonCyan transition-colors duration-300 drop-shadow-[0_0_8px_rgba(14,165,233,0.6)]" />
                        <span className="ml-2 text-2xl font-black tracking-wider text-gradient-neon uppercase drop-shadow-[0_0_10px_rgba(14,165,233,0.4)]">
                            MedPredict
                        </span>
                    </motion.div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all duration-300 group ${location.pathname === link.path
                                        ? 'text-white'
                                        : (theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-primary')
                                        }`}
                                >
                                    {location.pathname === link.path && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute inset-0 bg-primary/20 border border-primary/50 shadow-[0_0_15px_rgba(14,165,233,0.4)] rounded-lg z-0"
                                            initial={false}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">{link.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 15 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className={`p-2 rounded-full border transition-all ${theme === 'dark' ? 'border-white/10 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(14,165,233,0.5)] bg-white/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-100'}`}
                        >
                            {theme === 'dark' ? <Sun size={20} className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" /> : <Moon size={20} className="text-slate-700" />}
                        </motion.button>

                        {user ? (
                            <div className="flex items-center space-x-4">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className={`flex items-center px-4 py-2 rounded-full border shadow-[0_0_10px_rgba(14,165,233,0.2)] ${theme === 'dark' ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border-white/20' : 'bg-primary/10 border-primary/20'}`}
                                >
                                    {user.role === 'admin' ? <Shield size={18} className="text-neonPink mr-2 animate-pulse" /> : <UserIcon size={18} className="text-primary mr-2" />}
                                    <span className={`text-sm font-bold tracking-wide ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{user.name}</span>
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.1, textShadow: "0 0 8px rgba(255,0,0,0.8)" }}
                                    onClick={handleLogout}
                                    className="text-red-500 hover:text-red-400 transition"
                                >
                                    <LogOut size={22} />
                                </motion.button>
                            </div>
                        ) : (
                            <div className="space-x-4 flex items-center">
                                <Link to="/login" className={`px-5 py-2.5 rounded-lg font-bold uppercase tracking-wider border transition-all duration-300 ${theme === 'dark' ? 'text-primary border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(14,165,233,0.4)]' : 'text-primary border-primary hover:bg-primary/5'}`}>
                                    Log in
                                </Link>
                                <Link to="/register" className="relative px-5 py-2.5 rounded-lg font-bold uppercase tracking-wider text-white bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] transition-all duration-300 overflow-hidden group">
                                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black group-hover:opacity-50"></span>
                                    <span className="relative z-10">Sign up</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            {isOpen ? <X size={24} className="text-primary" /> : <Menu size={24} className="text-primary" />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-primary/20 bg-[#050814]/95 backdrop-blur-3xl overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-3 py-3 rounded-md text-base font-bold uppercase tracking-wider ${location.pathname === link.path
                                        ? 'bg-primary/20 text-primary border border-primary/50 shadow-[0_0_10px_rgba(14,165,233,0.3)]'
                                        : 'text-gray-300 hover:bg-primary/10 hover:text-primary'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <button onClick={toggleTheme} className="w-full text-left px-3 py-3 rounded-md text-base font-bold uppercase tracking-wider text-yellow-400 hover:bg-white/5 flex items-center">
                                Toggle Theme {theme === 'dark' ? <Sun size={18} className="ml-2" /> : <Moon size={18} className="ml-2 text-slate-400" />}
                            </button>
                            {user ? (
                                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left px-3 py-3 rounded-md text-base font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 flex items-center">
                                    <LogOut size={18} className="mr-2" /> Log out
                                </button>
                            ) : (
                                <div className="flex flex-col space-y-3 px-3 pt-4 border-t border-white/10">
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-center w-full px-4 py-3 border border-primary/50 rounded-lg text-primary font-bold uppercase tracking-wider">Log in</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="text-center w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(217,70,239,0.4)]">Sign up</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Subtle EKG Aesthetic Line */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent overflow-hidden">
                <svg className="absolute top-1/2 left-0 w-full h-8 -translate-y-1/2 opacity-80" preserveAspectRatio="none">
                    <path
                        d="M0,4 L30%,4 L32%,-10 L35%,20 L38%,4 L100%,4"
                        fill="none"
                        stroke={theme === 'dark' ? '#00f0ff' : '#0ea5e9'}
                        strokeWidth="2"
                        className="ekg-path"
                        vectorEffect="non-scaling-stroke"
                        style={{ filter: 'drop-shadow(0 0 4px rgba(0,240,255,0.8))' }}
                    />
                </svg>
            </div>
        </motion.nav>
    );
};

export default Navbar;
