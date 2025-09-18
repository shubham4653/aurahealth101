import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import GlassCard from '../ui/GlassCard.jsx';
import AnimatedButton from '../ui/AnimatedButton.jsx';
import { getAllProviders } from '../../api/appointments.js';

// The list of upcoming appointments
export const AppointmentList = ({ appointments = [], theme }) => (
    <GlassCard>
        <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>Upcoming Appointments</h3>
        <div className="space-y-3">
            {appointments.length > 0 ? (
                appointments.map(apt => (
                    <div key={apt.id} className={`p-4 rounded-lg flex items-center justify-between ${theme.secondary}`}>
                        <div>
                            <p className="font-semibold text-lg">{apt.providerName}</p>
                            <p className="text-sm opacity-70">{apt.reason}</p>
                        </div>
                        <div>
                            <p className="font-bold text-lg">{apt.date}</p>
                            <p className="text-sm opacity-70 text-right">{apt.time}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className={`opacity-70 ${theme.text}`}>No upcoming appointments scheduled.</p>
            )}
        </div>
    </GlassCard>
);

// The scheduler modal component
export const AppointmentScheduler = ({ user, theme, onSchedule, onClose }) => {
    const [allProviders, setAllProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [reason, setReason] = useState('');
    const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getAllProviders();
            if (res.success) {
                setAllProviders(res.data);
                if (res.data.length > 0) {
                    setSelectedProvider(res.data[0]._id);
                }
            }
        };
        fetchProviders();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSchedule({
            providerId: selectedProvider,
            date: selectedDate,
            time: selectedTime,
            reason: reason || "Consultation"
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <GlassCard className="w-full max-w-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-2xl font-bold ${theme.text}`}>Schedule Appointment</h2>
                    <button onClick={onClose} className={`p-2 rounded-lg ${theme.secondary} hover:opacity-80`}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields remain the same */}
                    <div>
                        <label className={`block mb-2 font-semibold ${theme.text}`}>Select Provider</label>
                        <select value={selectedProvider} onChange={e => setSelectedProvider(e.target.value)} className={`w-full p-3 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`}>
                            <option value="" disabled className={`${theme.bg}`}>Select a provider</option>
                            {allProviders.map(p => <option key={p._id} value={p._id} className={`${theme.bg}`}>{p.name} - {p.specialty || 'General Practice'}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={`block mb-2 font-semibold ${theme.text}`}>Select Date</label>
                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className={`w-full p-3 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                    </div>
                     <div>
                        <label className={`block mb-2 font-semibold ${theme.text}`}>Reason for Visit</label>
                        <input type="text" placeholder="e.g., Annual Checkup" value={reason} onChange={e => setReason(e.target.value)} className={`w-full p-3 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`} />
                    </div>
                    <div>
                        <label className={`block mb-2 font-semibold ${theme.text}`}>Select Time</label>
                        <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map(time => (
                                <button key={time} type="button" onClick={() => setSelectedTime(time)} className={`p-2 rounded-lg text-center font-semibold transition-colors duration-200 ${selectedTime === time ? `${theme.primary} ${theme.primaryText}` : `${theme.secondary} ${theme.secondaryText}`}`}>
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="text-right pt-4">
                        <AnimatedButton type="submit" disabled={!selectedProvider || !selectedDate || !selectedTime}>
                            Confirm Appointment
                        </AnimatedButton>
                    </div>
                </form>
            </GlassCard>
        </div>
    );
};
