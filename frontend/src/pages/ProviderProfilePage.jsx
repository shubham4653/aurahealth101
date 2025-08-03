import React, { useContext } from 'react';
import { Settings, Award, GraduationCap, FileText } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

const ProviderProfilePage = ({ user }) => {
    const { theme } = useContext(ThemeContext);
    
    // Safely handle qualifications whether they are an array or a comma-separated string
    const qualificationsArray = Array.isArray(user.qualifications) 
    ? user.qualifications 
    : (user.qualifications || '').split(',').map(q => q.trim()).filter(Boolean);

    return (
        <div className="p-6">
            <GlassCard>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex items-center gap-6">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} flex items-center justify-center text-5xl font-bold ${theme.primaryText}`}>
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className={`text-4xl font-bold ${theme.text}`}>{user.name}</h1>
                            <p className={`text-lg opacity-80 ${theme.text}`}>{user.id}</p>
                        </div>
                    </div>
                    <AnimatedButton icon={Settings}>Edit Profile</AnimatedButton>
                </div>
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <GlassCard>
                        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}>
                            <Award /> Specialization
                        </h3>
                        <p className={theme.text}>{user.specialty}</p>
                    </GlassCard>
                    <GlassCard>
                        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}>
                            <GraduationCap /> Qualifications
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {qualificationsArray.map(q => (
                                <span key={q} className={`px-3 py-1 text-sm rounded-full ${theme.secondary} ${theme.secondaryText}`}>
                                    {q}
                                </span>
                            ))}
                        </div>
                    </GlassCard>
                    <GlassCard>
                        <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}>
                            <FileText /> License
                        </h3>
                        <p className={theme.text}>{user.licenseNumber}</p>
                    </GlassCard>
                </div>
            </GlassCard>
        </div>
    );
};

export default ProviderProfilePage;