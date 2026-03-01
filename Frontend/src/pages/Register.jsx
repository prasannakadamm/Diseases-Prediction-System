import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, AlertCircle, Hash, Users, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', age: '', gender: 'Male'
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const res = await register(formData);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.message);
        }
        setIsSubmitting(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const inputClass = `w-full pl-12 pr-4 py-4 rounded-xl outline-none bg-[#050814]/80 border border-white/10 text-white focus:border-neonCyan focus:ring-1 focus:ring-neonCyan focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all placeholder:text-gray-600`;

    return (
        <div className="flex justify-center items-center py-10 min-h-[80vh] relative z-10">
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div className="w-[600px] h-[600px] bg-secondary/20 rounded-full filter blur-[120px] opacity-40 animate-pulse-slow"></div>
            </div>

            <motion.div
                className={`w-full max-w-lg p-10 rounded-[30px] glass-panel border border-secondary/30 shadow-[0_0_40px_rgba(217,70,239,0.15)] relative z-10 overflow-hidden`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-neonPink/20 rounded-full mix-blend-screen filter blur-3xl"></div>

                <div className="text-center mb-8 relative z-10">
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                        className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#050814] border border-secondary/50 flex items-center justify-center shadow-[0_0_15px_rgba(217,70,239,0.4)]"
                    >
                        <User size={28} className="text-neonPink animate-pulse drop-shadow-[0_0_8px_rgba(255,0,60,0.8)]" />
                    </motion.div>
                    <h2 className="text-4xl font-black text-white drop-shadow-md mb-2">Create Account</h2>
                    <p className="text-secondary font-bold uppercase tracking-widest text-xs">Establish Operative Profile</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center text-red-500 backdrop-blur-md shadow-[0_0_15px_rgba(255,0,0,0.2)]"
                    >
                        <AlertCircle size={20} className="mr-3 drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]" />
                        <span className="text-sm font-medium">{error}</span>
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-neonPink transition-colors">Designation (Full Name)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neonPink transition-colors"><User size={18} /></div>
                            <input type="text" name="name" required className={inputClass.replace('focus:border-neonCyan', 'focus:border-neonPink').replace('focus:ring-neonCyan', 'focus:ring-neonPink')} placeholder="John Doe" value={formData.name} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-neonCyan transition-colors">Network ID (Email)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neonCyan transition-colors"><Mail size={18} /></div>
                            <input type="email" name="email" required className={inputClass} placeholder="operative@network.com" value={formData.email} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-primary transition-colors">Age</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors"><Hash size={18} /></div>
                                <input type="number" name="age" className={inputClass.replace('focus:border-neonCyan', 'focus:border-primary').replace('focus:ring-neonCyan', 'focus:ring-primary')} placeholder="25" value={formData.age} onChange={handleChange} min="1" max="120" />
                            </div>
                        </div>
                        <div className="space-y-2 group">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-primary transition-colors">Gender</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors"><Users size={18} /></div>
                                <select name="gender" className={inputClass.replace('focus:border-neonCyan', 'focus:border-primary').replace('focus:ring-neonCyan', 'focus:ring-primary') + " appearance-none"} value={formData.gender} onChange={handleChange}>
                                    <option value="Male" className="bg-[#050814] text-white">Male</option>
                                    <option value="Female" className="bg-[#050814] text-white">Female</option>
                                    <option value="Other" className="bg-[#050814] text-white">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-tertiary transition-colors">Security Key (Password)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-tertiary transition-colors"><Lock size={18} /></div>
                            <input type="password" name="password" required className={inputClass.replace('focus:border-neonCyan', 'focus:border-tertiary').replace('focus:ring-neonCyan', 'focus:ring-tertiary')} placeholder="••••••••••••" value={formData.password} onChange={handleChange} minLength="6" />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 mt-8 relative overflow-hidden rounded-xl font-black uppercase tracking-widest text-white border border-secondary/50 bg-gradient-to-r from-secondary/80 to-neonPink/80 hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] transition-all flex justify-center items-center group"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {isSubmitting ? (
                            <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"></span>
                        ) : (
                            <span className="relative z-10 drop-shadow-md">Establish Link</span>
                        )}
                    </motion.button>
                </form>

                <div className="mt-8 text-center relative z-10">
                    <p className="text-sm text-gray-400">
                        Existing Operative?{' '}
                        <Link to="/login" className="text-neonPink font-bold uppercase tracking-wider hover:text-white transition-colors drop-shadow-[0_0_5px_rgba(255,0,60,0.5)] border-b border-transparent hover:border-neonPink pb-1">
                            Authorize Access
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
