import React, { useContext, useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';
import PermissionsList from '../components/features/Permissions';
import AnimatedButton from '../components/ui/AnimatedButton';
import { getAllProviders } from '../api/providers';
import { listPatientPermissions, upsertPermission, togglePermission as togglePermApi } from '../api/permissions';

const PermissionsPage = ({ user, onUpdatePermissions }) => {
    const { theme } = useContext(ThemeContext);
    const [providers, setProviders] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState('');
    const [documentType, setDocumentType] = useState('All');
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProviders = async () => {
            try {
                const list = await getAllProviders();
                setProviders(list || []);
            } catch (e) {
                setError('Failed to fetch providers');
            }
        };
        const loadPerms = async () => {
            try {
                const list = await listPatientPermissions();
                setPermissions(list);
            } catch (e) {
                // ignore
            }
        };
        loadProviders();
        loadPerms();
    }, []);

    const handleScopeChange = async (id, newScope, newDocType) => {
        const perm = permissions.find(p => p._id === id);
        if (!perm) return;
        try {
            const updated = await upsertPermission({
                providerId: perm.providerId?._id || perm.providerId,
                scope: newScope,
                documentType: newDocType ?? perm.documentType,
                isActive: perm.isActive
            });
            setPermissions(prev => prev.map(p => p._id === updated._id ? updated : p));
        } catch (e) {
            setError(e.response?.data?.message || e.message || 'Failed to update permission');
        }
    };

    const handleStatusToggle = async (id) => {
        const perm = permissions.find(p => p._id === id);
        if (!perm) return;
        try {
            const updated = await togglePermApi({ providerId: perm.providerId?._id || perm.providerId, isActive: !perm.isActive });
            setPermissions(prev => prev.map(p => p._id === updated._id ? updated : p));
        } catch (e) {
            setError(e.response?.data?.message || e.message || 'Failed to update permission');
        }
    };

    const handleAddProvider = async () => {
        setError('');
        setStatusMessage('');
        if (!selectedProvider) {
            setError('Select a provider');
            return;
        }
        try {
            const created = await upsertPermission({ providerId: selectedProvider, documentType, scope: 'Full Record', isActive: true });
            setPermissions(prev => {
                const exists = prev.find(p => p._id === created._id);
                if (exists) return prev.map(p => p._id === created._id ? created : p);
                return [created, ...prev];
            });
            setStatusMessage('Provider permission saved');
            setSelectedProvider('');
        } catch (e) {
            setError(e.response?.data?.message || e.message || 'Failed to add provider');
        }
    };

    return (
        <div className="p-6">
            <GlassCard>
                <h1 className={`text-3xl font-bold mb-4 flex items-center gap-3 ${theme.text}`}>
                    <Lock /> Access & Permissions
                </h1>
                <p className={`mb-6 opacity-80 ${theme.text}`}>
                    Manage who can access your health data. These permissions are enforced by secure smart contracts on the blockchain.
                </p>

                {/* Add Provider */}
                <div className="p-4 mb-6 rounded-lg border-2 border-dashed">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                        <div>
                            <label className={`block text-sm mb-1 ${theme.text}`}>Select Provider</label>
                            <select
                                className={`w-full p-2 rounded-lg border-2 ${theme.accent} ${theme.text}`}
                                value={selectedProvider}
                                onChange={(e) => setSelectedProvider(e.target.value)}
                            >
                                <option value="">Choose provider...</option>
                                {providers.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.name} {p.walletAddress ? `(${p.walletAddress.slice(0,6)}...${p.walletAddress.slice(-4)})` : ''}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={`block text-sm mb-1 ${theme.text}`}>Document Type</label>
                            <select
                                className={`w-full p-2 rounded-lg border-2 ${theme.accent} ${theme.text}`}
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="Lab Report">Lab Report</option>
                                <option value="Prescription">Prescription</option>
                                <option value="Imaging">Imaging</option>
                            </select>
                        </div>
                        <div className="flex">
                            <AnimatedButton className="ml-auto" onClick={handleAddProvider}>Add Provider</AnimatedButton>
                        </div>
                    </div>
                    {statusMessage && <p className="mt-2 text-green-600">{statusMessage}</p>}
                    {error && <p className="mt-2 text-red-600">{error}</p>}
                </div>
                <PermissionsList
                    permissions={permissions.map(p => ({
                        id: p._id,
                        grantee: p.providerId?.name || p.providerId,
                        status: p.isActive ? 'Active' : 'Inactive',
                        scope: p.scope,
                        documentType: p.documentType,
                        duration: '—'
                    }))}
                    theme={theme}
                    onScopeChange={handleScopeChange}
                    onStatusToggle={handleStatusToggle}
                />
            </GlassCard>
        </div>
    );
};

export default PermissionsPage;