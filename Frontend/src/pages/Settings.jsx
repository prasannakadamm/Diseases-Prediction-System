import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Settings as SettingsIcon, Bell, Lock, Smartphone, Monitor, Save, Activity, Mail } from 'lucide-react';

const Settings = () => {
    const { user } = useAuth();
    const { theme } = useTheme();

    const [settings, setSettings] = useState({
        notifications: { email: true, sms: false, healthReminders: true },
        privacy: { shareDataForResearch: false, publicProfile: false },
        ui: { darkMode: true, animations: true }
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const token = JSON.parse(localStorage.getItem('user'))?.token;
                const res = await axios.get('http://localhost:5000/api/user/settings', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data) {
                    setSettings({
                        notifications: res.data.notifications || settings.notifications,
                        privacy: res.data.privacy || settings.privacy,
                        ui: res.data.ui || settings.ui
                    });
                }
            } catch (err) {
                console.error("Error fetching settings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleToggle = (category, key) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: !prev[category][key]
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            await axios.put('http://localhost:5000/api/user/settings', settings, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('Settings synchronized with mainframe.');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error("Error saving settings", err);
        } finally {
            setSaving(false);
        }
    };

    const ToggleSwitch = ({ label, desc, checked, onChange, icon: Icon }) => (
        <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl transition-all hover:border-primary/30">
            <div className="flex items-start">
                {Icon && <Icon size={20} className="text-primary mt-1 mr-3 opacity-80" />}
                <div>
                    <h4 className="font-bold text-sm tracking-wide">{label}</h4>
                    {desc && <p className="text-xs opacity-60 mt-0.5">{desc}</p>}
                </div>
            </div>
            <button
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-primary shadow-[0_0_10px_rgba(14,165,233,0.5)]' : 'bg-gray-600'}`}
            >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex justify-between items-end"
            >
                <div>
                    <h1 className="text-4xl font-extrabold flex items-center text-transparent bg-clip-text bg-gradient-to-r from-neonPink to-primary uppercase tracking-wider">
                        <SettingsIcon className="mr-3 text-primary" size={32} /> System Settings
                    </h1>
                    <p className="text-gray-400 mt-2">Configure module parameters and data permissions.</p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg uppercase tracking-wider text-xs transition-transform hover:-translate-y-1 shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center"
                >
                    {saving ? 'Saving...' : <><Save size={16} className="mr-2" /> Save Config</>}
                </button>
            </motion.div>

            {message && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-3 bg-primary/20 border border-primary/50 text-neonCyan font-mono text-xs uppercase rounded-lg flex items-center">
                    <Activity size={14} className="mr-2" /> {message}
                </motion.div>
            )}

            {loading ? (
                <div className="flex justify-center py-20"><span className="animate-pulse font-mono text-primary">Loading configurations...</span></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Notifications Block */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`p-6 rounded-2xl glass-panel border ${theme === 'dark' ? 'border-primary/20 bg-[#050814]/80' : 'border-gray-200 bg-white/80'}`}>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-5 flex items-center border-b border-primary/20 pb-2">
                            <Bell size={16} className="mr-2" /> Communication Protocol
                        </h3>
                        <div className="space-y-4">
                            <ToggleSwitch
                                label="System Emails" desc="Receive medical reports and alerts via email."
                                checked={settings.notifications.email}
                                onChange={() => handleToggle('notifications', 'email')}
                                icon={Mail}
                            />
                            <ToggleSwitch
                                label="SMS Direct" desc="Direct alerts to your registered mobile."
                                checked={settings.notifications.sms}
                                onChange={() => handleToggle('notifications', 'sms')}
                                icon={Smartphone}
                            />
                            <ToggleSwitch
                                label="Health Reminders" desc="Automated nudges for weekly checkups."
                                checked={settings.notifications.healthReminders}
                                onChange={() => handleToggle('notifications', 'healthReminders')}
                                icon={Activity}
                            />
                        </div>
                    </motion.div>

                    {/* Privacy & UI Block */}
                    <div className="space-y-8">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className={`p-6 rounded-2xl glass-panel border ${theme === 'dark' ? 'border-primary/20 bg-[#050814]/80' : 'border-gray-200 bg-white/80'}`}>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-neonPink mb-5 flex items-center border-b border-neonPink/20 pb-2">
                                <Lock size={16} className="mr-2" /> Data Encryption & Privacy
                            </h3>
                            <div className="space-y-4">
                                <ToggleSwitch
                                    label="Medical Research Pool" desc="Anonymize and share diagnosis data to train AI."
                                    checked={settings.privacy.shareDataForResearch}
                                    onChange={() => handleToggle('privacy', 'shareDataForResearch')}
                                />
                                <ToggleSwitch
                                    label="Public Profile" desc="Allow other users in the network to view stats."
                                    checked={settings.privacy.publicProfile}
                                    onChange={() => handleToggle('privacy', 'publicProfile')}
                                />
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className={`p-6 rounded-2xl glass-panel border ${theme === 'dark' ? 'border-primary/20 bg-[#050814]/80' : 'border-gray-200 bg-white/80'}`}>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-neonCyan mb-5 flex items-center border-b border-neonCyan/20 pb-2">
                                <Monitor size={16} className="mr-2" /> Interface Overrides
                            </h3>
                            <div className="space-y-4">
                                <p className="text-xs opacity-60 italic mb-2">Note: Master Theme is toggled via Navbar. These are account defaults.</p>
                                <ToggleSwitch
                                    label="Force Dark Mode" desc="Always initialize app in dark mode on login."
                                    checked={settings.ui.darkMode}
                                    onChange={() => handleToggle('ui', 'darkMode')}
                                />
                                <ToggleSwitch
                                    label="Heavy Animations" desc="Enable all Framer Motion GPU transitions."
                                    checked={settings.ui.animations}
                                    onChange={() => handleToggle('ui', 'animations')}
                                />
                            </div>
                        </motion.div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Settings;
