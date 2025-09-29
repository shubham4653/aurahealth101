import React, { useContext, useState, useEffect } from 'react';
import { ShieldCheck, Download, FileText, UserPlus, UserMinus, Eye, Lock, Shield } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';
import FileIntegrityChecker from '../components/features/FileIntegrityChecker';
import { api } from '../api/auth';

const RecordsPage = ({ user, onNavigate }) => {
    const { theme } = useContext(ThemeContext);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [grantingId, setGrantingId] = useState(null);
    const [providerAddress, setProviderAddress] = useState('');
    const [grantStatus, setGrantStatus] = useState('');
    const [grantError, setGrantError] = useState('');
    const [error, setError] = useState('');
    const [verifyingRecord, setVerifyingRecord] = useState(null);

    // Fetch records on component mount
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                setLoading(true);
                
                // Debug auth token
                const token = localStorage.getItem('accessToken');
                console.log('🔍 Frontend Auth Debug:', {
                    hasToken: !!token,
                    tokenLength: token?.length,
                    userRole: user.role,
                    tokenPreview: token?.substring(0, 20) + '...'
                });
                
                // First check auth status
                try {
                    const authResponse = await api.get('/medical-record/auth-status');
                    console.log('🔍 Backend Auth Status:', authResponse.data);
                } catch (authErr) {
                    console.log('🔍 Auth status check failed:', authErr.message);
                }
                
                // Always use patient endpoint for now since the user is logged in as patient
                const endpoint = '/medical-record/patient';
                console.log('🔍 Using endpoint:', endpoint, 'for user role:', user.role);
                const response = await api.get(endpoint, { withCredentials: true });
                console.log('🔍 Medical Records Response:', response.data);
                console.log('🔍 Records Data:', response.data.data);
                if (response.data.data && response.data.data.length > 0) {
                    console.log('🔍 First Record ProviderId:', response.data.data[0].providerId);
                    console.log('🔍 First Record Provider:', response.data.data[0].provider);
                }
                setRecords(response.data.data || []);
            } catch (err) {
                console.error('🔍 Records fetch error:', err.response?.data || err.message);
                setError(err.response?.data?.message || err.message || 'Failed to fetch records');
            } finally {
                setLoading(false);
            }
        };
        
        fetchRecords();
    }, [user.role]);

    const handleGrantAccess = async (record) => {
        setGrantStatus('');
        setGrantError('');
        try {
            const response = await api.post('/medical-record/grant-access', {
                recordId: record._id,
                providerAddress
            }, { withCredentials: true });
            setGrantStatus('Access granted successfully!');
            setProviderAddress('');
            setGrantingId(null);
            
            // Refresh records
            const endpoint = '/medical-record/patient';
            const refreshed = await api.get(endpoint, { withCredentials: true });
            setRecords(refreshed.data.data || []);
        } catch (err) {
            setGrantError(err.response?.data?.message || err.message || 'Failed to grant access');
        }
    };

    const handleRevokeAccess = async (record) => {
        try {
            const response = await api.post('/medical-record/revoke-access', {
                recordId: record._id,
                providerAddress
            }, { withCredentials: true });
            setGrantStatus('Access revoked successfully!');
            setProviderAddress('');
            setGrantingId(null);
            
            // Refresh records
            const endpoint = '/medical-record/patient';
            const refreshed = await api.get(endpoint, { withCredentials: true });
            setRecords(refreshed.data.data || []);
        } catch (err) {
            setGrantError(err.response?.data?.message || err.message || 'Failed to revoke access');
        }
    };

    const handleDownload = (record) => {
        // Open the Cloudinary URL in a new tab for download
        window.open(record.cloudinaryUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center min-h-screen">
                <GlassCard className="w-full max-w-2xl">
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className={`text-lg ${theme.text}`}>Loading your medical records...</p>
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
                        <FileText className="w-8 h-8 text-blue-500" />
                        <h1 className={`text-3xl font-bold ${theme.text}`}>
                            {user.role === 'patient' ? 'My Medical Records' : 'Medical Records'}
                        </h1>
                    </div>
                    {onNavigate && user.role === 'provider' && (
                        <AnimatedButton onClick={() => onNavigate('upload-record')} className="px-4 py-2 text-sm" icon={FileText}>
                            Upload New Record
                        </AnimatedButton>
                    )}
                </div>
                
                <p className={`mb-6 opacity-80 ${theme.text}`}>
                    {user.role === 'patient' 
                        ? 'All your documents are secured and verified on the blockchain. You control who can access them.'
                        : 'Medical records you have access to. All documents are secured and verified on the blockchain.'
                    }
                </p>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                        <div className="mt-3">
                            <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                                Authentication failed. Please try:
                            </p>
                            <div className="space-y-2">
                                <button 
                                    onClick={() => {
                                        localStorage.removeItem('accessToken');
                                        window.location.reload();
                                    }}
                                    className="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded text-sm hover:bg-red-200 dark:hover:bg-red-900/40"
                                >
                                    Clear Token & Reload
                                </button>
                                <p className="text-xs text-red-600 dark:text-red-400">
                                    Or logout and login again
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {records.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className={`text-lg ${theme.text} opacity-70`}>
                            {user.role === 'patient' 
                                ? 'No medical records found. Ask your healthcare provider to upload records for you.'
                                : 'No medical records found. Upload records for your patients to get started.'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {records.map(record => (
                            <div key={record._id} className={`p-6 rounded-lg border-2 ${theme.secondary} border-opacity-50 hover:border-opacity-100 transition-all`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className={`font-bold text-xl ${theme.secondaryText}`}>{record.recordType}</h3>
                                            <ShieldCheck className="w-5 h-5 text-green-500" />
                                        </div>
                                        <p className={`text-sm ${theme.secondaryText} opacity-70 mb-2`}>
                                            <strong>File:</strong> {record.fileName}
                                        </p>
                                        <p className={`text-sm ${theme.secondaryText} opacity-70 mb-2`}>
                                            <strong>From:</strong> {record.providerId?.name || 'Unknown Provider'}
                                        </p>
                                        <p className={`text-sm ${theme.secondaryText} opacity-70 mb-2`}>
                                            <strong>Uploaded:</strong> {new Date(record.uploadDate).toLocaleDateString()}
                                        </p>
                                        {record.description && (
                                            <p className={`text-sm ${theme.secondaryText} opacity-70`}>
                                                <strong>Description:</strong> {record.description}
                                            </p>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-2 ml-4">
                                        <AnimatedButton 
                                            onClick={() => handleDownload(record)}
                                            className="px-4 py-2 text-sm" 
                                            icon={Download}
                                        >
                                            Download
                                        </AnimatedButton>
                                        
                                        <AnimatedButton 
                                            onClick={() => setVerifyingRecord(record)}
                                            className="px-4 py-2 text-sm" 
                                            icon={Shield}
                                        >
                                            Verify
                                        </AnimatedButton>
                                        
                                        {user.role === 'patient' && (
                                            <AnimatedButton 
                                                onClick={() => setGrantingId(record._id)}
                                                className="px-4 py-2 text-sm" 
                                                icon={UserPlus}
                                            >
                                                Grant Access
                                            </AnimatedButton>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Blockchain Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="p-3 rounded bg-gray-100 dark:bg-gray-800">
                                        <p className={`text-xs font-medium ${theme.text} mb-1`}>Contract Address:</p>
                                        <p className="text-xs font-mono break-all text-gray-600 dark:text-gray-400">
                                            {record.contractAddress}
                                        </p>
                                    </div>
                                    <div className="p-3 rounded bg-gray-100 dark:bg-gray-800">
                                        <p className={`text-xs font-medium ${theme.text} mb-1`}>File Hash:</p>
                                        <p className="text-xs font-mono break-all text-gray-600 dark:text-gray-400">
                                            {record.fileContentHash}
                                        </p>
                                    </div>
                                </div>

                                {/* Access Permissions */}
                                {record.accessPermissions && record.accessPermissions.length > 0 && (
                                    <div className="mb-4">
                                        <p className={`text-sm font-medium ${theme.text} mb-2`}>Access Granted To:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {record.accessPermissions.filter(p => p.isActive).map((permission, index) => (
                                                <div key={index} className="flex items-center gap-1 px-2 py-1 rounded bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs">
                                                    <UserPlus className="w-3 h-3" />
                                                    {permission.providerAddress.slice(0, 6)}...{permission.providerAddress.slice(-4)}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Grant Access Form */}
                                {grantingId === record._id && (
                                    <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                        <h4 className={`font-semibold ${theme.text} mb-3`}>Grant Access to Provider</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <label className={`block text-sm font-medium ${theme.text} mb-1`}>
                                                    Provider Wallet Address
                                                </label>
                                                <input 
                                                    type="text" 
                                                    className={`w-full p-2 rounded border ${theme.accent} ${theme.text} text-sm`} 
                                                    value={providerAddress} 
                                                    onChange={e => setProviderAddress(e.target.value)} 
                                                    placeholder="0x..." 
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <AnimatedButton 
                                                    onClick={() => handleGrantAccess(record)} 
                                                    disabled={!providerAddress} 
                                                    className="px-4 py-2 text-sm"
                                                    icon={UserPlus}
                                                >
                                                    Grant Access
                                                </AnimatedButton>
                                                <AnimatedButton 
                                                    onClick={() => { setGrantingId(null); setProviderAddress(''); }} 
                                                    className="px-4 py-2 text-sm"
                                                >
                                                    Cancel
                                                </AnimatedButton>
                                            </div>
                                            {grantStatus && (
                                                <p className="text-green-600 dark:text-green-400 text-sm">{grantStatus}</p>
                                            )}
                                            {grantError && (
                                                <p className="text-red-500 text-sm">{grantError}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </GlassCard>
            
            {/* File Integrity Checker Modal */}
            {verifyingRecord && (
                <FileIntegrityChecker 
                    record={verifyingRecord}
                    onClose={() => setVerifyingRecord(null)}
                />
            )}
        </div>
    );
};

export default RecordsPage;