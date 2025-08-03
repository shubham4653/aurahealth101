import React, { useState, useContext } from 'react';
import { User, LogOut, Settings, Bell, ChevronDown, BrainCircuit, MessageSquare, CalendarPlus, ListTodo, FileText, Lock, Sparkles } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import AnimatedButton from '../ui/AnimatedButton';
import ThemeSwitcher from '../ui/ThemeSwitcher';

const Header = ({ user, onLogout, onNavigate }) => {
    const { theme } = useContext(ThemeContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header className={`p-4 flex justify-between items-center sticky top-0 z-40 ${theme.glass}`}>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
                <BrainCircuit className={`w-8 h-8 text-blue-400`} />
                <h1 className={`text-xl font-bold tracking-tighter ${theme.text}`}>AuraHealth</h1>
            </div>
            <div className="flex items-center gap-4">
                {user.type !== 'admin' && <AnimatedButton onClick={() => onNavigate('symptom-checker')} icon={MessageSquare} className="px-4 py-2 text-sm">Symptom Checker</AnimatedButton>}
                <ThemeSwitcher />
                <button className={`p-2 rounded-lg transition-colors duration-300 ${theme.secondary} ${theme.secondaryText} hover:bg-opacity-80`}><Bell size={20} /></button>
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-300 ${theme.secondary} ${theme.secondaryText} hover:bg-opacity-80`}>
                        <User size={20} />
                        <span className="hidden sm:inline font-medium">{user.name}</span>
                        <ChevronDown size={16} className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {dropdownOpen && (
                        <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl py-1 ${theme.secondary} ${theme.accent} border z-50`}>
                             {user.type !== 'admin' && <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('profile'); setDropdownOpen(false);}} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}><Settings size={16}/> Profile</a>}
                             {user.type === 'patient' && (
                                 <>
                                     <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('appointments'); setDropdownOpen(false);}} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}><CalendarPlus size={16}/> Appointments</a>
                                     <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('care-plan'); setDropdownOpen(false);}} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}><ListTodo size={16}/> Care Plan</a>
                                     <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('my-records'); setDropdownOpen(false);}} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}><FileText size={16}/> My Records</a>
                                     <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('permissions'); setDropdownOpen(false);}} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}><Lock size={16}/> Permissions</a>
                                 </>
                             )}
                             {user.type !== 'admin' && <a href="#" onClick={(e) => {e.preventDefault(); onNavigate('analyzer'); setDropdownOpen(false);}} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}><Sparkles size={16}/> AI Tools</a>}
                            <a href="#" onClick={onLogout} className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-200 ${theme.secondaryText} hover:bg-opacity-20 hover:bg-slate-700`}><LogOut size={16}/> Logout</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;