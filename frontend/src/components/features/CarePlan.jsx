import React from 'react';
import GlassCard from '../ui/GlassCard.jsx';

const CarePlan = ({ tasks, medications, onToggleTask, onToggleMed, theme }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard>
                <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>Daily Tasks</h3>
                <div className="space-y-3">
                    {tasks.map(task => (
                        <div key={task.id} className={`p-3 rounded-lg flex items-center gap-3 transition-all ${task.completed ? 'opacity-50' : ''} ${theme.secondary}`}>
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => onToggleTask(task.id)}
                                className="w-5 h-5 rounded accent-blue-500"
                            />
                            <label className={`${task.completed ? 'line-through' : ''} ${theme.secondaryText}`}>
                                {task.text}
                            </label>
                        </div>
                    ))}
                </div>
            </GlassCard>
            <GlassCard>
                <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>Medication Schedule</h3>
                <div className="space-y-3">
                    {medications.map(med => (
                        <div key={med.id} className={`p-3 rounded-lg flex items-center gap-3 transition-all ${med.completed ? 'opacity-50' : ''} ${theme.secondary}`}>
                            <input
                                type="checkbox"
                                checked={med.completed}
                                onChange={() => onToggleMed(med.id)}
                                className="w-5 h-5 rounded accent-blue-500"
                            />
                            <div>
                                <p className={`font-semibold ${med.completed ? 'line-through' : ''} ${theme.secondaryText}`}>
                                    {med.name}
                                </p>
                                <p className={`text-sm opacity-70 ${theme.secondaryText}`}>
                                    {med.dosage} - {med.frequency}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};

export default CarePlan;