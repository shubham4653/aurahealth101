import React, { useState, useEffect } from 'react';
import { Loader2, Send, ClipboardPlus, Pill, ArrowLeft } from 'lucide-react';
import { generateMockHash } from '../utils/helpers';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import PatientProfilePage from './PatientProfilePage';
import PatientDashboard from './PatientDashboard';
import { getPatientById } from '../api/patients';

const SendReportCard = ({ providerName, patientId, theme, onReportSent }) => {
    const [file, setFile] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [reportType, setReportType] = useState('Blood Test');
    
    const handleSendReport = async () => {
        if (!file) return;
        setIsSending(true);
        const hash = await generateMockHash();
        const newReport = {
            id: Date.now(),
            type: reportType,
            date: new Date().toISOString().split('T')[0],
            doctor: providerName,
            file: file.name,
            blockchainHash: hash
        };
        onReportSent(newReport);
        setIsSending(false);
        setFile(null);
    };

    return (
        <GlassCard>
            <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>Send Secure Report</h3>
            <div className="space-y-4">
                <input type="file" onChange={(e) => setFile(e.target.files[0])} className={`w-full text-sm ${theme.text} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`} />
                <input type="text" value={reportType} onChange={e => setReportType(e.target.value)} placeholder="Report Type (e.g., MRI Scan)" className={`w-full p-3 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text}`} />
                <AnimatedButton onClick={handleSendReport} disabled={!file || isSending} icon={isSending ? Loader2 : Send} className="w-full">
                    {isSending ? 'Sending & Hashing...' : 'Send Report'}
                </AnimatedButton>
            </div>
        </GlassCard>
    );
};

const ManageCarePlanCard = ({ patient, theme, onUpdateCarePlan }) => {
    const [newTask, setNewTask] = useState('');
    const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '' });

    const handleAddTask = () => {
        if(!newTask.trim()) return;
        const updatedTasks = [...patient.carePlan.tasks, { id: Date.now(), text: newTask, completed: false }];
        onUpdateCarePlan({ ...patient.carePlan, tasks: updatedTasks });
        setNewTask('');
    };

    const handleAddMed = () => {
        if(!newMed.name.trim() || !newMed.dosage.trim() || !newMed.frequency.trim()) return;
        const updatedMeds = [...patient.carePlan.medications, { id: Date.now(), ...newMed, completed: false }];
        onUpdateCarePlan({ ...patient.carePlan, medications: updatedMeds });
        setNewMed({ name: '', dosage: '', frequency: '' });
    };

    return (
        <GlassCard>
            <h3 className={`text-xl font-bold mb-4 ${theme.text}`}>Manage Care Plan</h3>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold mb-2">Add New Task</h4>
                    <div className="flex gap-2">
                        <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="e.g., Check blood sugar" className={`flex-grow p-2 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text}`} />
                        <AnimatedButton onClick={handleAddTask} icon={ClipboardPlus} className="px-4 py-2 text-sm" />
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold mb-2">Prescribe Medication</h4>
                    <div className="space-y-2">
                        <input type="text" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} placeholder="Medication Name" className={`w-full p-2 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text}`} />
                        <div className="flex gap-2">
                            <input type="text" value={newMed.dosage} onChange={e => setNewMed({...newMed, dosage: e.target.value})} placeholder="Dosage (e.g., 10mg)" className={`w-1/2 p-2 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text}`} />
                            <input type="text" value={newMed.frequency} onChange={e => setNewMed({...newMed, frequency: e.target.value})} placeholder="Frequency" className={`w-1/2 p-2 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text}`} />
                        </div>
                        <AnimatedButton onClick={handleAddMed} icon={Pill} className="w-full mt-2 text-sm">Add Prescription</AnimatedButton>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};


const PatientDetailView = ({ patient, onNavigate, theme, providerName, onUpdatePatient }) => {
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await getPatientById(patient._id);
                setPatientData(response.data);
            } catch (err) {
                setError('Failed to fetch patient data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (patient?._id) {
            fetchPatientData();
        }
    }, [patient]);

    const handleReportSent = (newReport) => {
        const updatedPatient = { ...patientData, records: [...patientData.records, newReport] };
        setPatientData(updatedPatient);
    };

    const handleUpdateCarePlan = (newCarePlan) => {
        const updatedPatient = { ...patientData, carePlan: newCarePlan };
        setPatientData(updatedPatient);
    };

    if (loading) {
        return <div className={`text-center p-6 ${theme.text}`}>Loading patient details...</div>;
    }

    if (error) {
        return <div className={`text-center p-6 text-red-500`}>{error}</div>;
    }

    return (
        <div className="p-6">
            <button onClick={() => onNavigate('back')} className="flex items-center gap-2 mb-6 text-blue-400 hover:underline">
                <ArrowLeft size={20} />
                <span>Back to List</span>
            </button>
            {patientData && <PatientProfilePage user={patientData} isViewOnly={true}/>}
        </div>
    );
};

export default PatientDetailView;
