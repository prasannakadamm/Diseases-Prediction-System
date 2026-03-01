import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, HeartPulse, Brain, ChevronRight, Star, Users, CheckCircle, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
    const { theme } = useTheme();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center w-full relative z-10 pt-10">
            {/* Hero Section */}
            <motion.div
                className="max-w-5xl mx-auto space-y-10 relative"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="inline-flex items-center justify-center p-1 rounded-full bg-gradient-to-r from-primary via-neonCyan to-secondary shadow-[0_0_20px_rgba(14,165,233,0.5)] mb-4 animate-glow">
                    <div className="flex items-center px-6 py-2 rounded-full bg-[#050814] bg-opacity-90 backdrop-blur-sm">
                        <Zap size={20} className="text-yellow-400 mr-2 animate-pulse" />
                        <span className="text-sm font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-primary to-neonCyan uppercase">Next-Gen AI Technology</span>
                    </div>
                </motion.div>

                <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tighter leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>Empowering</span> <br />
                    <span className="text-gradient-neon relative inline-block">
                        Health Diagnostics
                        <motion.span
                            className="absolute -bottom-2 left-0 w-full h-2 bg-gradient-to-r from-primary via-neonCyan to-secondary rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                        />
                    </span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-400 font-medium leading-relaxed drop-shadow-md">
                    Predict potential health risks instantly using state-of-the-art Neural Networks and Machine Learning models trained on extensive clinical datasets.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                    <Link to="/register" className="relative inline-flex items-center justify-center px-10 py-5 font-black uppercase tracking-widest text-white transition-all duration-300 bg-gradient-to-r from-primary via-neonCyan to-secondary rounded-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] hover:scale-105 group overflow-hidden">
                        <span className="absolute inset-0 w-full h-full -mt-1 rounded-xl opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                        <span className="relative z-10 flex items-center">
                            Get Started Free <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                    <Link to="/login" className="px-10 py-5 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 glass-panel hover:bg-white/10 text-primary border-primary/50 hover:border-primary hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]">
                        Login to Portal
                    </Link>
                </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
                className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto w-full px-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                <FeatureCard
                    icon={<Brain size={40} className="text-neonPink drop-shadow-[0_0_10px_rgba(255,0,60,0.8)]" />}
                    title="Neural Networks"
                    desc="Analyzes thousands of patient records using advanced deep learning classification."
                    delay={0.1}
                />
                <FeatureCard
                    icon={<HeartPulse size={40} className="text-neonCyan drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />}
                    title="Real-time Metrics"
                    desc="Get detailed risk analysis, probability scores, and preventive measures instantly."
                    delay={0.3}
                />
                <FeatureCard
                    icon={<ShieldCheck size={40} className="text-primary drop-shadow-[0_0_10px_rgba(14,165,233,0.8)]" />}
                    title="Military-Grade Security"
                    desc="Your data is protected with end-to-end encryption and advanced JWT hashing."
                    delay={0.5}
                />
            </motion.div>

            {/* How It Works Section */}
            <motion.div
                className="mt-40 w-full max-w-7xl mx-auto px-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="text-center mb-20 relative">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Operation Protocol</h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">Three streamlined phases to decode your comprehensive health profile.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-1/2 left-10 w-[calc(100%-80px)] h-1 bg-gradient-to-r from-primary via-neonCyan to-secondary -z-10 transform -translate-y-1/2 opacity-30 blur-[2px]"></div>

                    <StepCard step="01" title="Input Vectors" desc="Provide physiological parameters and symptomatic data into our secure terminal." delay={0.2} />
                    <StepCard step="02" title="AI Compilation" desc="Our clustering algorithms process your unique bio-pattern against global clinical matrices." delay={0.4} />
                    <StepCard step="03" title="Diagnostic Output" desc="Receive an instant, mathematically verified probability report and actionable directives." delay={0.6} />
                </div>
            </motion.div>

            {/* Stats Section with Glassmorphism */}
            <motion.div
                className="mt-40 w-full py-20 relative overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-neonCyan/5 to-secondary/10 backdrop-blur-3xl border-y border-white/10 z-0"></div>

                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
                    <motion.div whileHover={{ scale: 1.1 }} className="glass-panel p-10 flex flex-col items-center justify-center">
                        <Users size={50} className="mb-6 text-primary drop-shadow-[0_0_15px_rgba(14,165,233,0.8)]" />
                        <h3 className="text-5xl font-black mb-2 text-white drop-shadow-md">150K+</h3>
                        <p className="text-primary font-bold uppercase tracking-widest text-sm">Vectors Analyzed</p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} className="glass-panel p-10 flex flex-col items-center justify-center border-neonCyan/40 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
                        <CheckCircle size={50} className="mb-6 text-neonCyan drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" />
                        <h3 className="text-5xl font-black mb-2 text-white drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">99.2%</h3>
                        <p className="text-neonCyan font-bold uppercase tracking-widest text-sm">Diagnostic Precision</p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} className="glass-panel p-10 flex flex-col items-center justify-center border-neonPink/40 shadow-[0_0_30px_rgba(255,0,60,0.15)]">
                        <ShieldCheck size={50} className="mb-6 text-neonPink drop-shadow-[0_0_15px_rgba(255,0,60,0.8)]" />
                        <h3 className="text-5xl font-black mb-2 text-white drop-shadow-md">100%</h3>
                        <p className="text-neonPink font-bold uppercase tracking-widest text-sm">Clinically Secured</p>
                    </motion.div>
                </div>
            </motion.div>

            {/* Testimonials */}
            <motion.div
                className="mt-32 mb-32 w-full max-w-7xl mx-auto px-4"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="text-center mb-20 relative">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">Subject Reports</h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">Real-world data from verified users of the MedPredict AI network.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <motion.div whileHover={{ y: -10 }} className="p-10 rounded-3xl glass-panel relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full mix-blend-screen filter blur-3xl group-hover:bg-primary/40 transition-all duration-500"></div>
                        <div className="flex text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] mb-6">
                            <Star fill="currentColor" size={24} /><Star fill="currentColor" size={24} /><Star fill="currentColor" size={24} /><Star fill="currentColor" size={24} /><Star fill="currentColor" size={24} />
                        </div>
                        <p className="text-xl italic mb-8 text-gray-300 leading-relaxed font-medium">"The analysis engine predicted an early-stage hypertension pathway before my biometric wearables detected an anomaly. The PDF export function seamlessly integrated with my physician's database."</p>
                        <div className="font-bold flex items-center">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-neonCyan flex items-center justify-center mr-4 text-white text-xl shadow-[0_0_15px_rgba(14,165,233,0.5)]">SJ</div>
                            <div>
                                <h4 className="text-white text-lg">Sarah Jenkins</h4>
                                <p className="text-primary text-sm uppercase tracking-wider">Level 4 User</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div whileHover={{ y: -10 }} className="p-10 rounded-3xl glass-panel relative overflow-hidden group border-secondary/30">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full mix-blend-screen filter blur-3xl group-hover:bg-secondary/40 transition-all duration-500"></div>
                        <div className="flex text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)] mb-6">
                            <Star fill="currentColor" size={24} /><Star fill="currentColor" size={24} /><Star fill="currentColor" size={24} /><Star fill="currentColor" size={24} /><Star fill="currentColor" size={24} />
                        </div>
                        <p className="text-xl italic mb-8 text-gray-300 leading-relaxed font-medium">"System latency is virtually non-existent. The gamified structural UI makes daily diagnostic check-ins visually compelling. A flawless execution of medical AI."</p>
                        <div className="font-bold flex items-center">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-neonPink flex items-center justify-center mr-4 text-white text-xl shadow-[0_0_15px_rgba(217,70,239,0.5)]">MC</div>
                            <div>
                                <h4 className="text-white text-lg">Michael Chang</h4>
                                <p className="text-secondary text-sm uppercase tracking-wider">Bio-Engineer</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

        </div >
    );
};

