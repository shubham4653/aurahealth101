import React, { useState } from 'react';
import { CheckCircle, Circle, Plus, Trash2, Edit3, Save, X, Pill } from 'lucide-react';
import GlassCard from '../../ui/GlassCard';
import AnimatedButton from '../../ui/AnimatedButton';

const MedicationManager = ({ 
    medications = [], 
    onToggleMedication, 
    onAddMedication, 
    onRemoveMedication, 
    onEditMedication,
    theme, 
    isEditable = false,
    title = "Medication Schedule"
}) => {
    const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '' });
    const [editingMedication, setEditingMedication] = useState(null);
    const [editData, setEditData] = useState({ name: '', dosage: '', frequency: '' });

    const handleAddMedication = () => {
        if (newMedication.name.trim() && newMedication.dosage.trim() && newMedication.frequency.trim() && onAddMedication) {
            onAddMedication(newMedication);
            setNewMedication({ name: '', dosage: '', frequency: '' });
        }
    };

    const handleEditMedication = (medication) => {
        setEditingMedication(medication._id);
        setEditData({
            name: medication.name,
            dosage: medication.dosage,
            frequency: medication.frequency
        });
    };

    const handleSaveEdit = () => {
        if (editData.name.trim() && editData.dosage.trim() && editData.frequency.trim() && onEditMedication) {
            onEditMedication(editingMedication, editData);
            setEditingMedication(null);
            setEditData({ name: '', dosage: '', frequency: '' });
        }
    };

    const handleCancelEdit = () => {
        setEditingMedication(null);
        setEditData({ name: '', dosage: '', frequency: '' });
    };

    return (
        <GlassCard>
            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold flex items-center gap-2 ${theme.text}`}>
                    <Pill className="w-5 h-5" />
                    {title}
                </h3>
                {isEditable && (
                    <div className="text-sm text-green-500">
                        {medications.filter(m => m.completed).length} / {medications.length} taken
                    </div>
                )}
            </div>

            {isEditable && (
                <div className="mb-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <h4 className={`font-semibold mb-3 ${theme.text}`}>Add New Medication</h4>
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={newMedication.name}
                            onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                            placeholder="Medication name (e.g., Metformin)"
                            className={`w-full p-3 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} placeholder-opacity-50`}
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                value={newMedication.dosage}
                                onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                                placeholder="Dosage (e.g., 500mg)"
                                className={`p-3 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} placeholder-opacity-50`}
                            />
                            <input
                                type="text"
                                value={newMedication.frequency}
                                onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                                placeholder="Frequency (e.g., Twice daily)"
                                className={`p-3 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} placeholder-opacity-50`}
                            />
                        </div>
                        <AnimatedButton
                            onClick={handleAddMedication}
                            icon={Plus}
                            className="w-full"
                            disabled={!newMedication.name.trim() || !newMedication.dosage.trim() || !newMedication.frequency.trim()}
                        >
                            Add Medication
                        </AnimatedButton>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                {medications.length === 0 ? (
                    <div className={`text-center py-8 opacity-60 ${theme.text}`}>
                        <Pill className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No medications prescribed yet</p>
                    </div>
                ) : (
                    medications.map(medication => (
                        <div
                            key={medication._id}
                            className={`p-4 rounded-lg flex items-center gap-3 transition-all ${
                                medication.completed ? 'opacity-60' : ''
                            } ${theme.secondary}`}
                        >
                            <button
                                onClick={() => onToggleMedication && onToggleMedication(medication._id, !medication.completed)}
                                className="flex-shrink-0"
                            >
                                {medication.completed ? (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
                                )}
                            </button>

                            <div className="flex-1">
                                {editingMedication === medication._id ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                                            placeholder="Medication name"
                                            className={`w-full p-2 rounded bg-transparent border ${theme.accent} ${theme.text}`}
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                value={editData.dosage}
                                                onChange={(e) => setEditData({...editData, dosage: e.target.value})}
                                                placeholder="Dosage"
                                                className={`p-2 rounded bg-transparent border ${theme.accent} ${theme.text}`}
                                            />
                                            <input
                                                type="text"
                                                value={editData.frequency}
                                                onChange={(e) => setEditData({...editData, frequency: e.target.value})}
                                                placeholder="Frequency"
                                                className={`p-2 rounded bg-transparent border ${theme.accent} ${theme.text}`}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSaveEdit}
                                                className="px-3 py-1 text-green-500 hover:text-green-600 text-sm"
                                            >
                                                <Save className="w-4 h-4 inline mr-1" />
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-3 py-1 text-red-500 hover:text-red-600 text-sm"
                                            >
                                                <X className="w-4 h-4 inline mr-1" />
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className={`font-semibold ${medication.completed ? 'line-through' : ''} ${theme.secondaryText}`}>
                                            {medication.name}
                                        </p>
                                        <p className={`text-sm opacity-70 ${theme.secondaryText}`}>
                                            <span className="font-medium">Dosage:</span> {medication.dosage}
                                        </p>
                                        <p className={`text-sm opacity-70 ${theme.secondaryText}`}>
                                            <span className="font-medium">Frequency:</span> {medication.frequency}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {isEditable && editingMedication !== medication._id && (
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleEditMedication(medication)}
                                        className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onRemoveMedication && onRemoveMedication(medication._id)}
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

export default MedicationManager;
