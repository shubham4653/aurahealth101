import React, { useContext } from 'react';
import { ShieldCheck, Download, FileText } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';
import AnimatedButton from '../components/ui/AnimatedButton';

const RecordsPage = ({ user }) => {
    const { theme } = useContext(ThemeContext);

    return (
        <div className="p-6">
            <GlassCard>
                <h1 className={`text-3xl font-bold mb-4 flex items-center gap-3 ${theme.text}`}>
                    <FileText /> My Medical Records
                </h1>
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
                                <AnimatedButton className="px-4 py-2 text-sm" icon={Download}>
                                    Download
                                </AnimatedButton>
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-xs opacity-60 break-all">
                                <ShieldCheck size={14} className="text-green-400 flex-shrink-0" />
                                <p className={theme.secondaryText}>Hash: {record.blockchainHash}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};

export default RecordsPage;