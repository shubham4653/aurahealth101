import React, { useState, useContext } from 'react';
import { MessageSquare } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { getSymptomResponse } from '../api/gemini.js';
import GlassCard from '../components/ui/GlassCard.jsx';
import SymptomChecker from '../components/features/SymptomChecker.jsx';

const SymptomCheckerPage = () => {
    const { theme } = useContext(ThemeContext);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: "Hello! I'm your AI Symptom Checker. Please describe your main symptom to get started (e.g., 'I have a sore throat')." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

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
            const errorResponse = { sender: 'ai', text: "Sorry, I encountered an error. Please try again later." };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <GlassCard className="h-[80vh] flex flex-col">
                <h1 className={`text-3xl font-bold mb-2 flex items-center gap-3 ${theme.text}`}>
                    <MessageSquare /> AI Symptom Checker
                </h1>
                <p className={`mb-4 opacity-80 ${theme.text}`}>
                    This tool offers preliminary insights and is not a substitute for professional medical advice.
                </p>
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