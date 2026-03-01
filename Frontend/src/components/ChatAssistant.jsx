import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ChatAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hi there! 👋 I am your AI Health Assistant. Need help understanding your results?' }
    ]);
    const [input, setInput] = useState('');
    const { user } = useAuth();
    const { theme } = useTheme();

    if (!user || user.role === 'admin') return null; // Only show for logged in regular users

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { type: 'user', text: input }]);
        setInput('');

        // Mock bot response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                type: 'bot',
                text: "I am a demonstration assistant. In a full production app, I would connect to an LLM to answer specific questions about your health report based on MedPredict AI's outputs!"
            }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className={`absolute bottom-16 right-0 w-80 md:w-96 rounded-2xl shadow-2xl overflow-hidden flex flex-col border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}
                        style={{ height: '400px' }}
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-primary to-secondary text-white flex justify-between items-center">
                            <div className="flex items-center font-bold">
                                <Bot size={20} className="mr-2" /> MedPredict Assistant
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.type === 'user' ? 'bg-primary text-white rounded-tr-sm' : theme === 'dark' ? 'bg-slate-700 text-slate-200 rounded-tl-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className={`p-3 border-t flex items-center ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white'}`}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className={`flex-1 px-4 py-2 rounded-full outline-none text-sm transition-all ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-white focus:border-primary border' : 'bg-gray-100 border-transparent focus:bg-white focus:border-primary border'}`}
                            />
                            <button type="submit" className="ml-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-secondary transition transform hover:scale-105 shadow-md">
                                <Send size={18} className="translate-x-0.5" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{
                    boxShadow: isOpen ? "0px 0px 0px 0px rgba(14,165,233,0)" : "0px 0px 20px 0px rgba(14,165,233,0.5)"
                }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                className="w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </div>
    );
};

export default ChatAssistant;
