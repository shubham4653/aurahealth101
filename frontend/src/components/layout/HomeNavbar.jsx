import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Menu, X } from 'lucide-react';

const HomeNavbar = ({ onTryNow }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const handleClickOutside = (event) => {
            if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('click', handleClickOutside);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    const navItems = [
        { name: 'Features', href: '#features' },
        { name: 'Technology', href: '#technology' },
        // { name: 'About', href: '#about' },
        // { name: 'Contact', href: '#contact' }
    ];

    const scrollToSection = (href) => {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg' 
                    : 'bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-3 cursor-pointer"
                    >
                        <div className="w-8 h-8 relative">
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        <h1 className={`text-xl font-bold ${
                            isScrolled 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-white'
                        }`}>
                            Aura Health
                        </h1>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => scrollToSection(item.href)}
                                className={`font-medium transition-colors duration-200 ${
                                    isScrolled 
                                        ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600' 
                                        : 'text-white/90 hover:text-white'
                                }`}
                            >
                                {item.name}
                            </motion.button>
                        ))}
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onTryNow}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Try Now
                        </motion.button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden mobile-menu-container">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`relative p-2 rounded-lg transition-colors duration-200 ${
                                isScrolled 
                                    ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800' 
                                    : 'text-white hover:bg-white/10'
                            }`}
                        >
                            <motion.div
                                animate={isMobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </motion.div>
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            className={`mobile-menu-container md:hidden overflow-hidden ${
                                isScrolled 
                                    ? 'bg-white dark:bg-slate-900 shadow-lg' 
                                    : 'bg-slate-900/95 backdrop-blur-md'
                            } rounded-lg mt-2 border border-white/10`}
                        >
                            <div className="px-4 py-6 space-y-4">
                                {navItems.map((item, index) => (
                                    <motion.button
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => scrollToSection(item.href)}
                                        className={`block w-full text-left font-medium transition-colors duration-200 py-2 ${
                                            isScrolled 
                                                ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600' 
                                                : 'text-white hover:text-blue-400'
                                        }`}
                                    >
                                        {item.name}
                                    </motion.button>
                                ))}
                                
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="pt-4 border-t border-white/10"
                                >
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={onTryNow}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
                                    >
                                        Try Now
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default HomeNavbar;
