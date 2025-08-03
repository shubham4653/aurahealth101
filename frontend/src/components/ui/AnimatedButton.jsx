import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const AnimatedButton = ({ children, onClick, className = '', icon: Icon, disabled = false }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <button onClick={onClick} disabled={disabled} className={`relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-semibold rounded-lg group ${theme.primary} ${theme.primaryText} ${className} disabled:opacity-50 disabled:cursor-not-allowed`}>
      <span className="absolute top-0 left-0 w-full h-full opacity-0 transition-all duration-300 ease-out transform -translate-x-full bg-white group-hover:opacity-20 group-hover:translate-x-0"></span>
      <span className="relative flex items-center gap-2">
        {Icon && <Icon size={20} className={disabled ? "animate-spin" : ""} />}
        {children}
      </span>
    </button>
  );
};

export default AnimatedButton;