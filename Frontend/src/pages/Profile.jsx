import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, Calendar, Activity, CheckCircle, Save, Shield, Star, Medal } from 'lucide-react';

const Profile = () => {
    const { user, login } = useAuth(); // login function from context acts as a setter if you pass the updated object
    const { theme } = useTheme();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        age: user?.age || '',
        gender: user?.gender || '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const res = await axios.put('http://localhost:5000/api/user/profile', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Save updated user data back to localStorage and Context
            const updatedUser = { ...res.data, token };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            // Assuming AuthContext allows setting user manually or reloading
            // Quick hack: just reload the page to update context, or dispatch to context if you wrote a setUser
            setMessage('Profile updated successfully!');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary uppercase tracking-wider">
                    User Profile
                </h1>
                <p className="text-gray-400 mt-2">Manage your personal information and health metrics.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column - Stats */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`col-span-1 p-6 rounded-2xl glass-panel border ${theme === 'dark' ? 'border-primary/20 bg-[#050814]/80' : 'border-gray-200 bg-white/80'} relative overflow-hidden`}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full filter blur-xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-neonCyan p-1 mb-4 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                            <div className={`w-full h-full rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-[#050814]' : 'bg-white'}`}>
                                <User size={40} className="text-primary" />
                            </div>
                        </div>
                        <h2 className="text-xl font-bold">{user?.name}</h2>
                        <span className="text-xs uppercase tracking-wider text-neonCyan font-bold flex items-center mt-1">
                            {user?.role === 'admin' ? <Shield size={12} className="mr-1" /> : <User size={12} className="mr-1" />}
                            {user?.role} Data Node
                        </span>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                            <div className="flex items-center text-sm font-bold opacity-80">
                                <Star size={16} className="text-yellow-400 mr-2" /> Points
                            </div>
                            <span className="font-mono text-neonCyan font-bold">{user?.points || 0}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                            <div className="flex items-center text-sm font-bold opacity-80">
                                <Medal size={16} className="text-purple-400 mr-2" /> Badges
                            </div>
                            <span className="font-mono text-neonPink font-bold">{user?.badges?.length || 0}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Column - Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`col-span-1 md:col-span-2 p-8 rounded-2xl glass-panel border ${theme === 'dark' ? 'border-primary/20 bg-[#050814]/80' : 'border-gray-200 bg-white/80'}`}
                >
                    <h3 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center border-b border-white/10 pb-4">
                        <Activity className="mr-2 text-primary" size={20} /> Base Metrics
                    </h3>

                    {message && <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg text-sm flex items-center"><CheckCircle size={16} className="mr-2" /> {message}</div>}
                    {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-2 mt-4"><User size={14} className="inline mr-1" /> Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-2 mt-4"><Mail size={14} className="inline mr-1" /> Email Address</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-3 text-sm opacity-50 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-2"><Calendar size={14} className="inline mr-1" /> Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                                    min="1" max="120"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-2">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full bg-[#050814] border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-2 border-t border-white/10 pt-4">Change Password (Optional)</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave blank to keep current"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 flex items-center justify-center w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-primary to-neonCyan text-white font-bold rounded-lg uppercase tracking-wider text-sm transition-transform hover:-translate-y-1 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                        >
                            {loading ? 'Synchronizing...' : <><Save size={18} className="mr-2" /> Save Protocol</>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
