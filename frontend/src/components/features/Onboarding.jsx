import React, { useState } from 'react';
import { Cake, VenetianMask, TestTube, Pill, Stethoscope, CheckCircle, FileText, Award, GraduationCap, Calendar } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import FormInput from '../ui/FormInput';
import AnimatedButton from '../ui/AnimatedButton';

export const PatientOnboardingForm = ({ user, onComplete, theme }) => {
    const [formData, setFormData] = useState({ dob: '', gender: '', bloodGroup: '', allergies: '', chronicConditions: '' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onComplete({ ...user, ...formData });
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${theme.bg}`}>
            <GlassCard className="w-full max-w-lg">
                <h1 className={`text-3xl font-bold text-center mb-2 ${theme.text}`}>Complete Your Profile</h1>
                <p className={`text-center opacity-70 mb-6 ${theme.text}`}>Please provide some essential health information to get started.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput icon={Cake} type="date" name="dob" value={formData.dob} onChange={handleChange} theme={theme} />
                        <FormInput icon={VenetianMask} theme={theme} name="gender">
                             <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full p-3 pl-10 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                 <option value="" className={`${theme.bg} opacity-50`}>Select Gender...</option>
                                 <option value="Male" className={`${theme.bg}`}>Male</option>
                                 <option value="Female" className={`${theme.bg}`}>Female</option>
                                 <option value="Other" className={`${theme.bg}`}>Other</option>
                             </select>
                        </FormInput>
                    </div>
                    <FormInput icon={TestTube} theme={theme} name="bloodGroup">
                        <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={`w-full p-3 pl-10 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                            <option value="" className={`${theme.bg} opacity-50`}>Select Blood Group...</option>
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg} className={`${theme.bg}`}>{bg}</option>)}
                        </select>
                    </FormInput>
                    <FormInput icon={Pill} type="text" placeholder="Known Allergies (comma-separated)" name="allergies" value={formData.allergies} onChange={handleChange} theme={theme} />
                    <FormInput icon={Stethoscope} type="text" placeholder="Chronic Conditions (comma-separated)" name="chronicConditions" value={formData.chronicConditions} onChange={handleChange} theme={theme} />

                    <div className="pt-4"><AnimatedButton type="submit" className="w-full" icon={CheckCircle}>Save & Continue</AnimatedButton></div>
                </form>
            </GlassCard>
        </div>
    );
};

export const ProviderOnboardingForm = ({ user, onComplete, theme }) => {
    const [formData, setFormData] = useState({ licenseNumber: '', specialty: '', qualifications: '', yearsOfExperience: '' });
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => {
        e.preventDefault();
        onComplete({ ...user, ...formData });
    };
    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${theme.bg}`}>
            <GlassCard className="w-full max-w-lg">
                <h1 className={`text-3xl font-bold text-center mb-2 ${theme.text}`}>Complete Your Professional Profile</h1>
                <p className={`text-center opacity-70 mb-6 ${theme.text}`}>Please provide your professional credentials.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormInput icon={FileText} type="text" placeholder="Medical License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} theme={theme} />
                    <FormInput icon={Award} type="text" placeholder="Specialization (e.g., Cardiology)" name="specialty" value={formData.specialty} onChange={handleChange} theme={theme} />
                    <FormInput icon={GraduationCap} type="text" placeholder="Qualifications (comma-separated, e.g., MD, FACC)" name="qualifications" value={formData.qualifications} onChange={handleChange} theme={theme} />
                    <FormInput icon={Calendar} type="number" placeholder="Years of Experience" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} theme={theme} />
                    <div className="pt-4"><AnimatedButton type="submit" className="w-full" icon={CheckCircle}>Save & Continue</AnimatedButton></div>
                </form>
            </GlassCard>
        </div>
    );
};