import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import Sidebar from './Sidebar';

const MainLayout = ({ user, onLogout, onNavigate, children, currentView }) => {
    const { theme } = useContext(ThemeContext);
    
    return (
        <div className={`min-h-screen w-full ${theme.bg}`}>
            <Sidebar 
                user={user} 
                onLogout={onLogout} 
                onNavigate={onNavigate} 
                currentView={currentView}
            />
            <main className="ml-0 md:ml-64 min-h-screen overflow-auto">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;