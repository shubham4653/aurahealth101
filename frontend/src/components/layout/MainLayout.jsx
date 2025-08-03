import React from 'react';
import Header from './Header';

const MainLayout = ({ user, onLogout, onNavigate, children }) => {
    return (
        <div className="min-h-screen w-full">
            <Header user={user} onLogout={onLogout} onNavigate={onNavigate} />
            <main>{children}</main>
        </div>
    );
};

export default MainLayout;