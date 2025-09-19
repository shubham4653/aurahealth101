import React, { useState, useContext, useEffect } from 'react';
import { CalendarPlus } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { AppointmentList, AppointmentScheduler } from '../components/features/Appointments.jsx';
import AnimatedButton from '../components/ui/AnimatedButton.jsx';
import { getPatientAppointments, scheduleAppointment, cancelAppointment } from '../api/appointments.js';

const AppointmentsPage = ({ user }) => {
    const { theme } = useContext(ThemeContext);
    const [showScheduler, setShowScheduler] = useState(false);
    const [appointments, setAppointments] = useState([]);

    const fetchAppointments = async () => {
        const res = await getPatientAppointments();
        if (res.success) {
            const formattedAppointments = res.data.map(apt => ({
                id: apt._id,
                providerName: apt.providerId.name,
                date: new Date(apt.appointmentDate).toLocaleDateString(),
                time: apt.time,
                reason: apt.reason,
            }));
            setAppointments(formattedAppointments);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleSchedule = async (appointmentData) => {
        const response = await scheduleAppointment({
            providerId: appointmentData.providerId,
            appointmentDate: appointmentData.date,
            time: appointmentData.time,
            reason: appointmentData.reason,
        });

        if (response.success) {
            fetchAppointments();
            setShowScheduler(false);
        } else {
            console.error('Failed to schedule appointment:', response.message);
        }
    };

    const handleCancel = async (appointmentId) => {
        const res = await cancelAppointment(appointmentId);
        if (res.success) {
            fetchAppointments();
        } else {
            console.error("Failed to cancel appointment:", res.message);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className={`text-3xl font-bold ${theme.text}`}>Your Appointments</h1>
                <AnimatedButton onClick={() => setShowScheduler(true)} icon={CalendarPlus}>
                    Schedule New
                </AnimatedButton>
            </div>

            <AppointmentList appointments={appointments} theme={theme} onCancel={handleCancel} />

            {showScheduler && (
                <AppointmentScheduler
                    user={user}
                    theme={theme}
                    onSchedule={handleSchedule}
                    onClose={() => setShowScheduler(false)}
                />
            )}
        </div>
    );
};

export default AppointmentsPage;
