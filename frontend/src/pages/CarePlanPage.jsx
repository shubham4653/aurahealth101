import React, { useContext } from 'react';
import { ListTodo } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import CarePlan from '../components/features/CarePlan.jsx';

const CarePlanPage = ({ user, onUpdateCarePlan }) => {
    const { theme } = useContext(ThemeContext);
    const { tasks, medications } = user.carePlan;

    const handleToggleTask = (taskId) => {
        const updatedTasks = tasks.map(t =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        onUpdateCarePlan({ tasks: updatedTasks, medications });
    };

    const handleToggleMed = (medId) => {
        const updatedMeds = medications.map(m =>
            m.id === medId ? { ...m, completed: !m.completed } : m
        );
        onUpdateCarePlan({ tasks, medications: updatedMeds });
    };

    return (
        <div className="p-6">
            <GlassCard>
                <h1 className={`text-3xl font-bold mb-4 flex items-center gap-3 ${theme.text}`}>
                    <ListTodo /> My Care Plan
                </h1>
                <p className={`mb-6 opacity-80 ${theme.text}`}>
                    Follow the plan created by your provider to stay on track with your health goals.
                </p>
                <CarePlan
                    tasks={tasks}
                    medications={medications}
                    onToggleTask={handleToggleTask}
                    onToggleMed={handleToggleMed}
                    theme={theme}
                />
            </GlassCard>
        </div>
    );
};

export default CarePlanPage;