import React, { useContext, useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Users, 
    MessageSquare, 
    Calendar, 
    FileText, 
    BarChart3, 
    CreditCard, 
    Settings,
    User,
    LogOut,
    Bell,
    Menu,
    X
} from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ user, onNavigate, currentView, onLogout }) => {
    const { theme } = useContext(ThemeContext);
    const [isMobile, setIsMobile] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Define navigation items based on user type
    const getNavigationItems = () => {
        const baseItems = [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'profile', label: 'Profile', icon: User },
        ];

        if (user?.type === 'patient') {
            return [
                ...baseItems,
                { id: 'appointments', label: 'Appointments', icon: Calendar },
                { id: 'my-records', label: 'Medical Records', icon: FileText },
                { id: 'chat', label: 'Messages', icon: MessageSquare },
                { id: 'care-plan', label: 'Care Plan', icon: FileText },
                { id: 'permissions', label: 'Permissions', icon: Settings },
                { id: 'analyzer', label: 'AI Tools', icon: BarChart3 },
            ];
        } else if (user?.type === 'provider') {
            return [
                ...baseItems,
                { id: 'provider-appointments', label: 'Appointments', icon: Calendar },
                { id: 'chat', label: 'Messages', icon: MessageSquare },
            ];
        } else if (user?.type === 'admin') {
            return [
                ...baseItems,
                { id: 'patients', label: 'Patients', icon: Users },
                { id: 'providers', label: 'Providers', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'billing', label: 'Billing', icon: CreditCard },
                { id: 'settings', label: 'Settings', icon: Settings },
            ];
        }

        return baseItems;
    };

    const navigationItems = getNavigationItems();

    const handleItemClick = (itemId) => {
        if (itemId === 'logout') {
            onLogout();
        } else {
            onNavigate(itemId);
        }
        // Close mobile menu after navigation
        if (isMobile) {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Menu Button */}
            {isMobile && (
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`fixed top-4 left-4 z-50 p-2 rounded-lg ${theme.secondary} ${theme.text} shadow-lg`}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            )}

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                initial={isMobile ? { x: -256 } : { x: 0 }}
                animate={isMobile ? { x: isMobileMenuOpen ? 0 : -256 } : { x: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`${isMobile ? 'w-64' : 'w-64'} h-screen fixed left-0 top-0 ${theme.bg} border-r ${theme.accent} flex flex-col z-30`}
            >
                {/* Logo Section */}
                <div className="p-4 sm:p-6 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                        {/* AURA Logo - Modern circular design */}
                        <div className="w-8 h-8 relative">
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <h1 className={`text-lg sm:text-xl font-bold ${theme.text}`}>Aura Health</h1>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        
                        return (
                            <motion.button
                                key={item.id}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleItemClick(item.id)}
                                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 group relative ${
                                    isActive 
                                        ? `${theme.secondary} border-l-4 border-blue-600 ${theme.text}` 
                                        : `${theme.text} hover:${theme.secondary} hover:bg-opacity-50`
                                }`}
                            >
                                <Icon 
                                    size={18} 
                                    className={`${
                                        isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-200'
                                    }`} 
                                />
                                <span className={`font-medium text-sm sm:text-base ${
                                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-200'
                                }`}>
                                    {item.label}
                                </span>
                                
                                {/* Badge for notifications */}
                                {item.badge && (
                                    <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </motion.button>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="p-3 sm:p-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <User size={16} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${theme.text} truncate`}>{user?.name}</p>
                            <p className={`text-xs ${theme.text} opacity-60 capitalize`}>{user?.type}</p>
                        </div>
                    </div>
                    
                    {/* Logout Button */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleItemClick('logout')}
                        className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 ${theme.text} hover:${theme.secondary} hover:bg-opacity-50`}
                    >
                        <LogOut size={18} className="text-slate-400 group-hover:text-slate-200" />
                        <span className="font-medium text-sm sm:text-base text-slate-400 group-hover:text-slate-200">Logout</span>
                    </motion.button>
                </div>
            </motion.div>
        </>
    );
};

export default Sidebar;
