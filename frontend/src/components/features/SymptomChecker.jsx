import React, { useRef, useEffect } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';
import AnimatedButton from '../ui/AnimatedButton.jsx';

const SymptomChecker = ({ messages, input, isLoading, theme, onInputChange, onSendMessage }) => {
    const chatEndRef = useRef(null);

    // Effect to auto-scroll to the latest message
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme.primary} ${theme.primaryText} flex-shrink-0`}>
                                <Sparkles size={16}/>
                            </div>
                        )}
                        <div className={`max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? `${theme.primary} ${theme.primaryText}` : `${theme.secondary} ${theme.secondaryText}`}`}>
                            <p>{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${theme.primary} ${theme.primaryText} flex-shrink-0`}>
                          <Sparkles size={16}/>
                        </div>
                        <div className={`ml-2 max-w-md p-3 rounded-2xl ${theme.secondary} ${theme.secondaryText}`}>
                            <Loader2 className={`w-5 h-5 animate-spin`} />
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={onSendMessage} className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={onInputChange}
                    placeholder="Describe your symptoms..."
                    className={`flex-grow p-3 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text}`}
                    disabled={isLoading}
                />
                <AnimatedButton type="submit" icon={Send} disabled={isLoading || !input.trim()}>
                    Send
                </AnimatedButton>
            </form>
        </>
    );
};

export default SymptomChecker;