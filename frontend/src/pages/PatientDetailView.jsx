import React, { useState, useEffect } from 'react';
import { Loader2, Send, ClipboardPlus, Pill, ArrowLeft, Shield, FileText, Download } from 'lucide-react';
import { generateMockHash } from '../utils/helpers';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import PatientProfilePage from './PatientProfilePage';
import PatientDashboard from './PatientDashboard';
import { getPatientById } from '../api/patients';
import { listProviderPermissions } from '../api/permissions';
import { api } from '../api/auth';
import CarePlan from '../components/features/CarePlan';
import { 
    getCarePlanByPatientId, 
    addTask, 
    addMedication, 
    removeTask, 
    removeMedication 
} from '../api/carePlan';

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

const CarePlanManager = ({ patient, theme, onUpdateCarePlan }) => {
    const [carePlan, setCarePlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (patient?._id) {
            fetchCarePlan();
        }
    }, [patient?._id]);

    const fetchCarePlan = async () => {
        try {
            setLoading(true);
            const response = await getCarePlanByPatientId(patient._id);
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

    const handleAddTask = async (taskName) => {
        try {
            setUpdating(true);
            const response = await addTask(patient._id, taskName, '');
            if (response.success) {
                setCarePlan(response.data);
                onUpdateCarePlan && onUpdateCarePlan(response.data);
            }
        } catch (err) {
            console.error('Error adding task:', err);
        } finally {
            setUpdating(false);
        }
    };

    const handleAddMedication = async (medicationData) => {
        try {
            setUpdating(true);
            const response = await addMedication(
                patient._id, 
                medicationData.name, 
                medicationData.dosage, 
                medicationData.frequency
            );
            if (response.success) {
                setCarePlan(response.data);
                onUpdateCarePlan && onUpdateCarePlan(response.data);
            }
        } catch (err) {
            console.error('Error adding medication:', err);
        } finally {
            setUpdating(false);
        }
    };

    const handleRemoveTask = async (taskId) => {
        try {
            setUpdating(true);
            const response = await removeTask(patient._id, taskId);
            if (response.success) {
                setCarePlan(response.data);
                onUpdateCarePlan && onUpdateCarePlan(response.data);
            }
        } catch (err) {
            console.error('Error removing task:', err);
        } finally {
            setUpdating(false);
        }
    };

    const handleRemoveMedication = async (medicationId) => {
        try {
            setUpdating(true);
            const response = await removeMedication(patient._id, medicationId);
            if (response.success) {
                setCarePlan(response.data);
                onUpdateCarePlan && onUpdateCarePlan(response.data);
            }
        } catch (err) {
            console.error('Error removing medication:', err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
    return (
        <GlassCard>
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <span className={`ml-3 ${theme.text}`}>Loading care plan...</span>
                </div>
            </GlassCard>
        );
    }

    if (error) {
        return (
            <GlassCard>
                <div className="text-center py-8">
                    <p className={`text-red-500 mb-4 ${theme.text}`}>{error}</p>
                    <button
                        onClick={fetchCarePlan}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </GlassCard>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${theme.text}`}>Care Plan Management</h3>
                <button
                    onClick={fetchCarePlan}
                    disabled={updating}
                    className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                    <Loader2 className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
                </button>
            </div>
            
            <CarePlan
                tasks={carePlan?.tasks || []}
                medications={carePlan?.medications || []}
                onAddTask={handleAddTask}
                onAddMedication={handleAddMedication}
                onRemoveTask={handleRemoveTask}
                onRemoveMedication={handleRemoveMedication}
                theme={theme}
                isEditable={true}
            />
        </div>
    );
};


const PatientDetailView = ({ patient, onNavigate, theme, providerName, onUpdatePatient }) => {
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [patientRecords, setPatientRecords] = useState([]);
    const [showRecords, setShowRecords] = useState(false);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await getPatientById(patient._id);
                setPatientData(response.data);
                
                // Check if provider has access to this patient's records
                const permissions = await listProviderPermissions();
                const hasPermission = permissions.some(perm => 
                    perm.patientId?._id === patient._id || perm.patientId === patient._id
                );
                setHasAccess(hasPermission);
                
                if (hasPermission) {
                    // Load patient's records
                    const recordsResponse = await api.get('/medical-record/provider', { withCredentials: true });
                    const allRecords = recordsResponse.data.data || [];
                    const patientRecords = allRecords.filter(record => 
                        record.patient?._id === patient._id || record.patientId === patient._id
                    );
                    setPatientRecords(patientRecords);
                }
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

    const handleDownload = (record) => {
        window.open(record.cloudinaryUrl, '_blank');
    };

    return (
        <div className="p-6">
            <button onClick={() => onNavigate('back')} className="flex items-center gap-2 mb-6 text-blue-400 hover:underline">
                <ArrowLeft size={20} />
                <span>Back to List</span>
            </button>
            
            {patientData && (
                <>
                    <PatientProfilePage user={patientData} isViewOnly={true}/>
                    
                    {/* Access Control Section */}
                    <div className="mt-6">
                        <GlassCard>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-6 h-6 text-blue-500" />
                                    <h3 className={`text-xl font-bold ${theme.text}`}>Patient Records Access</h3>
                                </div>
                                {hasAccess && (
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">
                                            {patientRecords.length} Records Available
                                        </div>
                                        <AnimatedButton
                                            onClick={() => setShowRecords(!showRecords)}
                                            className="px-4 py-2 text-sm"
                                            icon={FileText}
                                        >
                                            {showRecords ? 'Hide Records' : 'View Records'}
                                        </AnimatedButton>
                                    </div>
                                )}
                            </div>
                            
                            {hasAccess ? (
                                <div>
                                    <p className={`mb-4 ${theme.text} opacity-80`}>
                                        You have been granted access to this patient's medical records. 
                                        All access is controlled by blockchain smart contracts.
                                    </p>
                                    
                                    {showRecords && (
                                        <div className="space-y-4">
                                            {patientRecords.length === 0 ? (
                                                <p className={`text-center py-8 ${theme.text} opacity-70`}>
                                                    No records available for this patient.
                                                </p>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {patientRecords.map(record => (
                                                        <div key={record._id} className={`p-4 rounded-lg border ${theme.secondary} border-opacity-50 hover:border-opacity-100 transition-all`}>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <FileText className="w-5 h-5 text-blue-500" />
                                                                <h4 className={`font-semibold ${theme.secondaryText}`}>{record.recordType}</h4>
                                                            </div>
                                                            <p className={`text-sm ${theme.secondaryText} opacity-70 mb-2`}>
                                                                <strong>File:</strong> {record.fileName}
                                                            </p>
                                                            <p className={`text-sm ${theme.secondaryText} opacity-70 mb-2`}>
                                                                <strong>Uploaded:</strong> {new Date(record.uploadDate).toLocaleDateString()}
                                                            </p>
                                                            {record.description && (
                                                                <p className={`text-sm ${theme.secondaryText} opacity-70 mb-3`}>
                                                                    <strong>Description:</strong> {record.description}
                                                                </p>
                                                            )}
                                                            
                                                            <AnimatedButton
                                                                onClick={() => handleDownload(record)}
                                                                className="w-full text-sm"
                                                                icon={Download}
                                                            >
                                                                Download
                                                            </AnimatedButton>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                                    <p className={`text-lg ${theme.text} opacity-70 mb-2`}>
                                        No Access to Patient Records
                                    </p>
                                    <p className={`text-sm ${theme.text} opacity-50`}>
                                        This patient has not granted you access to their medical records. 
                                        Ask them to grant access through their permissions page.
                                    </p>
                                </div>
                            )}
                        </GlassCard>
                    </div>

                    {/* Care Plan Management Section */}
                    <div className="mt-6">
                        <CarePlanManager 
                            patient={patientData} 
                            theme={theme} 
                            onUpdateCarePlan={handleUpdateCarePlan}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default PatientDetailView;
