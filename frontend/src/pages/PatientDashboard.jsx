import React, { useContext, useState } from 'react';
import { Heart, Activity, Droplets, Footprints, Sparkles, Loader2, X, Calendar, Upload, MessageCircle, FileText } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import ThemeSwitcher from '../components/ui/ThemeSwitcher';
import { generateWellnessPlan } from '../api/gemini';


// Enhanced VitalSignCard with better styling and animations - Mobile Optimized
const VitalSignCard = ({ icon: Icon, label, value, unit, colorClass }) => {
    const { theme } = useContext(ThemeContext);
    
    return (
        <GlassCard className="group hover:scale-105 transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-3 sm:gap-4">
                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${colorClass} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-medium opacity-80 ${theme.text} mb-1 truncate`}>{label}</p>
                    <p className={`text-xl sm:text-2xl font-bold ${theme.text} group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300`}>
                        {value || '--'} 
                        <span className={`text-sm sm:text-base font-normal opacity-70 ${theme.text}`}>{unit}</span>
                    </p>
                    </div>
            </div>
        </GlassCard>
    );
};

    

const AIWellnessCoach = ({ user, theme, onNavigate }) => {
    const [showModal, setShowModal] = useState(false);
    const [wellnessPlan, setWellnessPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const getPlan = async () => {
        setIsLoading(true);
        setError('');
        setWellnessPlan(null);
        setShowModal(true);
        
        const healthDataSummary = `Latest Vitals: ${JSON.stringify(user.analytics.vitals)}. Last 6 Months Trends: ${JSON.stringify(user.analytics.monthlyData)}.`;
        const prompt = `Based on the following health data, generate a personalized wellness plan. The user's data shows some trends towards high blood sugar and cholesterol. Provide actionable, simple advice. Return a JSON object with three keys: 'dietarySuggestions', 'exerciseRecommendations', and 'generalAdvice'. Each key should contain an array of short, clear strings.`;
        
        try {
            const plan = await generateWellnessPlan(healthDataSummary, prompt);
            setWellnessPlan(plan);
        } catch (err) {
            console.error("Gemini API Error:", err);
            setError("Failed to generate wellness plan. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const openSymptomChecker = () => {
        if (onNavigate) {
            onNavigate('symptom-checker');
        }
    };

    return (
        <>
            <GlassCard className="text-center group hover:scale-105 transition-all duration-300 ease-in-out">
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-2xl font-bold ${theme.text}`}>AI Wellness Coach</h3>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
                
                <div className="mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <p className={`opacity-80 ${theme.text} mb-6`}>
                        Get personalized health insights and wellness recommendations.
                    </p>
                </div>
                
                <div className="space-y-3">
                    <AnimatedButton onClick={getPlan} icon={Sparkles} className="w-full">
                        ✨ Get Wellness Plan
                    </AnimatedButton>
                    <AnimatedButton onClick={openSymptomChecker} icon={Activity} className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                        🔍 AI Symptom Checker
                    </AnimatedButton>
                </div>
        </GlassCard>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className={`text-2xl font-bold ${theme.text}`}>Your AI Wellness Plan</h2>
                            <button 
                                onClick={() => setShowModal(false)} 
                                className={`p-2 rounded-lg ${theme.secondary} hover:opacity-80 transition-opacity`}
                            >
                                <X size={20} />
                            </button>
            </div>
            
                        {isLoading && (
                            <div className="flex justify-center items-center h-48">
                                <div className="text-center">
                                    <Loader2 className={`w-12 h-12 animate-spin ${theme.text} mx-auto mb-4`} />
                                    <p className={`${theme.text} opacity-70`}>Generating your personalized plan...</p>
                                </div>
                            </div>
                        )}
                        
                        {error && (
                            <div className="text-center py-8">
                                <p className="text-red-500">{error}</p>
                    </div>
                )}

                        {wellnessPlan && (
                            <div className={`space-y-6 max-h-[60vh] overflow-y-auto pr-2 ${theme.text}`}>
                                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                                    <h4 className={`font-bold text-lg mb-3 flex items-center gap-2 ${theme.text}`}>
                                        <span className="text-green-500">🥗</span> Dietary Suggestions
                                    </h4>
                                    <ul className={`space-y-2 text-sm ${theme.text}`}>
                                        {wellnessPlan.dietarySuggestions.map((item, i) => (
                                            <li key={`diet-${i}`} className="flex items-start gap-2">
                                                <span className="text-green-500 mt-1">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                            </div>
                                
                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                                    <h4 className={`font-bold text-lg mb-3 flex items-center gap-2 ${theme.text}`}>
                                        <span className="text-blue-500">🏃‍♂️</span> Exercise Recommendations
                                    </h4>
                                    <ul className={`space-y-2 text-sm ${theme.text}`}>
                                        {wellnessPlan.exerciseRecommendations.map((item, i) => (
                                            <li key={`exer-${i}`} className="flex items-start gap-2">
                                                <span className="text-blue-500 mt-1">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                        </div>
                                
                                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                                    <h4 className={`font-bold text-lg mb-3 flex items-center gap-2 ${theme.text}`}>
                                        <span className="text-purple-500">💡</span> General Advice
                                    </h4>
                                    <ul className={`space-y-2 text-sm ${theme.text}`}>
                                        {wellnessPlan.generalAdvice.map((item, i) => (
                                            <li key={`adv-${i}`} className="flex items-start gap-2">
                                                <span className="text-purple-500 mt-1">•</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                </div>
            </div>
                        )}

                    </GlassCard>
                </div>
            )}
        </>
    );
};

// Enhanced Quick Action Center Component - Mobile Optimized
const QuickActionCenter = ({ onNavigate, theme }) => {
    const actions = [
        { 
            icon: Calendar, 
            label: 'Schedule Appointment', 
            color: 'bg-gradient-to-br from-blue-500 to-blue-600', 
            action: () => onNavigate('appointments'),
            description: 'Book your next visit'
        },
        { 
            icon: Upload, 
            label: 'Upload Record', 
            color: 'bg-gradient-to-br from-green-500 to-green-600', 
            action: () => onNavigate('upload-record'),
            description: 'Add medical documents'
        },
        { 
            icon: MessageCircle, 
            label: 'Chat with Doctor', 
            color: 'bg-gradient-to-br from-purple-500 to-purple-600', 
            action: () => onNavigate('chat'),
            description: 'Get instant support'
        },
        { 
            icon: FileText, 
            label: 'My Records', 
            color: 'bg-gradient-to-br from-teal-500 to-teal-600', 
            action: () => onNavigate('my-records'),
            description: 'View all records'
        }
    ];

    return (
        <GlassCard>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className={`text-xl sm:text-2xl font-bold ${theme.text}`}>Quick Actions</h3>
                <div className={`w-2 h-2 bg-green-500 rounded-full animate-pulse`}></div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.action}
                        className={`p-3 sm:p-4 rounded-xl ${theme.secondary} hover:scale-105 transition-all duration-300 ease-in-out flex flex-col items-center gap-2 sm:gap-3 group border border-transparent hover:border-blue-200 dark:hover:border-blue-800`}
                    >
                        <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${action.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                            <action.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                            </div>
                        <div className="text-center">
                            <span className={`text-xs sm:text-sm font-semibold ${theme.text} block mb-1`}>{action.label}</span>
                            <span className={`text-xs opacity-70 ${theme.text} hidden sm:block`}>{action.description}</span>
                                        </div>
                    </button>
                ))}
            </div>
        </GlassCard>
    );
};





const PatientDashboard = ({ user, isViewOnly=false, onNavigate }) => {
    const { theme } = useContext(ThemeContext);
    const analytics = user?.analytics || {};
    const vitals = analytics?.vitals || {};

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
                {/* Header Section */}
            {!isViewOnly && (
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                                <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                                    Welcome back, {user.name.split(' ')[0]}!
                                </h1>
                                <p className={`mt-2 text-base sm:text-lg opacity-80 ${theme.text}`}>
                                    Here's your comprehensive health overview
                                </p>
                            </div>
                            <div className="mt-4 sm:mt-0 flex items-center gap-3">
                                <ThemeSwitcher />
                                <div className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full ${theme.secondary} ${theme.text}`}>
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                    <span className="text-xs sm:text-sm font-medium">All systems normal</span>
                                </div>
                            </div>
                        </div>
                </div>
            )}
            
                {/* Top Section: Quick Actions & AI Wellness Coach */}
            {!isViewOnly && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="lg:col-span-2">
                        <QuickActionCenter onNavigate={onNavigate} theme={theme} />
                    </div>
                        <div className="lg:col-span-1">
                            <AIWellnessCoach user={user} theme={theme} onNavigate={onNavigate} />
                        </div>
                </div>
            )}

                {/* Vital Signs Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                        <h2 className={`text-xl sm:text-2xl font-bold ${theme.text}`}>Vital Signs</h2>
                        <div className={`text-xs sm:text-sm ${theme.text} opacity-70 mt-1 sm:mt-0`}>
                            Last updated: {new Date().toLocaleTimeString()}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <VitalSignCard 
                            icon={Heart} 
                            label="Heart Rate" 
                            value={vitals.heartRate} 
                            unit="bpm" 
                            colorClass="bg-gradient-to-br from-red-500 to-pink-500" 
                        />
                        <VitalSignCard 
                            icon={Activity} 
                            label="Blood Pressure" 
                            value={vitals.bloodPressure} 
                            unit="mmHg" 
                            colorClass="bg-gradient-to-br from-blue-500 to-cyan-500" 
                        />
                        <VitalSignCard 
                            icon={Droplets} 
                            label="Blood Sugar" 
                            value={vitals.bloodSugar} 
                            unit="mg/dL" 
                            colorClass="bg-gradient-to-br from-yellow-500 to-orange-500" 
                        />
                        <VitalSignCard 
                            icon={Footprints} 
                            label="Steps Today" 
                            value={vitals.steps?.toLocaleString()} 
                            unit="steps" 
                            colorClass="bg-gradient-to-br from-green-500 to-emerald-500" 
                        />
                </div>
            </div>


            </div>
        </div>
    );
};

export default PatientDashboard;

