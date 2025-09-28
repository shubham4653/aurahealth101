import React, { useState, useEffect, useContext } from 'react';
import { FileText, Download, Shield, User, Filter, Search } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import { listProviderPermissions } from '../api/permissions';
import { api } from '../api/auth';

const ProviderGrantedRecordsPage = ({ user, onNavigate }) => {
    const { theme } = useContext(ThemeContext);
    const [permissions, setPermissions] = useState([]);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDocumentType, setFilterDocumentType] = useState('All');
    const [selectedPatient, setSelectedPatient] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                // Load permissions (patients who granted access)
                const perms = await listProviderPermissions();
                setPermissions(perms);
                
                // Load all accessible records
                const recordsResponse = await api.get('/medical-record/provider', { withCredentials: true });
                setRecords(recordsResponse.data.data || []);
            } catch (err) {
                setError(err.response?.data?.message || err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Filter records based on search and document type
    const filteredRecords = records.filter(record => {
        const matchesSearch = record.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            record.recordType?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDocType = filterDocumentType === 'All' || record.recordType === filterDocumentType;
        return matchesSearch && matchesDocType;
    });

    // Group records by patient
    const groupedRecords = filteredRecords.reduce((acc, record) => {
        const patientId = record.patient?._id || 'unknown';
        if (!acc[patientId]) {
            acc[patientId] = {
                patient: record.patient,
                records: []
            };
        }
        acc[patientId].records.push(record);
        return acc;
    }, {});

    const handleDownload = (record) => {
        window.open(record.cloudinaryUrl, '_blank');
    };

    const handleViewPatient = (patient) => {
        setSelectedPatient(patient);
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center min-h-screen">
                <GlassCard className="w-full max-w-2xl">
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className={`text-lg ${theme.text}`}>Loading granted records...</p>
                    </div>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="p-6">
            <GlassCard>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8 text-green-500" />
                        <h1 className={`text-3xl font-bold ${theme.text}`}>Granted Records Access</h1>
                    </div>
                    {onNavigate && (
                        <AnimatedButton onClick={() => onNavigate('provider-dashboard')} className="px-4 py-2 text-sm">
                            Back to Dashboard
                        </AnimatedButton>
                    )}
                </div>

                <p className={`mb-6 opacity-80 ${theme.text}`}>
                    Records that patients have granted you access to view. All access is controlled by blockchain smart contracts.
                </p>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
                        <input
                            type="text"
                            placeholder="Search by patient name or record type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 ${theme.accent} ${theme.text} focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>
                    <div>
                        <select
                            value={filterDocumentType}
                            onChange={(e) => setFilterDocumentType(e.target.value)}
                            className={`w-full p-2 rounded-lg border-2 ${theme.accent} ${theme.text} focus:ring-2 focus:ring-blue-500`}
                        >
                            <option value="All">All Document Types</option>
                            <option value="Lab Report">Lab Report</option>
                            <option value="Prescription">Prescription</option>
                            <option value="Imaging">Imaging</option>
                            <option value="X-Ray">X-Ray</option>
                        </select>
                    </div>
                </div>

                {/* Permissions Summary */}
                <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <h3 className={`font-semibold mb-2 ${theme.text}`}>Access Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className={`font-medium ${theme.text}`}>Patients with Access:</p>
                            <p className={`text-2xl font-bold text-blue-600 ${theme.text}`}>{Object.keys(groupedRecords).length}</p>
                        </div>
                        <div>
                            <p className={`font-medium ${theme.text}`}>Total Records:</p>
                            <p className={`text-2xl font-bold text-green-600 ${theme.text}`}>{records.length}</p>
                        </div>
                        <div>
                            <p className={`font-medium ${theme.text}`}>Active Permissions:</p>
                            <p className={`text-2xl font-bold text-purple-600 ${theme.text}`}>{permissions.length}</p>
                        </div>
                    </div>
                </div>

                {/* Records by Patient */}
                {Object.keys(groupedRecords).length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className={`text-lg ${theme.text} opacity-70`}>
                            No granted records found. Patients need to grant you access to their records first.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedRecords).map(([patientId, { patient, records: patientRecords }]) => (
                            <div key={patientId} className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-3">
                                        <User className="w-6 h-6 text-blue-500" />
                                        <div>
                                            <h3 className={`text-xl font-bold ${theme.text}`}>
                                                {patient?.fullName || 'Unknown Patient'}
                                            </h3>
                                            <p className={`text-sm ${theme.text} opacity-70`}>
                                                {patient?.email || 'No email'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-sm">
                                            {patientRecords.length} Records
                                        </div>
                                        <AnimatedButton
                                            onClick={() => handleViewPatient(patient)}
                                            className="px-3 py-1 text-sm"
                                            icon={User}
                                        >
                                            View Profile
                                        </AnimatedButton>
                                    </div>
                                </div>

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
                                            
                                            <div className="flex gap-2">
                                                <AnimatedButton
                                                    onClick={() => handleDownload(record)}
                                                    className="flex-1 text-sm"
                                                    icon={Download}
                                                >
                                                    Download
                                                </AnimatedButton>
                                            </div>

                                            {/* Blockchain Info */}
                                            <div className="mt-3 p-2 rounded bg-gray-100 dark:bg-gray-800">
                                                <p className={`text-xs font-medium ${theme.text} mb-1`}>Contract:</p>
                                                <p className="text-xs font-mono break-all text-gray-600 dark:text-gray-400">
                                                    {record.contractAddress}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </GlassCard>
        </div>
    );
};

export default ProviderGrantedRecordsPage;
