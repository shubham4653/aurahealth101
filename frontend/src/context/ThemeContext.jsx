import React, { createContext, useState } from 'react';

export const themes = {
  prestige: { name: 'Prestige', bg: 'bg-slate-900', text: 'text-slate-100', primary: 'bg-blue-600', primaryText: 'text-white', secondary: 'bg-slate-800', secondaryText: 'text-slate-100', accent: 'border-blue-500', gradientFrom: 'from-blue-600', gradientTo: 'to-indigo-500', glass: 'bg-slate-800/50 backdrop-blur-xl border-slate-700/50', chartColor1: '#3b82f6', chartColor2: '#818cf8' },
  synthwave: { name: 'Synthwave', bg: 'bg-gray-900', text: 'text-cyan-300', primary: 'bg-pink-500', primaryText: 'text-white', secondary: 'bg-cyan-400', secondaryText: 'text-gray-900', accent: 'border-pink-500', gradientFrom: 'from-pink-500', gradientTo: 'to-cyan-400', glass: 'bg-black/30 backdrop-blur-xl border-pink-500/50', chartColor1: '#ec4899', chartColor2: '#22d3ee' },
  minty: { name: 'Minty', bg: 'bg-emerald-50', text: 'text-emerald-800', primary: 'bg-emerald-500', primaryText: 'text-white', secondary: 'bg-white', secondaryText: 'text-emerald-800', accent: 'border-emerald-500', gradientFrom: 'from-emerald-400', gradientTo: 'to-green-500', glass: 'bg-white/50 backdrop-blur-xl border-emerald-300/50', chartColor1: '#10b981', chartColor2: '#22c55e' },
  peach: { name: 'Peach', bg: 'bg-orange-50', text: 'text-orange-800', primary: 'bg-orange-500', primaryText: 'text-white', secondary: 'bg-white', secondaryText: 'text-orange-800', accent: 'border-orange-500', gradientFrom: 'from-red-400', gradientTo: 'to-orange-400', glass: 'bg-white/60 backdrop-blur-xl border-orange-300/50', chartColor1: '#f87171', chartColor2: '#fb923c' },
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(themes.prestige);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, themes }}>
            {children}
        </ThemeContext.Provider>
    );
};