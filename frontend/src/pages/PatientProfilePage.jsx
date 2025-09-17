import React, { useContext, useState, useEffect } from 'react';

import { User, Stethoscope, AlertTriangle, Settings, Download, Save, X, Calendar, Phone, Droplets, Mail, Home, Users, Heart } from 'lucide-react';

import { ThemeContext } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';

import AnimatedButton from '../components/ui/AnimatedButton';
import FormInput from '../components/ui/FormInput';
import { updatePatientProfile } from '../api/auth';

const PatientProfilePage = ({ user, onUpdatePatientData, isViewOnly = false }) => {
    const { theme } = useContext(ThemeContext);
    if (!user) {
        return <div className={`text-center p-6 ${theme.text}`}>Loading patient profile...</div>;
    }
    const [isEditing, setIsEditing] = useState(false);
    // Ensure nested objects are properly initialized
    const [formData, setFormData] = useState({ 
        ...user,
        age: user.age || '',
        emergencyContact: user.emergencyContact || { name: '', relation: '', phone: '' }
    });


    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // When the user prop updates (e.g., after a refetch), sync it to the form data
        setFormData({
            ...user,
            age: user.age || '',
            emergencyContact: user.emergencyContact || { name: '', relation: '', phone: '' }
        });
    }, [user]);



    const handleEdit = () => {

        setIsEditing(true);
        setSuccess('');
        setError('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({ // Reset changes
            ...user,
            emergencyContact: user.emergencyContact || { name: '', relation: '', phone: '' }
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'phone' || name === 'emergencyContact.phone') {
            processedValue = value.replace(/\D/g, '');
        }

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: processedValue
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: processedValue
            }));
        }
    };


    const handleSave = async () => {
        setError('');
        setSuccess('');
        
        const dataToSave = {
            ...formData,
            // Convert comma-separated strings to arrays if they are strings
            allergies: typeof formData.allergies === 'string' 
                ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean) 
                : formData.allergies,
            chronicConditions: typeof formData.chronicConditions === 'string' 
                ? formData.chronicConditions.split(',').map(s => s.trim()).filter(Boolean) 
                : formData.chronicConditions,
        };
        
        if (dataToSave.phone) {
            // The 'contact' field in the backend model expects a Number.
            // Since handleChange already sanitizes it to be a string of digits, we can parse it.
            const numericPhone = parseInt(dataToSave.phone, 10);
            if (!isNaN(numericPhone)) {
                dataToSave.phone = numericPhone;
            } else {
                // Handle cases where the phone number might be an empty string or otherwise invalid
                delete dataToSave.phone;
            }
        }
        if (dataToSave.emergencyContact?.phone) {
            dataToSave.emergencyContact.phone = String(dataToSave.emergencyContact.phone).replace(/\D/g, '');
        }


        try {

            const result = await updatePatientProfile(dataToSave);

            setSuccess(result.message || "Profile updated successfully!");

            
            if (onUpdatePatientData) {
                await onUpdatePatientData(); // This now triggers a refetch in the parent component
            }

            setIsEditing(false);
        } catch (err) {
            setError(err.message || 'An error occurred while updating the profile.');
        }

    };

    const handleDownloadPdf = () => {

        // This requires the jspdf script to be loaded, which is handled in App.jsx
        if (window.jspdf) {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(22); doc.text("AuraHealth Patient Profile", 14, 22);
            doc.setFontSize(16); doc.text(`Patient: ${user.name}`, 14, 32);
            doc.setFontSize(12); doc.text(`ID: ${(user._id || user.id || '').slice(-10).toUpperCase()}`, 14, 38);
            let y = 50;
            doc.setFontSize(14); doc.text("Personal Details", 14, y); y += 7;
            doc.setFontSize(11); doc.text(`- Age: ${user.age || 'N/A'}`, 16, y); y+=6; doc.text(`- Gender: ${user.gender || 'N/A'}`, 16, y); y+=6; doc.text(`- Blood Group: ${user.bloodGroup || 'N/A'}`, 16, y); y+=6; doc.text(`- Contact: ${user.email} | ${user.phone?.replace(/\D/g, '') || 'N/A'}`, 16, y); y+=10;

            doc.setFontSize(14); doc.text("Health Conditions", 14, y); y += 7;
            doc.setFontSize(11); doc.text(`- Allergies: ${user.allergies?.join(', ') || 'None listed'}`, 16, y); y+=6; doc.text(`- Chronic Conditions: ${user.chronicConditions?.join(', ') || 'None listed'}`, 16, y); y+=10;
            doc.setFontSize(14); doc.text("Emergency Contact", 14, y); y += 7;
            doc.setFontSize(11); doc.text(`- Name: ${user.emergencyContact?.name || 'N/A'}`, 16, y); y+=6; doc.text(`- Relation: ${user.emergencyContact?.relation || 'N/A'}`, 16, y); y+=6; doc.text(`- Phone: ${user.emergencyContact?.phone?.replace(/\D/g, '') || 'N/A'}`, 16, y);

            doc.save(`${user.name}_AuraHealth_Profile.pdf`);
        } else {
            alert("PDF generation library is not loaded yet. Please try again in a moment.");
        }
    };

    const allergiesArray = Array.isArray(user.allergies)
        ? user.allergies
        : (typeof user.allergies === 'string' && user.allergies)
            ? user.allergies.split(',').map(q => q.trim()).filter(Boolean)
            : []; // Default to empty array if not string or array

    const conditionsArray = Array.isArray(user.chronicConditions)
        ? user.chronicConditions
        : (typeof user.chronicConditions === 'string' && user.chronicConditions)
            ? user.chronicConditions.split(',').map(q => q.trim()).filter(Boolean)
            : []; // Default to empty array if not string or array

    const patientIdDisplay = (user._id || user.id || '').slice(-10).toUpperCase();

    return (

        <div className="p-6">
            <GlassCard>
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex items-center gap-6">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientTo} flex items-center justify-center text-5xl font-bold ${theme.primaryText}`}>{user.name.charAt(0)}</div>
                        <div><h1 className={`text-4xl font-bold ${theme.text}`}>{isEditing ? formData.name : user.name}</h1><p className={`text-lg opacity-80 ${theme.text}`}>PID: {patientIdDisplay}</p></div>

                    </div>
                    {!isViewOnly && (
                        <div className="flex gap-2">
                            {isEditing ? (
                                <>
                                    <AnimatedButton onClick={handleSave} icon={Save} className="bg-green-500 hover:bg-green-600">Save</AnimatedButton>
                                    <AnimatedButton onClick={handleCancel} icon={X} className="bg-gray-500 hover:bg-gray-600">Cancel</AnimatedButton>
                                </>
                            ) : (
                                <>
                                    <AnimatedButton onClick={handleEdit} icon={Settings}>Edit Profile</AnimatedButton>
                                    <AnimatedButton onClick={handleDownloadPdf} icon={Download}>Download PDF</AnimatedButton>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {success && <div className="mt-4 text-green-500 bg-green-100 border border-green-500 p-3 rounded-lg">{success}</div>}
                {error && <div className="mt-4 text-red-500 bg-red-100 border border-red-500 p-3 rounded-lg">{error}</div>}

                {isEditing ? (
                    <div className="mt-8 space-y-6">
                        <GlassCard>
                            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><User /> Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput placeholder="Full Name" icon={User} name="name" value={formData.name || ''} onChange={handleChange} theme={theme} />
                                <FormInput placeholder="Age" icon={Calendar} name="age" type="number" value={formData.age || ''} onChange={handleChange} theme={theme} />
                                <FormInput placeholder="Phone" icon={Phone} name="phone" value={(formData.phone || '').replace(/\D/g, '')} onChange={handleChange} theme={theme} />

                                <FormInput icon={Users} theme={theme}>
                                    <select name="gender" value={formData.gender || ''} onChange={handleChange} className={`w-full p-3 pl-10 rounded-lg ${theme.bg} border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </FormInput>


                                <FormInput icon={Droplets} theme={theme}>
                                    <select name="bloodGroup" value={formData.bloodGroup || ''} onChange={handleChange} className={`w-full p-3 pl-10 rounded-lg ${theme.bg} border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                                        <option value="">Select Blood Group</option>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                </FormInput>



                                <FormInput icon={Mail} theme={theme}>
                                    <input placeholder="Email" name="email" value={formData.email || ''} readOnly disabled className={`w-full p-3 pl-10 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500 opacity-60`} />
                                </FormInput>
                                <div className="md:col-span-2">
                                    <FormInput placeholder="Address" icon={Home} name="address" value={formData.address || ''} onChange={handleChange} theme={theme} />
                                </div>
                            </div>
                        </GlassCard>
                         <GlassCard>
                            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><Stethoscope /> Health Conditions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput placeholder="Allergies (comma-separated)" icon={Heart} name="allergies" value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : (formData.allergies || '')} onChange={handleChange} theme={theme} />
                                <FormInput placeholder="Chronic Conditions (comma-separated)" icon={Stethoscope} name="chronicConditions" value={Array.isArray(formData.chronicConditions) ? formData.chronicConditions.join(', ') : (formData.chronicConditions || '')} onChange={handleChange} theme={theme} />
                            </div>
                        </GlassCard>
                        <GlassCard>
                            <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><AlertTriangle /> Emergency Contact</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormInput placeholder="Contact Name" icon={User} name="emergencyContact.name" value={formData.emergencyContact.name || ''} onChange={handleChange} theme={theme} />
                                <FormInput placeholder="Relation" icon={Users} name="emergencyContact.relation" value={formData.emergencyContact.relation || ''} onChange={handleChange} theme={theme} />
                                <FormInput placeholder="Contact Phone" icon={Phone} name="emergencyContact.phone" value={(formData.emergencyContact.phone || '').replace(/\D/g, '')} onChange={handleChange} theme={theme} />

                            </div>
                        </GlassCard>
                    </div>
                ) : (

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <GlassCard><h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><User /> Personal Details</h3><div className={`space-y-3 ${theme.text}`}><p><strong className="opacity-70">Age:</strong> {user.age || 'N/A'}</p><p><strong className="opacity-70">Gender:</strong> {user.gender || 'N/A'}</p><p><strong className="opacity-70">Blood Group:</strong> {user.bloodGroup || 'N/A'}</p><p><strong className="opacity-70">Email:</strong> {user.email}</p><p><strong className="opacity-70">Phone:</strong> {user.phone?.replace(/\D/g, '') || 'N/A'}</p></div></GlassCard>
                        <GlassCard><h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><Stethoscope /> Health Conditions</h3><div className={`space-y-3 ${theme.text}`}><p><strong className="opacity-70">Allergies:</strong></p><div className="flex flex-wrap gap-2">{allergiesArray.map(allergy => <span key={allergy} className={`px-3 py-1 text-sm rounded-full ${theme.primary} ${theme.primaryText}`}>{allergy}</span>) }</div><p className="mt-2"><strong className="opacity-70">Chronic Conditions:</strong></p><div className="flex flex-wrap gap-2">{conditionsArray.map(cond => <span key={cond} className={`px-3 py-1 text-sm rounded-full ${theme.secondary} ${theme.secondaryText}`}>{cond}</span>)}</div></div></GlassCard>

                        <GlassCard><h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${theme.text}`}><AlertTriangle /> Emergency Contact</h3><div className={`space-y-3 ${theme.text}`}><p><strong className="opacity-70">Name:</strong> {user.emergencyContact?.name || 'N/A'}</p><p><strong className="opacity-70">Relation:</strong> {user.emergencyContact?.relation || 'N/A'}</p><p><strong className="opacity-70">Phone:</strong> {user.emergencyContact?.phone?.replace(/\D/g, '') || 'N/A'}</p></div></GlassCard>
                    </div>

                )}
            </GlassCard>
        </div>
    );
};


export default PatientProfilePage;
