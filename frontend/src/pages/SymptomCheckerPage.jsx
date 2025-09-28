import React, { useState, useContext } from 'react';
import { MessageSquare } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { getSymptomResponse } from '../api/gemini.js';
import GlassCard from '../components/ui/GlassCard.jsx';
import SymptomChecker from '../components/features/SymptomChecker.jsx';

const SymptomCheckerPage = () => {
    const { theme } = useContext(ThemeContext);
    const [messages, setMessages] = useState([
        { 
            sender: 'ai', 
            text: "Hello! I'm your AI Symptom Checker. I can help you understand your symptoms and provide preliminary insights.\n\nPlease describe your main symptom to get started:\n• 'I have a sore throat'\n• 'I'm experiencing chest pain'\n• 'I have a headache'\n\nRemember, this is not a substitute for professional medical advice." 
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        setError('');
        const userMessage = { sender: 'user', text: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponseText = await getSymptomResponse(newMessages);
            const aiResponse = { sender: 'ai', text: aiResponseText };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error("Gemini API error:", error);
            setError('Failed to get AI response. Please check your API key and try again.');
            const errorResponse = { 
                sender: 'ai', 
                text: "I'm sorry, I'm having trouble connecting right now. Please check your internet connection and try again. If the problem persists, please contact support." 
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([
        { 
            sender: 'ai', 
            text: "Hello! I'm your AI Symptom Checker. I can help you understand your symptoms and provide preliminary insights.\n\nPlease describe your main symptom to get started:\n• 'I have a sore throat'\n• 'I'm experiencing chest pain'\n• 'I have a headache'\n\nRemember, this is not a substitute for professional medical advice." 
        }
        ]);
        setError('');
    };

    return (
        <div className="p-6">
            <GlassCard className="h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h1 className={`text-3xl font-bold flex items-center gap-3 ${theme.text}`}>
                        <MessageSquare /> AI Symptom Checker
                    </h1>
                    <button 
                        onClick={clearChat}
                        className={`px-4 py-2 rounded-lg ${theme.secondary} ${theme.secondaryText} hover:opacity-80 transition-opacity`}
                    >
                        Clear Chat
                    </button>
                </div>
                <p className={`mb-4 opacity-80 ${theme.text}`}>
                    This tool offers preliminary insights and is not a substitute for professional medical advice.
                </p>
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 border border-red-300">
                        {error}
                    </div>
                )}
                <SymptomChecker
                    messages={messages}
                    input={input}
                    isLoading={isLoading}
                    theme={theme}
                    onInputChange={(e) => setInput(e.target.value)}
                    onSendMessage={handleSendMessage}
                />
            </GlassCard>
        </div>
    );
};

export default SymptomCheckerPage;