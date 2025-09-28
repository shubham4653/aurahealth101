import React, { useState, useEffect, useContext } from 'react';

import { Search } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';
import { getAllPatients } from '../api/patients';
import { getProviderAppointments } from '../api/appointments';
import AnimatedButton from '../components/ui/AnimatedButton';

const ProviderDashboard = ({ user, onNavigate }) => {
    const { theme } = useContext(ThemeContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch patients
                const patientsResponse = await getAllPatients();
                setPatients(patientsResponse.data || []);

                // Fetch appointments
                const appointmentsResponse = await getProviderAppointments();
                if (appointmentsResponse.success) {
                    setAppointments(appointmentsResponse.data || []);
                }
            } catch (err) {
                setError('Failed to fetch data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredPatients = patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter today's appointments
    const getTodaysAppointments = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return appointments.filter(apt => {
            const appointmentDate = new Date(apt.appointmentDate);
            appointmentDate.setHours(0, 0, 0, 0);
            return appointmentDate.getTime() === today.getTime() && apt.status === 'Scheduled';
        });
    };

    const todaysAppointments = getTodaysAppointments();
    
    const getStatusColor = (status) => {
        if (status === 'Critical') return 'bg-red-500';
        if (status === 'Warning') return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className={`text-3xl font-bold ${theme.text}`}>Welcome back, {user.name}!</h1>
                    <p className={`opacity-80 ${theme.text}`}>Here is your dashboard for today.</p>
                </div>
                {onNavigate && (
                    <AnimatedButton onClick={() => onNavigate('upload-record')} className="px-4 py-2 text-sm">
                        Upload New Record
                    </AnimatedButton>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard><h4 className="font-bold">Total Patients</h4><p className="text-3xl font-bold">{patients.length}</p></GlassCard>
                <GlassCard><h4 className="font-bold">Today's Appointments</h4><p className="text-3xl font-bold">{todaysAppointments.length}</p></GlassCard>
                <GlassCard><h4 className="font-bold">Total Appointments</h4><p className="text-3xl font-bold">{appointments.length}</p></GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard>
                    <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>Recent Appointments</h3>
                    <div className="space-y-3">
                        {appointments.slice(0, 3).map(apt => (
                            <div key={apt._id} className={`p-3 rounded-lg flex items-center justify-between ${theme.secondary}`}>
                                <div>
                                    <p className="font-semibold">{apt.patientId?.name || 'Unknown Patient'}</p>
                                    <p className="text-sm opacity-70">{apt.reason}</p>
                                    <p className="text-xs opacity-50">{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">{apt.time}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        apt.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-500' :
                                        apt.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                                        'bg-red-500/20 text-red-500'
                                    }`}>
                                        {apt.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {appointments.length === 0 && (
                            <p className={`text-center ${theme.text} opacity-70`}>No appointments found</p>
                        )}
                    </div>
                </GlassCard>
                 <GlassCard>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`text-xl font-bold ${theme.text}`}>Today's Appointments</h3>
                        <button onClick={() => onNavigate('provider-appointments')} className="text-sm text-blue-400 hover:underline">View All</button>
                    </div>
                    <div className="space-y-3">
                        {todaysAppointments.length > 0 ? (
                            todaysAppointments.map(apt => (
                                <div key={apt._id} className={`p-3 rounded-lg flex items-center justify-between ${theme.secondary}`}>
                                    <div>
                                        <p className="font-semibold">{apt.patientId?.name || 'Unknown Patient'}</p>
                                        <p className="text-sm opacity-70">{apt.reason}</p>
                                    </div>
                                    <p className="font-bold">{apt.time}</p>
                                </div>
                            ))
                        ) : (
                            <p className={`text-center ${theme.text} opacity-70`}>No appointments scheduled for today</p>
                        )}
                    </div>
                </GlassCard>

            </div>

            <GlassCard>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-xl font-bold ${theme.text}`}>Your Patients</h3>
                     <div className="relative">
                        <input type="text" placeholder="Search patients..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={`w-full p-2 pl-10 rounded-lg bg-transparent border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.accent} ${theme.text}`} />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50"/>
                    </div>
                </div>
                <div className="max-h-96 overflow-y-auto pr-2">
                    {loading ? (
                        <p className={theme.text}>Loading patients...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : filteredPatients.length > 0 ? (
                        filteredPatients.map(p => (
                            <div key={p._id} onClick={() => onNavigate('view-patient', p._id)} className={`p-3 mb-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors hover:bg-slate-700 ${theme.secondary}`}>
                                <div>
                                    <p className="font-semibold">{p.name} <span className="opacity-60 text-sm">({p._id.slice(-6)})</span></p>
                                    <p className="text-sm opacity-70">{p.email}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${getStatusColor('Stable')}`}></div>
                                    <span>Stable</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className={theme.text}>No patients found.</p>
                    )}
                </div>

            </GlassCard>
        </div>
    );
};

export default ProviderDashboard;
