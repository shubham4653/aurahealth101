import React, { useState, useContext } from 'react';
import { CalendarPlus } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { AppointmentList, AppointmentScheduler } from '../components/features/Appointments.jsx';
import AnimatedButton from '../components/ui/AnimatedButton.jsx';

const AppointmentsPage = ({ user, onUpdateAppointments }) => {
    const { theme } = useContext(ThemeContext);
    const [showScheduler, setShowScheduler] = useState(false);

    const handleSchedule = (newAppointment) => {
        const updatedAppointments = [...user.appointments, { ...newAppointment, id: Date.now() }];
        onUpdateAppointments(updatedAppointments);
        setShowScheduler(false);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className={`text-3xl font-bold ${theme.text}`}>Your Appointments</h1>
                <AnimatedButton onClick={() => setShowScheduler(true)} icon={CalendarPlus}>
                    Schedule New
                </AnimatedButton>
            </div>

            <AppointmentList appointments={user.appointments} theme={theme} />

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