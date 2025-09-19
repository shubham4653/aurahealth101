import React, { useState, useEffect, useContext } from 'react';
import { getProviderAppointments } from '../api/appointments';
import { ThemeContext } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';

const ProviderAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const fetchAppointments = async () => {
            const res = await getProviderAppointments();
            if (res.success) {
                setAppointments(res.data);
            }
        };
        fetchAppointments();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className={`text-3xl font-bold mb-6 ${theme.text}`}>Your Appointments</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {appointments.length > 0 ? (
                    appointments.map(apt => (
                        <GlassCard key={apt._id}>
                            <div className="p-5">
                                <h3 className={`text-xl font-semibold ${theme.text}`}>{apt.patientId.fullName}</h3>
                                <p className={`text-sm opacity-80 ${theme.text}`}>{apt.patientId.email}</p>
                                <div className="mt-4 space-y-2">
                                    <p><span className="font-semibold">Date:</span> {new Date(apt.appointmentDate).toLocaleDateString()}</p>
                                    <p><span className="font-semibold">Time:</span> {apt.time}</p>
                                    <p><span className="font-semibold">Reason:</span> {apt.reason}</p>
                                    <p><span className="font-semibold">Status:</span> 
                                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                            apt.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-500' :
                                            apt.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                                            'bg-red-500/20 text-red-500'
                                        }`}>
                                            {apt.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </GlassCard>
                    ))
                ) : (
                    <p className={`col-span-full text-center ${theme.text}`}>You have no upcoming appointments.</p>
                )}
            </div>
        </div>
    );
};

export default ProviderAppointmentsPage;
