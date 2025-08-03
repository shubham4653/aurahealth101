import React, { useState, useContext } from 'react';
import { BrainCircuit, SlidersHorizontal } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

const AuthPage = ({ onLogin, onSignUp }) => {
    const { theme } = useContext(ThemeContext);
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState('patient');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            onLogin(userType);
        } else {
            onSignUp(userType, fullName, email);
        }
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 ${theme.bg}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} opacity-20 animate-gradient-x`}></div>
            <button onClick={() => onLogin('admin')} className="absolute top-4 right-4 p-2 rounded-full bg-slate-700/50 text-slate-400 hover:bg-slate-600/70 transition-colors z-20"><SlidersHorizontal size={20} /></button>
            <GlassCard className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <BrainCircuit className={`w-16 h-16 mx-auto text-blue-400`} />
                    <h1 className={`text-4xl font-bold mt-4 ${theme.text}`}>AuraHealth</h1>
                    <p className={`mt-2 opacity-80 ${theme.text}`}>{isLogin ? 'Your Health, Your Data, Your Control.' : 'Create your secure health account.'}</p>
                </div>
                <div className={`flex p-1 rounded-full mb-6 ${theme.secondary}`}>
                    <button onClick={() => setUserType('patient')} className={`w-1/2 p-2 rounded-full text-center font-semibold transition-all duration-300 ${userType === 'patient' ? `${theme.primary} ${theme.primaryText}` : `${theme.secondaryText}`}`}>Patient</button>
                    <button onClick={() => setUserType('provider')} className={`w-1/2 p-2 rounded-full text-center font-semibold transition-all duration-300 ${userType === 'provider' ? `${theme.primary} ${theme.primaryText}` : `${theme.secondaryText}`}`}>Provider</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {!isLogin && <input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} className={`w-full p-3 rounded-lg bg-transparent border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.accent} ${theme.text}`} required />}
                        <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className={`w-full p-3 rounded-lg bg-transparent border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.accent} ${theme.text}`} required />
                        <input type="password" placeholder="Password" className={`w-full p-3 rounded-lg bg-transparent border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme.accent} ${theme.text}`} required />
                    </div>
                    <div className="mt-8">
                        <AnimatedButton type="submit" className="w-full">{isLogin ? 'Secure Login' : 'Create Account'}</AnimatedButton>
                    </div>
                </form>
                <p className={`text-center text-sm mt-6 opacity-70 ${theme.text}`}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); }} className="font-bold hover:underline ml-1">{isLogin ? 'Sign Up' : 'Log In'}</a>
                </p>
            </GlassCard>
        </div>
    );
};

export default AuthPage;