import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Users, Activity, AlertTriangle, Database, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const { theme } = useTheme();
    const [stats, setStats] = useState(null);
    const [predictions, setPredictions] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token;
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const [statsRes, predsRes, usersRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/stats', config),
                    axios.get('http://localhost:5000/api/admin/predictions', config),
                    axios.get('http://localhost:5000/api/admin/users', config)
                ]);

                setStats(statsRes.data);
                setPredictions(predsRes.data);
                setUsers(usersRes.data);
            } catch (error) {
                console.error("Error fetching admin data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const handleRetrain = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            await axios.post('http://localhost:5000/api/admin/retrain', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Model retraining triggered successfully.');
        } catch (error) {
            alert('Error triggering retraining.');
        }
    };

    const diseaseCount = predictions.reduce((acc, curr) => {
        acc[curr.predictedDisease] = (acc[curr.predictedDisease] || 0) + 1;
        return acc;
    }, {});

    const barData = Object.keys(diseaseCount).map(key => ({
        name: key,
        count: diseaseCount[key]
    }));

    const COLORS = ['#0ea5e9', '#00f0ff', '#d946ef', '#ff003c', '#8b5cf6', '#22c55e', '#f59e0b'];
    const cardClass = `p-6 rounded-[24px] glass-panel border border-tertiary/20 hover:border-tertiary/50 transition-all duration-300 relative overflow-hidden group`;

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[60vh]">
            <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 rounded-full border-t-4 border-neonCyan animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-r-4 border-tertiary animate-spin direction-reverse"></div>
                <div className="absolute inset-4 rounded-full border-b-4 border-neonPink animate-spin"></div>
                <Cpu size={32} className="absolute inset-0 m-auto text-white animate-pulse" />
            </div>
            <p className="text-neonCyan font-bold uppercase tracking-widest text-sm animate-pulse">Accessing Mainframe...</p>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto py-10 relative z-10">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tertiary/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neonPink/10 rounded-full blur-[150px] pointer-events-none"></div>

            <motion.div
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10 gap-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <div className="inline-block px-4 py-1 mb-4 rounded-full glass-panel border border-tertiary/50 text-tertiary text-xs font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(139,92,246,0.3)] flex items-center">
                        <ShieldAlert size={14} className="mr-2" /> Clearance Level: Administrative
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-tertiary via-neonPink to-primary drop-shadow-md mb-2">
                        System Control Node
                    </h1>
                    <p className="text-gray-400 font-medium uppercase tracking-wider text-sm">Global Data Fabric & Neural Net Oversight</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRetrain}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-tertiary/80 to-neonPink/80 hover:from-tertiary hover:to-neonPink text-white rounded-xl font-black uppercase tracking-widest text-xs border border-white/20 shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all group overflow-hidden relative"
                >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <Database size={18} className="mr-2 relative z-10 drop-shadow-md group-hover:animate-bounce" />
                    <span className="relative z-10 drop-shadow-md">Compile Network</span>
                </motion.button>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
                <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full filter blur-xl transition-all group-hover:bg-primary/20"></div>
                    <div className="flex items-center relative z-10">
                        <div className="w-16 h-16 rounded-2xl glass-panel border border-primary/50 flex items-center justify-center mr-6 shadow-[0_0_15px_rgba(14,165,233,0.3)] group-hover:shadow-[0_0_25px_rgba(14,165,233,0.6)] transition-all">
                            <Users size={28} className="text-primary drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Registered Operatives</p>
                            <h3 className="text-4xl font-black text-white drop-shadow-md">{stats?.totalUsers || 0}</h3>
                        </div>
                    </div>
                </motion.div>

                <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neonCyan/10 rounded-bl-full filter blur-xl transition-all group-hover:bg-neonCyan/20"></div>
                    <div className="flex items-center relative z-10">
                        <div className="w-16 h-16 rounded-2xl glass-panel border border-neonCyan/50 flex items-center justify-center mr-6 shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transition-all">
                            <Activity size={28} className="text-neonCyan drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-neonCyan uppercase tracking-widest mb-1">Diagnostic Scans</p>
                            <h3 className="text-4xl font-black text-white drop-shadow-md">{stats?.totalPredictions || 0}</h3>
                        </div>
                    </div>
                </motion.div>

                <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neonPink/10 rounded-bl-full filter blur-xl transition-all group-hover:bg-neonPink/20"></div>
                    <div className="flex items-center relative z-10">
                        <div className="w-16 h-16 rounded-2xl glass-panel border border-neonPink/50 flex items-center justify-center mr-6 shadow-[0_0_15px_rgba(255,0,60,0.3)] group-hover:shadow-[0_0_25px_rgba(255,0,60,0.6)] transition-all">
                            <AlertTriangle size={28} className="text-neonPink drop-shadow-[0_0_8px_rgba(255,0,60,0.8)]" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-neonPink uppercase tracking-widest mb-1">Primary Threat</p>
                            <h3 className="text-2xl font-black text-white drop-shadow-md truncate max-w-[150px]">{stats?.topDisease || 'N/A'}</h3>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 relative z-10">
                {/* Bar Chart */}
                <motion.div className={cardClass} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-tertiary/5 pointer-events-none"></div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center mb-8 border-b border-white/10 pb-4">
                        <Activity className="mr-3 text-tertiary" size={20} /> Anomaly Frequency Distribution
                    </h3>
                    <div className="w-full h-[350px] bg-[#050814]/40 rounded-xl border border-white/5 p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical" margin={{ left: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} tickLine={false} axisLine={false} />
                                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.7)" width={120} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 'bold' }} tickLine={false} axisLine={false} />
                                <RechartsTooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: 'rgba(5,8,20,0.9)', borderColor: 'rgba(139,92,246,0.3)', borderRadius: '12px', boxShadow: '0 0 20px rgba(139,92,246,0.2)', color: '#fff', backdropFilter: 'blur(10px)' }}
                                    itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="count" fill="url(#colorUv)" radius={[0, 6, 6, 0]}>
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                        <stop offset="100%" stopColor="#d946ef" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Pie Chart */}
                <motion.div className={cardClass} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neonPink/5 pointer-events-none"></div>
                    <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center mb-8 border-b border-white/10 pb-4">
                        <PieChart className="mr-3 text-neonPink" size={20} /> Global Vector Analysis
                    </h3>
                    <div className="w-full h-[350px] bg-[#050814]/40 rounded-xl border border-white/5 p-4 flex items-center justify-center relative">
                        {/* Decorative central circle */}
                        <div className="absolute w-24 h-24 rounded-full border border-dashed border-white/20 animate-spin-slow"></div>
                        <div className="absolute w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Core</span>
                        </div>

                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={barData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="count"
                                    stroke="rgba(5,8,20,0.8)"
                                    strokeWidth={2}
                                >
                                    {barData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}
                                            style={{
                                                filter: `drop-shadow(0px 0px 8px ${COLORS[index % COLORS.length]}80)`
                                            }}
                                        />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ backgroundColor: 'rgba(5,8,20,0.9)', borderColor: 'rgba(255,0,60,0.3)', borderRadius: '12px', boxShadow: '0 0 20px rgba(255,0,60,0.2)', color: '#fff', backdropFilter: 'blur(10px)' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center mb-6 border-b border-white/10 pb-4 relative z-10">
                    <Users className="mr-3 text-primary" size={20} /> Active Node Registry
                </h3>

                <div className="overflow-x-auto relative z-10 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                <th className="py-4 px-6 bg-white/5 rounded-tl-xl">Designation</th>
                                <th className="py-4 px-6 bg-white/5">Network ID</th>
                                <th className="py-4 px-6 bg-white/5">Clearance</th>
                                <th className="py-4 px-6 bg-white/5 rounded-tr-xl">Establishment Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {users.slice(0, 10).map((u, idx) => (
                                    <motion.tr
                                        key={u._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                        className="border-b border-white/5 text-sm hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="py-4 px-6 font-bold text-gray-200 group-hover:text-white transition-colors">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3 border border-primary/50 text-primary uppercase text-xs">
                                                    {u.name.charAt(0)}
                                                </div>
                                                {u.name}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-400 font-mono text-xs">{u.email}</td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded border ${u.role === 'admin' ? 'bg-tertiary/20 text-tertiary border-tertiary/50 shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'bg-neonCyan/10 text-neonCyan border-neonCyan/30'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-500 font-mono text-xs tracking-wider">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                            <span className="ml-2 text-[10px] text-gray-600">{new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <div className="text-center py-10 text-gray-500 text-xs font-bold uppercase tracking-widest">
                            No active nodes detected in sector.
                        </div>
                    )}
                </div>

                {users.length > 5 && (
                    <div className="mt-6 text-center relative z-10">
                        <button className="px-6 py-2 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                            Expand Node Registry
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Predictions Table */}
            <motion.div className={cardClass} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center mb-6 border-b border-white/10 pb-4 relative z-10">
                    <Activity className="mr-3 text-neonCyan" size={20} /> Diagnostic Records
                </h3>

                <div className="overflow-x-auto relative z-10 custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                <th className="py-4 px-6 bg-white/5 rounded-tl-xl">Operative</th>
                                <th className="py-4 px-6 bg-white/5">Diagnosis</th>
                                <th className="py-4 px-6 bg-white/5">Risk Level</th>
                                <th className="py-4 px-6 bg-white/5 rounded-tr-xl">Scan Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {predictions.slice(0, 10).map((p, idx) => (
                                    <motion.tr
                                        key={p._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                        className="border-b border-white/5 text-sm hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="py-4 px-6 font-bold text-gray-200 group-hover:text-white transition-colors">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 rounded-full bg-neonCyan/20 flex items-center justify-center mr-3 border border-neonCyan/50 text-neonCyan uppercase text-xs">
                                                    {p.user?.name ? p.user.name.charAt(0) : '?'}
                                                </div>
                                                {p.user?.name || 'Unknown Node'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-white font-bold tracking-wide">{p.predictedDisease}</span>
                                            <div className="text-[10px] text-gray-500 uppercase mt-1">
                                                Confidence: {(p.probability * 100).toFixed(1)}%
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded border ${p.riskLevel === 'High' ? 'bg-neonPink/20 text-neonPink border-neonPink/50 shadow-[0_0_10px_rgba(255,0,60,0.3)]' :
                                                    p.riskLevel === 'Moderate' ? 'bg-amber-500/20 text-amber-500 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]' :
                                                        'bg-green-500/20 text-green-500 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                                                }`}>
                                                {p.riskLevel}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-gray-500 font-mono text-xs tracking-wider">
                                            {new Date(p.createdAt).toLocaleDateString()}
                                            <span className="ml-2 text-[10px] text-gray-600">{new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>

                    {predictions.length === 0 && (
                        <div className="text-center py-10 text-gray-500 text-xs font-bold uppercase tracking-widest">
                            No diagnostic records detected.
                        </div>
                    )}
                </div>

                {predictions.length > 10 && (
                    <div className="mt-6 text-center relative z-10">
                        <button className="px-6 py-2 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:bg-white/5 hover:text-white transition-all">
                            Expand Diagnostic Registry
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
