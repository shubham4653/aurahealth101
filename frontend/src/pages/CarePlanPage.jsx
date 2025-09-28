import React, { useContext, useState, useEffect } from 'react';
import { ListTodo, Loader2, RefreshCw, Calendar, TrendingUp } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext.jsx';
import GlassCard from '../components/ui/GlassCard.jsx';
import CarePlan from '../components/features/CarePlan.jsx';
import { getPatientCarePlan, updateTaskStatus, updateMedicationStatus } from '../api/carePlan.js';

const CarePlanPage = ({ user, onUpdateCarePlan }) => {
    const { theme } = useContext(ThemeContext);
    const [carePlan, setCarePlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchCarePlan();
    }, []);

    const fetchCarePlan = async () => {
        try {
            setLoading(true);
            const response = await getPatientCarePlan();
            if (response.success && response.data) {
                setCarePlan(response.data);
            } else {
                setCarePlan({ tasks: [], medications: [] });
            }
        } catch (err) {
            setError('Failed to load care plan');
            console.error('Error fetching care plan:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTask = async (taskId, completed) => {
        try {
            setUpdating(true);
            const response = await updateTaskStatus(taskId, completed);
            if (response.success) {
                setCarePlan(response.data);
            }
        } catch (err) {
            console.error('Error updating task:', err);
        } finally {
            setUpdating(false);
        }
    };

    const handleToggleMed = async (medicationId, completed) => {
        try {
            setUpdating(true);
            const response = await updateMedicationStatus(medicationId, completed);
            if (response.success) {
                setCarePlan(response.data);
            }
        } catch (err) {
            console.error('Error updating medication:', err);
        } finally {
            setUpdating(false);
        }
    };

    const getCompletionStats = () => {
        if (!carePlan) return { taskProgress: 0, medProgress: 0 };
        
        const taskProgress = carePlan.tasks.length > 0 
            ? (carePlan.tasks.filter(t => t.completed).length / carePlan.tasks.length) * 100 
            : 0;
        
        const medProgress = carePlan.medications.length > 0 
            ? (carePlan.medications.filter(m => m.completed).length / carePlan.medications.length) * 100 
            : 0;
        
        return { taskProgress, medProgress };
    };

    if (loading) {
        return (
            <div className="p-6">
                <GlassCard>
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <span className={`ml-3 ${theme.text}`}>Loading your care plan...</span>
                    </div>
                </GlassCard>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <GlassCard>
                    <div className="text-center py-12">
                        <p className={`text-red-500 mb-4 ${theme.text}`}>{error}</p>
                        <button
                            onClick={fetchCarePlan}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </GlassCard>
            </div>
        );
    }

    const { taskProgress, medProgress } = getCompletionStats();

    return (
        <div className="p-6">
            <GlassCard>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className={`text-3xl font-bold mb-2 flex items-center gap-3 ${theme.text}`}>
                            <ListTodo /> My Care Plan
                        </h1>
                        <p className={`opacity-80 ${theme.text}`}>
                            Follow the plan created by your provider to stay on track with your health goals.
                        </p>
                    </div>
                    <button
                        onClick={fetchCarePlan}
                        disabled={updating}
                        className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${updating ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Progress Overview */}
                {carePlan && (carePlan.tasks.length > 0 || carePlan.medications.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className={`p-4 rounded-lg ${theme.secondary}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`font-semibold ${theme.text}`}>Tasks Progress</span>
                                <span className={`text-sm ${theme.text} opacity-70`}>
                                    {Math.round(taskProgress)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${taskProgress}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className={`p-4 rounded-lg ${theme.secondary}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`font-semibold ${theme.text}`}>Medications Progress</span>
                                <span className={`text-sm ${theme.text} opacity-70`}>
                                    {Math.round(medProgress)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div 
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${medProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

                {carePlan && (carePlan.tasks.length > 0 || carePlan.medications.length > 0) ? (
                    <CarePlan
                        tasks={carePlan.tasks}
                        medications={carePlan.medications}
                        onToggleTask={handleToggleTask}
                        onToggleMed={handleToggleMed}
                        theme={theme}
                        isEditable={false}
                    />
                ) : (
                    <div className={`text-center py-12 ${theme.text} opacity-70`}>
                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-semibold mb-2">No Care Plan Assigned</h3>
                        <p>Your healthcare provider hasn't assigned any tasks or medications yet.</p>
                        <p className="text-sm mt-2">Contact your provider to get started with your personalized care plan.</p>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

export default CarePlanPage;