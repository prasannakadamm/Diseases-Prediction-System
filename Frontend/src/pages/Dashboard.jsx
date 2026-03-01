import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Clock, Activity, Download, Flame, Trophy, Heart, Brain, Zap, Smile, CalendarDays, Fingerprint } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const [history, setHistory] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Wellness States
    const [stress, setStress] = useState(5);
    const [sleep, setSleep] = useState(7);
    const [mood, setMood] = useState(5);
    const [submittingWellness, setSubmittingWellness] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token;
                const res = await axios.get('http://localhost:5000/api/predict/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(res.data);
            } catch (error) {
                console.error("Failed to load history", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchProfile = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token;
                const res = await axios.get('http://localhost:5000/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfileData(res.data);
            } catch (error) {
                console.error("Failed to load profile", error);
            }
        };

        if (user) {
            fetchHistory();
            fetchProfile();
        }
    }, [user]);

    // Format data for chart
    const chartData = history.slice(0, 10).reverse().map(item => ({
        date: new Date(item.createdAt).toLocaleDateString(),
        probability: item.probability,
        disease: item.predictedDisease
    }));

    const cardClass = `p-6 rounded-[24px] glass-panel border border-primary/20 hover:border-primary/50 transition-all duration-300 relative overflow-hidden group`;

    const handleWellnessSubmit = async (e) => {
        e.preventDefault();
        setSubmittingWellness(true);
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const res = await axios.post('http://localhost:5000/api/user/wellness',
                { stress, sleep, mood },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProfileData(prev => ({ ...prev, mentalWellnessScore: res.data.mentalWellnessScore, points: res.data.points }));
        } catch (error) {
            console.error("Failed to submit wellness", error);
        } finally {
            setSubmittingWellness(false);
        }
    };

    // Calculate Biological Age
    const actualAge = profileData?.age || 30;
    const healthScore = Math.max(40, 100 - (history.length * 5));
    const wellnessImpact = profileData?.mentalWellnessScore ? (profileData.mentalWellnessScore > 75 ? -2 : profileData.mentalWellnessScore < 50 ? 3 : 0) : 0;
    const diseaseImpact = history.some(h => h.riskLevel === 'High') ? +4 : history.some(h => h.riskLevel === 'Medium') ? +1 : -1;
    const biologicalAge = actualAge + diseaseImpact + wellnessImpact;

    // Health Identity Profile Logic
    let identityProfile = "The Observer";
    if (profileData) {
        if (profileData.mentalWellnessScore > 80 && healthScore > 80) identityProfile = "The Balanced Optimizer";
        else if (sleep < 6 && stress > 7) identityProfile = "The Sleep-Deprived Achiever";
        else if (stress > 7) identityProfile = "The Stress-Driven Performer";
        else if (healthScore < 60) identityProfile = "The Sedentary Thinker";
        else identityProfile = "The Health Conscious Explorer";
    }

    return (
        <div className="w-full max-w-7xl mx-auto py-10 relative z-10">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none"></div>

            <motion.div
                className="mb-10 text-center lg:text-left relative z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="inline-block px-4 py-1 mb-4 rounded-full glass-panel border border-neonCyan/50 text-neonCyan text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                    Operative Dashboard
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-neonCyan to-secondary drop-shadow-md mb-2">
                    Welcome back, {user?.name.split(' ')[0]}
                </h1>
                <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">System diagnostics and health telemetry</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Gamification Stats */}
                    {profileData && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <motion.div className={cardClass} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-bl-full filter blur-xl transition-all group-hover:bg-green-500/20"></div>
                                <div className="flex flex-col items-center relative z-10">
                                    <div className="relative w-24 h-24 mb-4 flex items-center justify-center rounded-full glass-panel border border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)] group-hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all">
                                        <Heart size={36} className="text-green-400 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                                        <span className="absolute -bottom-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-black tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                                            {Math.max(40, 100 - (history.length * 5))} / 100
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-gray-300 uppercase tracking-widest text-xs">Vitality Score</h3>
                                </div>
                            </motion.div>

                            <motion.div className={cardClass} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full filter blur-xl transition-all group-hover:bg-orange-500/20"></div>
                                <div className="flex flex-col items-center relative z-10">
                                    <div className="w-20 h-20 glass-panel border border-orange-500/50 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(249,115,22,0.3)] group-hover:shadow-[0_0_25px_rgba(249,115,22,0.6)] transition-all transform group-hover:rotate-6">
                                        <Flame size={40} className="text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                                    </div>
                                    <h3 className="font-black text-3xl text-white drop-shadow-md">{profileData.currentStreak}</h3>
                                    <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mt-1">Active Streak</p>
                                </div>
                            </motion.div>

                            <motion.div className={cardClass} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/10 rounded-bl-full filter blur-xl transition-all group-hover:bg-tertiary/20"></div>
                                <div className="flex flex-col items-center relative z-10">
                                    <div className="w-20 h-20 glass-panel border border-tertiary/50 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_25px_rgba(139,92,246,0.6)] transition-all transform group-hover:-rotate-6">
                                        <Trophy size={40} className="text-tertiary drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                                    </div>
                                    <h3 className="font-black text-3xl text-white drop-shadow-md">{profileData.points || 0}</h3>
                                    <p className="text-[10px] font-bold text-tertiary uppercase tracking-widest mt-1">Credits Earned</p>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Health Identity Profile */}
                    <motion.div
                        className={`p-8 rounded-[24px] glass-panel border border-indigo-500/50 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-shadow`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 mix-blend-overlay"></div>
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/20 rounded-full filter blur-3xl group-hover:bg-indigo-500/30 transition-colors"></div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10 gap-4">
                            <div className="flex items-center">
                                <div className="w-16 h-16 rounded-2xl glass-panel border border-indigo-400/50 flex items-center justify-center mr-6 shadow-[0_0_15px_rgba(99,102,241,0.4)] relative">
                                    <div className="absolute inset-0 rounded-2xl border border-indigo-400 opacity-50 animate-ping"></div>
                                    <Fingerprint size={32} className="text-indigo-300 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">AI Classification Profile</p>
                                    <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 drop-shadow-md">
                                        {identityProfile}
                                    </h3>
                                </div>
                            </div>
                            <div className="sm:text-right hidden sm:block">
                                <div className="h-10 w-[1px] bg-indigo-500/30 mx-auto mb-2"></div>
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Telemetry Based</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Chart Card */}
                    <motion.div
                        className={cardClass}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none"></div>
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <h2 className="text-lg font-black uppercase tracking-widest text-white flex items-center">
                                <Activity className="mr-3 text-neonCyan animate-pulse" size={24} />
                                Diagnostic Timeline
                            </h2>
                            <div className="flex space-x-2">
                                <span className="w-2 h-2 rounded-full bg-neonCyan animate-ping"></span>
                                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                            </div>
                        </div>

                        {history.length > 0 ? (
                            <div className="w-full h-[350px] relative z-10 glass-panel border border-white/5 rounded-xl p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} tickLine={false} axisLine={false} />
                                        <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(5,8,20,0.9)',
                                                borderColor: 'rgba(0,240,255,0.3)',
                                                borderRadius: '12px',
                                                boxShadow: '0 0 20px rgba(0,240,255,0.2)',
                                                color: '#fff',
                                                backdropFilter: 'blur(10px)'
                                            }}
                                            itemStyle={{ color: '#00f0ff', fontWeight: 'bold' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="probability"
                                            stroke="#00f0ff"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#050814', stroke: '#00f0ff', strokeWidth: 2 }}
                                            activeDot={{ r: 8, fill: '#00f0ff', stroke: '#fff', strokeWidth: 2, filter: 'drop-shadow(0px 0px 5px rgba(0,240,255,0.8))' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-[350px] text-center glass-panel border border-white/5 rounded-xl">
                                <div className="w-20 h-20 rounded-full border border-dashed border-gray-600 flex items-center justify-center mb-4">
                                    <FileText size={32} className="text-gray-500" />
                                </div>
                                <p className="text-gray-400 font-medium uppercase tracking-widest text-sm mb-6">Insufficient Data Fragments</p>
                                <Link to="/predict" className="px-8 py-3 relative overflow-hidden rounded-lg font-bold uppercase tracking-widest text-xs text-white border border-primary/50 bg-primary/20 hover:bg-primary/40 hover:shadow-[0_0_15px_rgba(14,165,233,0.5)] transition-all group">
                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                                    Initiate Scan
                                </Link>
                            </div>
                        )}
                    </motion.div>

                    {/* Mental Wellness Module */}
                    <motion.div
                        className={cardClass}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-secondary to-primary"></div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pl-4 relative z-10">
                            <h2 className="text-lg font-black uppercase tracking-widest text-white flex items-center mb-4 sm:mb-0">
                                <Brain className="mr-3 text-secondary" size={24} />
                                Neural Wellness Calibrator
                            </h2>
                            {profileData?.mentalWellnessScore && (
                                <div className="flex items-center px-4 py-1.5 rounded-full glass-panel border border-secondary/50 shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                                    <Zap size={14} className="text-secondary mr-2" />
                                    <span className="text-secondary text-xs font-black uppercase tracking-widest">
                                        Integrity: {profileData.mentalWellnessScore}%
                                    </span>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleWellnessSubmit} className="space-y-6 relative z-10 pl-4">
                            <div className="glass-panel p-4 rounded-xl border border-white/5">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex justify-between items-center">
                                    <span className="flex items-center"><Flame size={14} className="mr-2 text-red-500" /> Stress Level</span>
                                    <span className="bg-[#050814] px-2 py-1 rounded text-red-400 border border-red-500/30">{stress}/10</span>
                                </label>
                                <input type="range" min="1" max="10" value={stress} onChange={e => setStress(e.target.value)} className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            </div>
                            <div className="glass-panel p-4 rounded-xl border border-white/5">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex justify-between items-center">
                                    <span className="flex items-center"><Clock size={14} className="mr-2 text-neonCyan" /> Sleep Duration</span>
                                    <span className="bg-[#050814] px-2 py-1 rounded text-neonCyan border border-neonCyan/30">{sleep} H</span>
                                </label>
                                <input type="range" min="0" max="12" value={sleep} onChange={e => setSleep(e.target.value)} className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.5)]" />
                            </div>
                            <div className="glass-panel p-4 rounded-xl border border-white/5">
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-4 flex justify-between items-center">
                                    <span className="flex items-center"><Smile size={14} className="mr-2 text-yellow-400" /> Mood Index</span>
                                    <span className="bg-[#050814] px-2 py-1 rounded text-yellow-400 border border-yellow-400/30">{mood}/10</span>
                                </label>
                                <input type="range" min="1" max="10" value={mood} onChange={e => setMood(e.target.value)} className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={submittingWellness}
                                className="w-full py-4 relative overflow-hidden rounded-xl font-black uppercase tracking-widest text-white border border-secondary/50 bg-gradient-to-r from-secondary/80 to-primary/80 hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] transition-all flex justify-center items-center group mt-6"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                {submittingWellness ? (
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                ) : (
                                    <span className="relative z-10 drop-shadow-md flex items-center"><Zap size={18} className="mr-2" /> Sync Parameters</span>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>

                {/* Right Column */}
                <div className="space-y-8 lg:col-span-1">

                    {/* Biological Age Estimator */}
                    <motion.div
                        className={`p-8 rounded-[24px] glass-panel border relative overflow-hidden group ${biologicalAge > actualAge ? 'bg-red-500/10 border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]' : biologicalAge < actualAge ? 'bg-green-500/10 border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 'bg-primary/10 border-primary/50 hover:shadow-[0_0_30px_rgba(14,165,233,0.2)]'}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Scanner effect line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/50 opacity-50 shadow-[0_0_10px_#fff] animate-scanline"></div>

                        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6 flex items-center border-b border-white/10 pb-2">
                            <Activity className="mr-2" size={14} /> Chrono-Biological Estimator
                        </h2>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end border-l-2 border-gray-600 pl-4 relative">
                                <div className="absolute -left-[5px] top-1/2 -mt-1 w-2 h-2 rounded-full bg-gray-500"></div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Standard Age</p>
                                    <h3 className="text-3xl font-bold text-gray-300">{actualAge}</h3>
                                </div>
                            </div>

                            <div className={`flex justify-between items-end border-l-2 pl-4 relative ${biologicalAge > actualAge ? 'border-red-500' : biologicalAge < actualAge ? 'border-green-500' : 'border-primary'}`}>
                                <div className={`absolute -left-[6px] top-1/2 -mt-1.5 w-3 h-3 rounded-full animate-pulse ${biologicalAge > actualAge ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : biologicalAge < actualAge ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-primary shadow-[0_0_10px_rgba(14,165,233,0.8)]'}`}></div>
                                <div>
                                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 shadow-sm ${biologicalAge > actualAge ? 'text-red-400' : biologicalAge < actualAge ? 'text-green-400' : 'text-primary'}`}>Cellular Age</p>
                                    <h3 className={`text-5xl font-black drop-shadow-md ${biologicalAge > actualAge ? 'text-red-500' : biologicalAge < actualAge ? 'text-green-500' : 'text-primary'}`}>{biologicalAge}</h3>
                                </div>
                                <div className="pb-1">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-md border ${biologicalAge > actualAge ? 'bg-red-500/20 text-red-400 border-red-500/30' : biologicalAge < actualAge ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-primary/20 text-primary border-primary/30'}`}>
                                        {biologicalAge > actualAge ? `+${biologicalAge - actualAge} YRS` : biologicalAge < actualAge ? `-${actualAge - biologicalAge} YRS` : 'MATCH'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={`mt-6 p-3 rounded-lg border text-xs leading-relaxed ${biologicalAge < actualAge ? "bg-green-500/10 border-green-500/30 text-green-300" : biologicalAge > actualAge ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-primary/10 border-primary/30 text-primary"}`}>
                            {biologicalAge < actualAge ? "Integrity optimal. Rejuvenation patterns detected." : biologicalAge > actualAge ? "Warning: Cellular degradation exceeds chronological parameters. Review protocol." : "Biological and chronological markers synchronized."}
                        </div>
                    </motion.div>

                    <motion.div
                        className={cardClass}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center border-b border-white/10 pb-4 text-white">
                            <CalendarDays className="mr-3 text-neonCyan" size={18} />
                            Log Records
                        </h2>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {loading ? (
                                <div className="flex justify-center py-10"><span className="animate-spin h-8 w-8 border-2 border-neonCyan border-t-transparent rounded-full shadow-[0_0_15px_rgba(0,240,255,0.5)]"></span></div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-10">
                                    <FileText size={24} className="mx-auto text-gray-600 mb-2" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500">No logs discovered</p>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {history.slice(0, 5).map((item, idx) => {
                                        const dateObj = new Date(item.createdAt);
                                        const month = dateObj.toLocaleString('default', { month: 'short' });
                                        const day = dateObj.getDate();

                                        const isHigh = item.riskLevel === 'High';
                                        const isMed = item.riskLevel === 'Medium';

                                        const riskColor = isHigh ? 'text-red-400' : isMed ? 'text-yellow-400' : 'text-green-400';
                                        const riskBorder = isHigh ? 'border-red-500/30' : isMed ? 'border-yellow-400/30' : 'border-green-500/30';
                                        const riskBg = isHigh ? 'bg-red-500/10' : isMed ? 'bg-yellow-400/10' : 'bg-green-500/10';

                                        return (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.1 }}
                                                key={item._id}
                                                className={`flex items-stretch rounded-xl border glass-panel hover:bg-white/5 transition-colors overflow-hidden group ${riskBorder}`}
                                            >
                                                <div className={`w-14 flex flex-col items-center justify-center border-r border-white/5 ${riskBg}`}>
                                                    <span className={`text-[10px] font-black uppercase ${riskColor} opacity-70`}>{month}</span>
                                                    <span className={`text-xl font-black ${riskColor} drop-shadow-md`}>{day}</span>
                                                </div>
                                                <div className="p-3 flex-1 flex flex-col justify-center relative overflow-hidden">
                                                    <div className={`absolute top-0 right-0 w-16 h-16 rounded-full blur-xl opacity-20 transition-opacity group-hover:opacity-50 ${isHigh ? 'bg-red-500' : isMed ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                                                    <h3 className="font-bold text-sm text-white truncate relative z-10">{item.predictedDisease}</h3>
                                                    <div className="flex justify-between items-center mt-2 relative z-10">
                                                        <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${riskBg} ${riskColor} border ${riskBorder}`}>
                                                            {item.riskLevel}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-400">TGT: <span className="text-white">{item.probability}%</span></span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            )}
                        </div>

                        {history.length > 0 && (
                            <Link to="/predict" className="block w-full text-center mt-6 py-3 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-300 hover:bg-white/5 hover:text-white transition-all">
                                Open Full Archive
                            </Link>
                        )}
                    </motion.div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
