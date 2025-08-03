import React, { useState, useContext } from 'react';
import { Palette } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const ThemeSwitcher = () => {
  const { theme, setTheme, themes } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className={`p-2 rounded-lg transition-colors duration-300 ${theme.secondary} ${theme.secondaryText} hover:bg-opacity-80`}><Palette size={20} /></button>
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-40 rounded-lg shadow-xl py-1 ${theme.secondary} ${theme.accent} border z-50`}>
          {Object.values(themes).map((t) => (
            <a key={t.name} href="#" onClick={(e) => { e.preventDefault(); setTheme(t); setIsOpen(false); }} className={`block px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}>{t.name}</a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;