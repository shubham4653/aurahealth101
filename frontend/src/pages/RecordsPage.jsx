import React, { useContext, useState } from 'react';
import { ShieldCheck, Download, FileText } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

const RecordsPage = ({ user, onNavigate }) => {
    const { theme } = useContext(ThemeContext);
    const [grantingId, setGrantingId] = useState(null);
    const [providerAddress, setProviderAddress] = useState('');
    const [grantStatus, setGrantStatus] = useState('');
    const [grantError, setGrantError] = useState('');

    const handleGrantAccess = async (record) => {
        setGrantStatus('');
        setGrantError('');
        try {
            const res = await fetch('/api/v1/contract/grant-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ providerAddress })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to grant access');
            setGrantStatus('Access granted successfully!');
            setProviderAddress('');
            setGrantingId(null);
        } catch (err) {
            setGrantError(err.message);
        }
    };

    return (
        <div className="p-6">
            <GlassCard>
                <div className="flex justify-between items-center mb-4">
                    <h1 className={`text-3xl font-bold flex items-center gap-3 ${theme.text}`}>
                        <FileText /> My Medical Records
                    </h1>
                    {onNavigate && (
                        <AnimatedButton onClick={() => onNavigate('upload-record')} className="px-4 py-2 text-sm">
                            Upload New Record
                        </AnimatedButton>
                    )}
                </div>
                <p className={`mb-6 opacity-80 ${theme.text}`}>
                    All your documents are secured and verified on the blockchain.
                </p>
                <div className="space-y-3">
                    {user.records.map(record => (
                        <div key={record.id} className={`p-4 rounded-lg ${theme.secondary}`}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className={`font-semibold text-lg ${theme.secondaryText}`}>{record.type}</p>
                                    <p className={`text-sm opacity-70 ${theme.secondaryText}`}>
                                        From: {record.doctor} on {record.date}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <AnimatedButton className="px-4 py-2 text-sm" icon={Download}>
                                        Download
                                    </AnimatedButton>
                                    {/* Grant Access Button (visible to patient/owner) */}
                                    <AnimatedButton className="px-4 py-2 text-sm" onClick={() => setGrantingId(record.id)}>
                                        Grant Access
                                    </AnimatedButton>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-xs opacity-60 break-all">
                                <ShieldCheck size={14} className="text-green-400 flex-shrink-0" />
                                <p className={theme.secondaryText}>Hash: {record.blockchainHash}</p>
                            </div>
                            {/* Grant Access Form */}
                            {grantingId === record.id && (
                                <div className="mt-4 p-3 rounded bg-slate-100 dark:bg-slate-800">
                                    <label className={`block mb-1 font-semibold ${theme.text}`}>Provider Wallet Address</label>
                                    <input type="text" className={`w-full p-2 rounded border ${theme.accent} ${theme.text}`} value={providerAddress} onChange={e => setProviderAddress(e.target.value)} placeholder="0x..." />
                                    <div className="flex gap-2 mt-2">
                                        <AnimatedButton onClick={() => handleGrantAccess(record)} disabled={!providerAddress} className="px-4 py-2 text-sm">Grant</AnimatedButton>
                                        <AnimatedButton onClick={() => { setGrantingId(null); setProviderAddress(''); }} className="px-4 py-2 text-sm">Cancel</AnimatedButton>
                                    </div>
                                    {grantStatus && <p className="mt-2 text-green-600">{grantStatus}</p>}
                                    {grantError && <p className="mt-2 text-red-500">{grantError}</p>}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};

export default RecordsPage;