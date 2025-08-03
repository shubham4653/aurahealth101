import React, { useContext } from 'react';
import { User, Stethoscope, AlertTriangle, Settings, Download } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { calculateAge } from '../utils/helpers';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

const PatientProfilePage = ({ user, isViewOnly = false }) => {
    const { theme } = useContext(ThemeContext);

    const handleDownloadPdf = () => {
        // This requires the jspdf script to be loaded, which is handled in App.jsx
        if (window.jspdf) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(22); doc.text("AuraHealth Patient Profile", 14, 22);
            doc.setFontSize(16); doc.text(`Patient: ${user.name}`, 14, 32);
            doc.setFontSize(12); doc.text(`ID: ${user.id}`, 14, 38);
            let y = 50;
            doc.setFontSize(14); doc.text("Personal Details", 14, y); y += 7;
            doc.setFontSize(11); doc.text(`- Age: ${calculateAge(user.dob)}`, 16, y); y+=6; doc.text(`- Gender: ${user.gender || 'N/A'}`, 16, y); y+=6; doc.text(`- Blood Group: ${user.bloodGroup || 'N/A'}`, 16, y); y+=6; doc.text(`- Contact: ${user.email} | ${user.phone}`, 16, y); y+=10;
            doc.setFontSize(14); doc.text("Health Conditions", 14, y); y += 7;
            doc.setFontSize(11); doc.text(`- Allergies: ${user.allergies?.join(', ') || 'None listed'}`, 16, y); y+=6; doc.text(`- Chronic Conditions: ${user.chronicConditions?.join(', ') || 'None listed'}`, 16, y); y+=10;
            doc.setFontSize(14); doc.text("Emergency Contact", 14, y); y += 7;
            doc.setFontSize(11); doc.text(`- Name: ${user.emergencyContact?.name || 'N/A'}`, 16, y); y+=6; doc.text(`- Relation: ${user.emergencyContact?.relation || 'N/A'}`, 16, y); y+=6; doc.text(`- Phone: ${user.emergencyContact?.phone || 'N/A'}`, 16, y);
            doc.save(`${user.name}_AuraHealth_Profile.pdf`);
        } else {
            alert("PDF generation library is not loaded yet. Please try again in a moment.");
        }
    };

    const allergiesArray = Array.isArray(user.allergies) 
    ? user.allergies 
    : (user.allergies || '').split(',').map(q => q.trim()).filter(Boolean);

    const conditionsArray = Array.isArray(user.chronicConditions)
    ? user.chronicConditions
    : (user.chronicConditions || '').split(',').map(q => q.trim()).filter(Boolean);

    return (
        <div className="p-6">
            <GlassCard>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex items-center gap-6">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} flex items-center justify-center text-5xl font-bold ${theme.primaryText}`}>{user.name.charAt(0)}</div>
                        <div><h1 className={`text-4xl font-bold ${theme.text}`}>{user.name}</h1><p className={`text-lg opacity-80 ${theme.text}`}>{user.id}</p></div>
                    </div>
                    {!isViewOnly && (<div className="flex gap-2"><AnimatedButton icon={Settings}>Edit Profile</AnimatedButton><AnimatedButton onClick={handleDownloadPdf} icon={Download}>Download PDF</AnimatedButton></div>)}
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <GlassCard><h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><User /> Personal Details</h3><div className={`space-y-3 ${theme.text}`}><p><strong className="opacity-70">Age:</strong> {calculateAge(user.dob)}</p><p><strong className="opacity-70">Gender:</strong> {user.gender || 'N/A'}</p><p><strong className="opacity-70">Blood Group:</strong> {user.bloodGroup || 'N/A'}</p><p><strong className="opacity-70">Email:</strong> {user.email}</p><p><strong className="opacity-70">Phone:</strong> {user.phone}</p></div></GlassCard>
                    <GlassCard><h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><Stethoscope /> Health Conditions</h3><div className={`space-y-3 ${theme.text}`}><p><strong className="opacity-70">Allergies:</strong></p><div className="flex flex-wrap gap-2">{allergiesArray.map(allergy => <span key={allergy} className={`px-3 py-1 text-sm rounded-full ${theme.primary} ${theme.primaryText}`}>{allergy}</span>) }</div><p className="mt-2"><strong className="opacity-70">Chronic Conditions:</strong></p><div className="flex flex-wrap gap-2">{conditionsArray.map(cond => <span key={cond} className={`px-3 py-1 text-sm rounded-full ${theme.secondary} ${theme.secondaryText}`}>{cond}</span>)}</div></div></GlassCard>
                    <GlassCard><h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><AlertTriangle /> Emergency Contact</h3><div className={`space-y-3 ${theme.text}`}><p><strong className="opacity-70">Name:</strong> {user.emergencyContact?.name || 'N/A'}</p><p><strong className="opacity-70">Relation:</strong> {user.emergencyContact?.relation || 'N/A'}</p><p><strong className="opacity-70">Phone:</strong> {user.emergencyContact?.phone || 'N/A'}</p></div></GlassCard>
                </div>
            </GlassCard>
        </div>
    );
};

export default PatientProfilePage;