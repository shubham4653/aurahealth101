import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const GlassCard = ({ children, className = '' }) => {
  const { theme } = useContext(ThemeContext);
  return <div className={`border rounded-2xl p-4 sm:p-6 transition-all duration-300 ${theme.glass} ${className}`}>{children}</div>;
};

export default GlassCard;