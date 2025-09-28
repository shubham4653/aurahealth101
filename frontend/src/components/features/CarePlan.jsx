import React from 'react';
import TaskManager from './carePlan/TaskManager';
import MedicationManager from './carePlan/MedicationManager';

const CarePlan = ({ 
    tasks = [], 
    medications = [], 
    onToggleTask, 
    onToggleMed, 
    onAddTask,
    onAddMedication,
    onRemoveTask,
    onRemoveMedication,
    onEditTask,
    onEditMedication,
    theme,
    isEditable = false
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TaskManager
                tasks={tasks}
                onToggleTask={onToggleTask}
                onAddTask={onAddTask}
                onRemoveTask={onRemoveTask}
                onEditTask={onEditTask}
                theme={theme}
                isEditable={isEditable}
                title="Daily Tasks"
            />
            <MedicationManager
                medications={medications}
                onToggleMedication={onToggleMed}
                onAddMedication={onAddMedication}
                onRemoveMedication={onRemoveMedication}
                onEditMedication={onEditMedication}
                theme={theme}
                isEditable={isEditable}
                title="Medication Schedule"
            />
        </div>
    );
};

export default CarePlan;