const StepCard = ({ step, title, desc, delay }) => {
    return (
        <motion.div
            className="p-10 rounded-3xl flex flex-col items-center text-center relative glass-panel group"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -15, scale: 1.02 }}
            transition={{ delay: delay, duration: 0.5 }}
            viewport={{ once: true }}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#050814] to-gray-900 border border-primary/50 text-white flex items-center justify-center text-3xl font-black mb-8 shadow-[0_0_20px_rgba(14,165,233,0.3)] group-hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] group-hover:border-neonCyan transition-all duration-300 relative z-10">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-neonCyan">{step}</span>
            </div>
            <h3 className="text-3xl font-bold mb-4 text-white drop-shadow-md relative z-10">{title}</h3>
            <p className="text-gray-400 leading-loose relative z-10">{desc}</p>
        </motion.div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }) => {
    return (
        <motion.div
            className="p-8 rounded-3xl flex flex-col items-center text-center relative glass-panel group overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10 }}
            transition={{ delay: delay, duration: 0.5 }}
            viewport={{ once: true }}
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-neonCyan to-secondary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
            <div className="p-5 bg-[#050814]/80 backdrop-blur border border-white/10 rounded-2xl mb-6 shadow-inner relative z-10 group-hover:border-primary/50 transition-colors duration-300">
                {icon}
            </div>
            <h3 className="text-2xl font-black mb-4 text-white relative z-10">{title}</h3>
            <p className="text-base text-gray-400 leading-relaxed relative z-10">{desc}</p>
        </motion.div>
    );
};

export default Home;
