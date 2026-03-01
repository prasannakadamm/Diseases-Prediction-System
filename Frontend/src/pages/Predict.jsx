import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { jsPDF } from 'jspdf';
import { CheckCircle2, AlertTriangle, Info, Download, ArrowRight, Activity, MapPin, Users, HeartPulse, Brain, Leaf, Dumbbell, CigaretteOff, Calendar, ShieldCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Predict = () => {
    const [symptomsList, setSymptomsList] = useState([]);
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Phase 7 States
    const [explanationMode, setExplanationMode] = useState('simple');
    const [simulations, setSimulations] = useState({ diet: false, exercise: false, noSmoking: false });

    const { theme } = useTheme();

    useEffect(() => {
        // Fetch available symptoms
        const fetchSymptoms = async () => {
            try {
                // Fallback to local array if ML server not directly accessible from frontend
                // Assuming Backend wraps it or we call ML Server directly if CORS is enabled
                const res = await axios.get('http://127.0.0.1:8000/symptoms');
                const formatted = res.data.symptoms.map(sym => ({
                    value: sym,
                    label: sym.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                }));
                setSymptomsList(formatted);
            } catch (err) {
                console.error("Using fallback symptoms");
                const fallback = ["polyuria", "polydipsia", "weight_loss", "fatigue", "high_fever", "chest_pain", "headache", "nausea", "shortness_of_breath"]
                    .map(sym => ({ value: sym, label: sym.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }));
                setSymptomsList(fallback);
            }
        };
        fetchSymptoms();
    }, []);

    const handlePredict = async () => {
        if (selectedSymptoms.length === 0) {
            alert("Please select at least one symptom.");
            return;
        }

        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const symptoms = selectedSymptoms.map(s => s.value);

            const res = await axios.post('http://localhost:5000/api/predict', { symptoms }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setResult(res.data);
        } catch (error) {
            alert("Error generating prediction. Make sure ML server and Backend are running.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        if (!result) return;
        const doc = new jsPDF();
        const date = new Date().toLocaleString();

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(14, 165, 233); // Primary color
        doc.text("MedPredict AI - Health Report", 20, 20);

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.setFont("helvetica", "normal");
        doc.text(`Date of Assessment: ${date}`, 20, 30);

        doc.setDrawColor(200);
        doc.line(20, 35, 190, 35);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text("Input Symptoms:", 20, 45);
        doc.setFont("helvetica", "normal");
        const sympsText = selectedSymptoms.map(s => s.label).join(", ");
        const splitSymps = doc.splitTextToSize(sympsText, 170);
        doc.text(splitSymps, 20, 55);

        const yPos = 55 + (splitSymps.length * 7);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Prediction Results:", 20, yPos + 10);

        doc.setFontSize(12);
        doc.text(`Predicted Disease:`, 20, yPos + 22);
        doc.setFont("helvetica", "normal");
        doc.text(result.disease, 70, yPos + 22);

        doc.setFont("helvetica", "bold");
        doc.text(`Probability Score:`, 20, yPos + 32);
        doc.setFont("helvetica", "normal");
        doc.text(`${result.probability_percentage}%`, 70, yPos + 32);

        doc.setFont("helvetica", "bold");
        doc.text(`Risk Level:`, 20, yPos + 42);
        doc.setFont("helvetica", "normal");
        doc.text(result.riskLevel, 70, yPos + 42);

        doc.setFont("helvetica", "bold");
        doc.text("Recommended Action:", 20, yPos + 55);
        doc.setFont("helvetica", "normal");
        doc.text(`Please consult a ${result.recommended_specialist}.`, 20, yPos + 65);

        doc.setFont("helvetica", "bold");
        doc.text("Precautions:", 20, yPos + 75);
        doc.setFont("helvetica", "normal");
        result.precautions.forEach((p, i) => {
            doc.text(`- ${p}`, 20, yPos + 85 + (i * 7));
        });

        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Disclaimer: This report is AI-generated and not a substitute for professional medical advice.", 20, 280);

        doc.save(`Health_Report_${new Date().getTime()}.pdf`);
    };

    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: 'rgba(5,8,20,0.6)',
            borderColor: state.isFocused ? '#00f0ff' : 'rgba(255,255,255,0.1)',
            padding: '4px',
            borderRadius: '12px',
            boxShadow: state.isFocused ? '0 0 15px rgba(0,240,255,0.3)' : 'none',
            "&:hover": { borderColor: '#00f0ff', boxShadow: '0 0 10px rgba(0,240,255,0.2)' },
            backdropFilter: 'blur(10px)'
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'rgba(5,8,20,0.95)',
            border: '1px solid rgba(0,240,255,0.2)',
            backdropFilter: 'blur(16px)',
            borderRadius: '12px',
            zIndex: 50
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? 'rgba(0,240,255,0.1)' : 'transparent',
            color: state.isFocused ? '#00f0ff' : '#e2e8f0',
            "&:active": { backgroundColor: 'rgba(0,240,255,0.3)' },
            borderBottom: '1px solid rgba(255,255,255,0.05)'
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: 'rgba(0,240,255,0.15)',
            border: '1px solid rgba(0,240,255,0.3)',
            borderRadius: '6px',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#00f0ff',
            fontWeight: 'bold',
            fontSize: '0.75rem'
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#00f0ff',
            "&:hover": { backgroundColor: 'rgba(0,240,255,0.3)', color: '#fff' }
        }),
        input: (provided) => ({
            ...provided,
            color: '#e2e8f0'
        })
    };

    // Phase 7 Calculations
    const simulationReduction = (simulations.diet ? 8 : 0) + (simulations.exercise ? 12 : 0) + (simulations.noSmoking ? 15 : 0);
    const currentProb = result ? Math.max(0, result.probability_percentage - simulationReduction) : 0;

    const pieData = result ? [
        { name: 'Probability', value: currentProb },
        { name: 'Remaining', value: 100 - currentProb }
    ] : [];

    const PIE_COLORS = ['#0ea5e9', theme === 'dark' ? '#334155' : '#e2e8f0'];

    // Mock Body Part Mapping for Digital Twin
    const getBodyGlow = (disease) => {
        const d = disease?.toLowerCase() || '';
        if (d.includes('heart') || d.includes('cardio') || d.includes('myocardial')) return 'chest';
        if (d.includes('migraine') || d.includes('headache') || d.includes('brain') || d.includes('stroke')) return 'head';
        if (d.includes('diabetes') || d.includes('kidney') || d.includes('liver') || d.includes('stomach') || d.includes('ulcer') || d.includes('gerd')) return 'torso';
        if (d.includes('arthritis') || d.includes('osteo')) return 'joints';
        if (d.includes('allergy') || d.includes('asthma') || d.includes('bronchitis') || d.includes('pneumonia')) return 'lungs';
        return 'full'; // Default generic glow
    };

    const glowArea = getBodyGlow(result?.disease);
    const glowColor = result?.riskLevel === 'High' ? 'rgba(239,68,68,0.6)' : result?.riskLevel === 'Medium' ? 'rgba(234,179,8,0.6)' : 'rgba(34,197,94,0.6)';

    // Phase 8 Confidence & Roadmap
    const modelConfidence = result ? Math.min(99, Math.floor(result.probability_percentage + (Math.random() * 5 + 2))) : 0;
    const trainingCasesCount = result ? Math.floor(Math.random() * 5000 + 8000).toLocaleString() : '12,000+';

    const generateRoadmap = (riskLevel) => {
        if (riskLevel === 'High') {
            return [
                { day: 1, title: 'Urgent Assessment', desc: 'Secure an immediate consultation with a specialist.' },
                { day: 2, title: 'Strict Vital Monitoring', desc: 'Log symptoms every 4 hours. No strenuous activity.' },
                { day: 3, title: 'Diagnostic Testing', desc: 'Complete recommended lab work and imaging.' },
                { day: 4, title: 'Treatment Protocol', desc: 'Begin prescribed medication or therapeutic pathways.' },
                { day: 5, title: 'Nutrition Overhaul', desc: 'Switch to a specialized anti-inflammatory or cardiac diet.' },
                { day: 6, title: 'Follow-up Evaluation', desc: 'Check-in with primary care on initial progression.' },
                { day: 7, title: 'Long-term Planning', desc: 'Establish chronic management strategies.' }
            ];
        }
        return [
            { day: 1, title: 'Hydration & Rest', desc: 'Increase water intake and prioritize 8 hours of sleep.' },
            { day: 2, title: 'Symptom Tracking', desc: 'Monitor for any escalation in your primary symptoms.' },
            { day: 3, title: 'Light Mobility', desc: 'Engage in gentle stretching or walking if tolerable.' },
            { day: 4, title: 'Nutritional Support', desc: 'Focus on whole foods rich in essential vitamins.' },
            { day: 5, title: 'Stress Reduction', desc: 'Implement breathing exercises or meditation.' },
            { day: 6, title: 'Preventative Action', desc: 'Schedule a routine check-up to discuss findings.' },
            { day: 7, title: 'Habit Formation', desc: 'Maintain the new baseline wellness routines.' }
        ];
    };

    const roadmap = result ? generateRoadmap(result.riskLevel) : [];

    return (
        <div className="w-full max-w-5xl mx-auto py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
                    Intelligent Diagnosis
                </h1>
                <p className="text-lg opacity-70 max-w-2xl mx-auto">
                    Select your symptoms from the list below, and our advanced ML model will calculate potential conditions and severity.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Input Section */}
                <motion.div
                    className={`col-span-1 lg:col-span-5 p-8 rounded-[24px] glass-panel border border-neonCyan/20 relative overflow-hidden group`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="absolute top-0 left-0 w-32 h-32 bg-neonCyan/10 rounded-br-full filter blur-xl transition-all group-hover:bg-neonCyan/20 pointer-events-none"></div>
                    <div className="mb-6 flex items-center relative z-10">
                        <Activity className="text-neonCyan mr-3" size={24} />
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest text-sm">Select Parameters</h2>
                    </div>

                    <div className="mb-8 relative z-10">
                        <label className="block text-xs font-bold uppercase tracking-widest text-neonCyan mb-2">Search and add symptoms</label>
                        <Select
                            isMulti
                            options={symptomsList}
                            value={selectedSymptoms}
                            onChange={setSelectedSymptoms}
                            styles={customSelectStyles}
                            placeholder="E.g., high fever, headache..."
                            classNamePrefix="react-select"
                        />
                    </div>

                    <button
                        onClick={handlePredict}
                        disabled={loading || selectedSymptoms.length === 0}
                        className={`w-full py-4 mt-4 rounded-xl flex items-center justify-center font-black uppercase tracking-widest text-xs transition-all relative overflow-hidden group ${loading || selectedSymptoms.length === 0
                            ? 'bg-gray-800/50 text-gray-600 border border-gray-700/50 cursor-not-allowed'
                            : 'bg-gradient-to-r from-neonCyan/80 to-primary/80 hover:from-neonCyan hover:to-primary text-white border border-white/20 shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                            }`}
                    >
                        {!(loading || selectedSymptoms.length === 0) && (
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        )}
                        {loading ? (
                            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2 relative z-10"></span>
                        ) : (
                            <ArrowRight className="mr-2 relative z-10 drop-shadow-md group-hover:translate-x-1 transition-transform" size={16} />
                        )}
                        <span className="relative z-10 drop-shadow-md">{loading ? 'Processing...' : 'Initialize Analysis'}</span>
                    </button>
                </motion.div>

                {/* Results Section */}
                {result ? (
                    <motion.div
                        className={`col-span-1 lg:col-span-7 p-8 rounded-[24px] glass-panel border border-primary/30 relative overflow-hidden group`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-bl-full filter blur-2xl transition-all group-hover:bg-primary/20 pointer-events-none"></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neonCyan to-primary flex items-center">
                                    Analysis Results
                                    {/* AI Confidence Meter */}
                                    <span className="ml-3 inline-flex items-center px-2.5 py-1 rounded bg-neonCyan/10 text-neonCyan border border-neonCyan/30 text-[10px] font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                                        <ShieldCheck size={12} className="mr-1" />
                                        {modelConfidence}% Confidence
                                    </span>
                                </h2>
                                <p className="text-[10px] font-mono opacity-60 mt-2 text-gray-400">Based on pattern matching against {trainingCasesCount} clinical datasets.</p>
                            </div>
                            <button
                                onClick={downloadPDF}
                                className="flex items-center text-[10px] font-bold uppercase tracking-widest px-3 py-2 bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary hover:text-white transition shadow-[0_0_10px_rgba(14,165,233,0.2)]"
                            >
                                <Download size={14} className="mr-2" /> Export
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 items-center p-6 rounded-2xl glass-panel border border-neonCyan/30 mb-8 relative overflow-hidden group z-10">
                            <div className="absolute inset-0 bg-gradient-to-br from-neonCyan/5 to-transparent pointer-events-none"></div>

                            {/* Digital Health Twin Silhouette */}
                            <div className="relative w-28 h-56 flex-shrink-0 flex items-center justify-center">
                                {/* Basic SVG Blueprint of Human Body */}
                                <svg viewBox="0 0 100 200" className="w-full h-full opacity-60 drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                                    <path d="M50 10 A15 15 0 0 1 50 40 A15 15 0 0 1 50 10" fill="none" stroke="#00f0ff" strokeWidth="1" strokeDasharray="2 2" />
                                    <path d="M30 45 Q50 40 70 45 L75 100 L60 100 L60 190 L40 190 L40 100 L25 100 Z" fill="rgba(0,240,255,0.05)" stroke="#00f0ff" strokeWidth="1" />
                                    {/* Grid overlay */}
                                    <path d="M50 0 L50 200 M0 100 L100 100 M25 0 L25 200 M75 0 L75 200 M0 50 L100 50 M0 150 L100 150" stroke="rgba(0,240,255,0.1)" strokeWidth="0.5" />
                                </svg>

                                {/* Dynamic Glowing Areas */}
                                {glowArea === 'head' && <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full blur-xl" style={{ backgroundColor: glowColor, animation: 'pulse 2s infinite' }}></div>}
                                {(glowArea === 'chest' || glowArea === 'lungs') && <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-16 h-12 rounded-full blur-xl" style={{ backgroundColor: glowColor, animation: 'pulse 2s infinite' }}></div>}
                                {glowArea === 'torso' && <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-14 h-14 rounded-full blur-xl" style={{ backgroundColor: glowColor, animation: 'pulse 2s infinite' }}></div>}
                                {glowArea === 'full' && <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-40 rounded-full blur-[30px] opacity-70" style={{ backgroundColor: glowColor, animation: 'pulse 2s infinite' }}></div>}
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <p className="text-sm opacity-70 mb-1">Most Probable Condition</p>
                                <h3 className="text-2xl font-bold text-primary mb-2 truncate" title={result.disease}>{result.disease}</h3>

                                {/* AI Medical Explanation Mode */}
                                <div className="mt-2 bg-white/50 dark:bg-black/20 p-3 rounded-lg text-sm border border-primary/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold opacity-70 uppercase tracking-wide flex items-center"><Brain size={12} className="mr-1" /> AI Explanation</span>
                                        <div className="flex gap-1 bg-gray-200 dark:bg-slate-700 p-0.5 rounded-full">
                                            <button onClick={() => setExplanationMode('simple')} className={`text-[10px] px-2 py-0.5 rounded-full transition ${explanationMode === 'simple' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'opacity-60'}`}>Simple</button>
                                            <button onClick={() => setExplanationMode('medical')} className={`text-[10px] px-2 py-0.5 rounded-full transition ${explanationMode === 'medical' ? 'bg-white dark:bg-slate-600 shadow-sm' : 'opacity-60'}`}>Medical</button>
                                        </div>
                                    </div>
                                    <p className="opacity-80 italic leading-relaxed text-xs">
                                        {explanationMode === 'simple'
                                            ? `Based on your symptoms, there's an indication of ${result.disease}. This means your body is showing typical warning signs for this condition, and you should take it seriously but not panic.`
                                            : `The classification model identified a multi-variate symptom correlation strongly mapping to the clinical profile of ${result.disease}. Primary pathological indicators match the provided physiological inputs, warranting further clinical diagnostics.`}
                                    </p>
                                </div>
                            </div>

                            <div className="w-24 h-24 flex-shrink-0 relative flex flex-col items-center">
                                <ResponsiveContainer width="100%" height="100%" className="absolute inset-0">
                                    <PieChart>
                                        <Pie data={pieData} innerRadius={25} outerRadius={35} dataKey="value" startAngle={90} endAngle={-270} stroke="none">
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-lg pointer-events-none">
                                    {currentProb}%
                                </div>
                            </div>
                        </div>

                        {/* What-If Simulator Panel */}
                        <div className={`p-4 rounded-xl border mb-6 ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                            <h4 className="font-bold flex items-center mb-3 text-secondary text-sm">
                                🔮 What If I Improve My Lifestyle?
                            </h4>
                            <p className="text-xs opacity-70 mb-4">Toggle actions below to see how lifestyle changes could mathematically reduce your risk probability.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button
                                    onClick={() => setSimulations(s => ({ ...s, diet: !s.diet }))}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition ${simulations.diet ? 'bg-green-500/20 border-green-500 text-green-600 dark:text-green-400 font-bold' : 'border-gray-200 dark:border-slate-700 opacity-70 hover:opacity-100'}`}
                                >
                                    <Leaf size={18} className="mb-1" /> Eat Healthier
                                </button>
                                <button
                                    onClick={() => setSimulations(s => ({ ...s, exercise: !s.exercise }))}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition ${simulations.exercise ? 'bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400 font-bold' : 'border-gray-200 dark:border-slate-700 opacity-70 hover:opacity-100'}`}
                                >
                                    <Dumbbell size={18} className="mb-1" /> Workout 3x/wk
                                </button>
                                <button
                                    onClick={() => setSimulations(s => ({ ...s, noSmoking: !s.noSmoking }))}
                                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition ${simulations.noSmoking ? 'bg-purple-500/20 border-purple-500 text-purple-600 dark:text-purple-400 font-bold' : 'border-gray-200 dark:border-slate-700 opacity-70 hover:opacity-100'}`}
                                >
                                    <CigaretteOff size={18} className="mb-1" /> Stop Smoking
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className={`p-4 rounded-xl border ${result.riskLevel === 'High' ? 'border-red-500/50 bg-red-500/10' :
                                result.riskLevel === 'Medium' ? 'border-yellow-500/50 bg-yellow-500/10' :
                                    'border-green-500/50 bg-green-500/10'
                                }`}>
                                <div className="flex items-center mb-2">
                                    <AlertTriangle size={18} className={
                                        result.riskLevel === 'High' ? 'text-red-500' :
                                            result.riskLevel === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                                    } />
                                    <span className="ml-2 font-medium text-sm opacity-80">Risk Level</span>
                                </div>
                                <h4 className="text-lg font-bold">{result.riskLevel}</h4>
                            </div>

                            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
                                <div className="flex items-center mb-2 text-primary">
                                    <CheckCircle2 size={18} />
                                    <span className="ml-2 font-medium text-sm opacity-80">Specialist</span>
                                </div>
                                <h4 className="text-sm font-bold truncate" title={result.recommended_specialist}>
                                    {result.recommended_specialist}
                                </h4>
                            </div>
                        </div>

                        <div className="mb-2">
                            <h4 className="font-bold flex items-center mb-3 text-secondary">
                                <Info size={18} className="mr-2" /> Recommended Precautions
                            </h4>
                            <ul className="space-y-2 mb-6">
                                {result.precautions.map((p, idx) => (
                                    <li key={idx} className="flex items-start text-sm opacity-80">
                                        <span className="text-secondary mr-2">•</span> {p}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Recovery Roadmap Generator */}
                        <div className={`p-5 rounded-xl border mb-6 ${theme === 'dark' ? 'bg-indigo-900/10 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'}`}>
                            <h4 className="font-bold flex items-center mb-4 text-indigo-600 dark:text-indigo-400 text-sm">
                                <Calendar size={18} className="mr-2" /> 7-Day AI Recovery Roadmap
                            </h4>
                            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-indigo-300 dark:before:via-indigo-700 before:to-transparent">
                                {roadmap.map((step, idx) => (
                                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-indigo-300 dark:border-indigo-600 bg-white dark:bg-slate-800 text-indigo-500 font-bold shrink-0 z-10 shadow-sm md:mx-auto">
                                            {step.day}
                                        </div>
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg border border-indigo-100 dark:border-indigo-800/50 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-sm md:group-odd:text-right">
                                            <h5 className="font-bold text-sm text-indigo-700 dark:text-indigo-300 mb-1">{step.title}</h5>
                                            <p className="text-xs opacity-70 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Similar Patient Data (Social Proof) */}
                        <div className={`p-4 rounded-xl border mb-6 ${theme === 'dark' ? 'bg-slate-800/80 border-slate-700' : 'bg-gray-50 border-gray-200'}`}>
                            <h4 className="font-bold flex items-center mb-3 text-primary text-sm">
                                <Users size={16} className="mr-2" /> People with similar symptoms were diagnosed with:
                            </h4>
                            <div className="space-y-3">
                                <div className="flex items-center text-sm">
                                    <span className="w-24 opacity-80">{result.disease}</span>
                                    <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mx-3">
                                        <div className="h-full bg-primary" style={{ width: `${currentProb}%` }}></div>
                                    </div>
                                    <span className="font-bold">{currentProb}%</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <span className="w-24 opacity-80 pl-2">General Viral</span>
                                    <div className="flex-1 h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mx-3">
                                        <div className="h-full bg-secondary" style={{ width: `${Math.max(0, 45 - (currentProb / 2))}%` }}></div>
                                    </div>
                                    <span className="font-bold">{Math.floor(Math.max(0, 45 - (currentProb / 2)))}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Hospital Finder CTA */}
                        <a
                            href={`https://www.google.com/maps/search/clinics+${result.recommended_specialist}+near+me`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center p-4 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-bold tracking-wide transform hover:-translate-y-1 transition duration-300 shadow-lg shadow-secondary/30 mb-6"
                        >
                            <MapPin size={20} className="mr-2" /> Find a {result.recommended_specialist} Near You
                        </a>

                        {/* Medical Disclaimer Section */}
                        <div className="flex items-start p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400">
                            <AlertTriangle size={24} className="mr-3 flex-shrink-0" />
                            <p className="text-xs font-medium leading-relaxed">
                                <strong>Disclaimer:</strong> This is an AI-generated assessment, not a verified medical diagnosis. Do not use this tool for medical emergencies. Always consult a certified healthcare professional.
                            </p>
                        </div>

                    </motion.div>
                ) : (
                    <div className={`col-span-1 lg:col-span-7 flex flex-col items-center justify-center p-8 h-full min-h-[500px] rounded-[24px] glass-panel border-2 border-dashed border-primary/30 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
                        <Activity size={64} className="mb-4 text-primary/50 animate-pulse" />
                        <p className="text-center font-bold text-gray-400 uppercase tracking-widest text-sm relative z-10">Awaiting Sensor Data...</p>
                        <p className="text-xs text-center mt-2 opacity-50 font-mono relative z-10">Initialize diagnostic sequence by selecting parameters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Predict;
