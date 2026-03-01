import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const res = await login(email, password);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] relative z-10">
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div className="w-[500px] h-[500px] bg-primary/20 rounded-full filter blur-[100px] opacity-50 animate-pulse"></div>
            </div>

            <motion.div
                className={`w-full max-w-md p-10 rounded-[30px] glass-panel border border-primary/30 shadow-[0_0_40px_rgba(14,165,233,0.15)] relative z-10 overflow-hidden`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-neonCyan/20 rounded-full mix-blend-screen filter blur-3xl"></div>

                <div className="text-center mb-10 relative z-10">
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                        className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#050814] border border-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                    >
                        <Zap size={28} className="text-neonCyan animate-pulse drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                    </motion.div>
                    <h2 className="text-4xl font-black text-white drop-shadow-md mb-2">Welcome Back</h2>
                    <p className="text-primary font-bold uppercase tracking-widest text-xs">Secure Terminal Authorization</p>
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

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-neonCyan transition-colors">Identification (Email)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-neonCyan transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-4 rounded-xl outline-none bg-[#050814]/80 border border-white/10 text-white focus:border-neonCyan focus:ring-1 focus:ring-neonCyan focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all placeholder:text-gray-600"
                                placeholder="operative@network.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-primary transition-colors">Security Key (Password)</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full pl-12 pr-4 py-4 rounded-xl outline-none bg-[#050814]/80 border border-white/10 text-white focus:border-primary focus:ring-1 focus:ring-primary focus:shadow-[0_0_15px_rgba(14,165,233,0.2)] transition-all placeholder:text-gray-600"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 mt-8 relative overflow-hidden rounded-xl font-black uppercase tracking-widest text-white border border-primary/50 bg-gradient-to-r from-primary/80 to-neonCyan/80 hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] transition-all flex justify-center items-center group"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        {isSubmitting ? (
                            <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"></span>
                        ) : (
                            <span className="relative z-10 drop-shadow-md">Init Sequence</span>
                        )}
                    </motion.button>
                </form>

                <div className="mt-10 text-center relative z-10">
                    <p className="text-sm text-gray-400">
                        Unregistered Operative?{' '}
                        <Link to="/register" className="text-neonCyan font-bold uppercase tracking-wider hover:text-white transition-colors drop-shadow-[0_0_5px_rgba(0,240,255,0.5)] border-b border-transparent hover:border-neonCyan pb-1">
                            Establish Link
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
