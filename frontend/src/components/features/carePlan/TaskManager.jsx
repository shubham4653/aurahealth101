import React, { useState } from 'react';
import { CheckCircle, Circle, Plus, Trash2, Edit3, Save, X } from 'lucide-react';
import GlassCard from '../../ui/GlassCard';
import AnimatedButton from '../../ui/AnimatedButton';

const TaskManager = ({ 
    tasks = [], 
    onToggleTask, 
    onAddTask, 
    onRemoveTask, 
    onEditTask,
    theme, 
    isEditable = false,
    title = "Daily Tasks"
}) => {
    const [newTask, setNewTask] = useState('');
    const [editingTask, setEditingTask] = useState(null);
    const [editText, setEditText] = useState('');

    const handleAddTask = () => {
        if (newTask.trim() && onAddTask) {
            onAddTask(newTask.trim());
            setNewTask('');
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task._id);
        setEditText(task.taskName);
    };

    const handleSaveEdit = () => {
        if (editText.trim() && onEditTask) {
            onEditTask(editingTask, editText.trim());
            setEditingTask(null);
            setEditText('');
        }
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
        setEditText('');
    };

    return (
        <GlassCard>
            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${theme.text}`}>{title}</h3>
                {isEditable && (
                    <div className="text-sm text-green-500">
                        {tasks.filter(t => t.completed).length} / {tasks.length} completed
                    </div>
                )}
            </div>

            {isEditable && (
                <div className="mb-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add new task..."
                            className={`flex-1 p-3 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} placeholder-opacity-50`}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                        />
                        <AnimatedButton
                            onClick={handleAddTask}
                            icon={Plus}
                            className="px-4 py-3"
                            disabled={!newTask.trim()}
                        />
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {tasks.length === 0 ? (
                    <div className={`text-center py-8 opacity-60 ${theme.text}`}>
                        <p>No tasks assigned yet</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div
                            key={task._id}
                            className={`p-3 rounded-lg flex items-center gap-3 transition-all ${
                                task.completed ? 'opacity-60' : ''
                            } ${theme.secondary}`}
                        >
                            <button
                                onClick={() => onToggleTask && onToggleTask(task._id, !task.completed)}
                                className="flex-shrink-0"
                            >
                                {task.completed ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
                                )}
                            </button>

                            <div className="flex-1">
                                {editingTask === task._id ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className={`flex-1 p-2 rounded bg-transparent border ${theme.accent} ${theme.text}`}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleSaveEdit}
                                            className="p-1 text-green-500 hover:text-green-600"
                                        >
                                            <Save className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="p-1 text-red-500 hover:text-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <p className={`${task.completed ? 'line-through' : ''} ${theme.secondaryText}`}>
                                            {task.taskName}
                                        </p>
                                        {task.instructions && (
                                            <p className={`text-sm opacity-70 ${theme.secondaryText} mt-1`}>
                                                {task.instructions}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {isEditable && editingTask !== task._id && (
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleEditTask(task)}
                                        className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onRemoveTask && onRemoveTask(task._id)}
                                        className="p-1 text-red-500 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </GlassCard>
    );
};

export default TaskManager;
