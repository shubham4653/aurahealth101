import React, { useState, useEffect, useContext } from 'react';
import { Settings, Award, GraduationCap, FileText, Save, X, User, Calendar, Users } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import FormInput from '../components/ui/FormInput';
import { updateProviderProfile } from '../api/auth';

const ProviderProfilePage = ({ user, onUpdateProviderData }) => {
    const { theme } = useContext(ThemeContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ ...user });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setFormData({ ...user });
    }, [user]);

    const handleEdit = () => {
        setIsEditing(true);
        setSuccess('');
        setError('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({ ...user });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setError('');
        setSuccess('');

        const dataToSave = {
            ...formData,
            qualifications: typeof formData.qualifications === 'string'
                ? formData.qualifications.split(',').map(s => s.trim()).filter(Boolean)
                : formData.qualifications,
        };


        try {
            const result = await updateProviderProfile(dataToSave);
            setSuccess(result.message || "Profile updated successfully!");
            if (onUpdateProviderData) {
                await onUpdateProviderData();
            }
            setIsEditing(false);
        } catch (err) {
            setError(err.message || 'An error occurred while updating the profile.');
        }
    };

    if (!user) {
        return <div className={`text-center p-6 ${theme.text}`}>Loading provider profile...</div>;
    }
    
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
                            <h1 className={`text-4xl font-bold ${theme.text}`}>{isEditing ? formData.name : user.name}</h1>
                            <p className={`text-lg opacity-80 ${theme.text}`}>ID: {(user._id || '').slice(-10).toUpperCase()}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <AnimatedButton onClick={handleSave} icon={Save} className="bg-green-500 hover:bg-green-600">Save</AnimatedButton>
                                <AnimatedButton onClick={handleCancel} icon={X} className="bg-gray-500 hover:bg-gray-600">Cancel</AnimatedButton>
                            </>
                        ) : (
                            <AnimatedButton onClick={handleEdit} icon={Settings}>Edit Profile</AnimatedButton>
                        )}
                    </div>
                </div>
                
                {success && <div className="mt-4 text-green-500 bg-green-100 border border-green-500 p-3 rounded-lg">{success}</div>}
                {error && <div className="mt-4 text-red-500 bg-red-100 border border-red-500 p-3 rounded-lg">{error}</div>}

                {isEditing ? (
                    <div className="mt-8 space-y-6">
                        <GlassCard>
                            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><User /> Personal & Professional Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <FormInput placeholder="Full Name" icon={User} name="name" value={formData.name || ''} onChange={handleChange} theme={theme} />
                               <FormInput placeholder="Age" icon={Calendar} name="age" type="number" value={formData.age || ''} onChange={handleChange} theme={theme} />
                               <FormInput icon={Users} theme={theme}>
                                    <select name="gender" value={formData.gender || ''} onChange={handleChange} className={`w-full p-3 pl-10 rounded-lg ${theme.bg} border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </FormInput>
                                <FormInput placeholder="Specialization" icon={Award} name="specialty" value={formData.specialty || ''} onChange={handleChange} theme={theme} />
                                <FormInput placeholder="License Number" icon={FileText} name="licenseNumber" value={formData.licenseNumber || ''} onChange={handleChange} theme={theme} />
                                <FormInput placeholder="Years of Experience" icon={Calendar} name="yearsOfExperience" type="number" value={formData.yearsOfExperience || ''} onChange={handleChange} theme={theme} />
                                <div className="md:col-span-2">
                                     <FormInput placeholder="Qualifications (comma-separated)" icon={GraduationCap} name="qualifications" value={Array.isArray(formData.qualifications) ? formData.qualifications.join(', ') : (formData.qualifications || '')} onChange={handleChange} theme={theme} />
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <GlassCard>
                            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><User /> Personal Details</h3>
                            <div className={`space-y-3 ${theme.text}`}>
                                <p><strong className="opacity-70">Age:</strong> {user.age || 'N/A'}</p>
                                <p><strong className="opacity-70">Gender:</strong> {user.gender || 'N/A'}</p>
                            </div>
                        </GlassCard>
                        <GlassCard>
                            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}>
                                <Award /> Professional Details
                            </h3>
                            <div className={`space-y-3 ${theme.text}`}>
                                <p><strong className="opacity-70">Specialty:</strong> {user.specialty || 'N/A'}</p>
                                <p><strong className="opacity-70">License:</strong> {user.licenseNumber || 'N/A'}</p>
                                <p><strong className="opacity-70">Years of Experience:</strong> {user.yearsOfExperience || 'N/A'}</p>
                            </div>
                        </GlassCard>
                        <GlassCard>
                            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}>
                                <GraduationCap /> Qualifications
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {qualificationsArray.length > 0 ? qualificationsArray.map(q => (
                                    <span key={q} className={`px-3 py-1 text-sm rounded-full ${theme.secondary} ${theme.secondaryText}`}>
                                        {q}
                                    </span>
                                )) : <p className={`opacity-70 ${theme.text}`}>None listed</p>}
                            </div>
                        </GlassCard>
                    </div>
                )}


            </GlassCard>
        </div>
    );
};


export default ProviderProfilePage;

