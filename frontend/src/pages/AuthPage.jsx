import React, { useState, useContext } from 'react';
import {SlidersHorizontal } from 'lucide-react';


const ThemeContext = React.createContext({
    theme: {
        bg: 'bg-slate-900',
        text: 'text-slate-100',
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-purple-600',
        secondary: 'bg-slate-800/60',
        primary: 'bg-blue-600',
        primaryText: 'text-white',
        secondaryText: 'text-slate-300',
        accent: 'border-slate-700',
    }
});

// A simple GlassCard component for the effect.
const GlassCard = ({ children, className }) => (
    <div className={`bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8 ${className}`}>
        {children}
    </div>
);

// A simple AnimatedButton component.
const AnimatedButton = ({ children, className, ...props }) => (
    <button
        {...props}
        className={`bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 ${className}`}
    >
        {children}
    </button>
);


const AuthPage = ({ onLogin, onSignUp }) => {
    const { theme } = useContext(ThemeContext);
    const [isLogin, setIsLogin] = useState(true);
    const [userType, setUserType] = useState('patient');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock login/signup functions
        if (isLogin) {
            console.log('Logging in as:', userType, email);
            if(onLogin) onLogin(userType);
        } else {
            console.log('Signing up as:', userType, fullName, email);
            if(onSignUp) onSignUp(userType, fullName, email);
        }
    };

    return (
        // --- Main container with dark background ---
        <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 overflow-hidden relative ${theme.bg}`}>

            {/* --- START: Attractive Background --- */}
            {/* This container holds the animated gradient shapes */}
            <div className="absolute inset-0 w-full h-full z-0">
                {/* Shape 1: A large, blurred circle */}
                <div className="absolute top-[-20%] left-[10%] w-72 h-72 md:w-96 md:h-96 bg-purple-500 rounded-full filter blur-3xl opacity-40 animate-blob"></div>
                {/* Shape 2: Another blurred circle with a different color and position */}
                <div className="absolute bottom-[-10%] right-[5%] w-72 h-72 md:w-96 md:h-96 bg-blue-500 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                 {/* Shape 3: A third shape for more color depth */}
                <div className="absolute bottom-[20%] left-[25%] w-60 h-60 md:w-80 md:h-80 bg-teal-400 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
            {/* We need a style tag to define the custom animation */}
            <style>
                {`
                    @keyframes blob {
                        0% { transform: translate(0px, 0px) scale(1); }
                        33% { transform: translate(30px, -50px) scale(1.1); }
                        66% { transform: translate(-20px, 20px) scale(0.9); }
                        100% { transform: translate(0px, 0px) scale(1); }
                    }
                    .animate-blob {
                        animation: blob 7s infinite;
                    }
                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }
                    .animation-delay-4000 {
                        animation-delay: 4s;
                    }
                `}
            </style>
            {/* --- END: Attractive Background --- */}


            <button onClick={() => console.log('Admin login clicked')} className="absolute top-4 right-4 p-2 rounded-full bg-slate-700/50 text-slate-400 hover:bg-slate-600/70 transition-colors z-20"><SlidersHorizontal size={20} /></button>

            {/* The GlassCard is set to z-10 to appear in front of the background */}
            <GlassCard className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <img src="/aurahealth.png" alt="AuraHealth Logo" className="w-18 h-18 mx-auto" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/72x72/000000/FFFFFF?text=Aura'; }}/>
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
