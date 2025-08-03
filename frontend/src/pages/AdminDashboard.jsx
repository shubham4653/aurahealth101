import React, { useState, useContext } from 'react';
import { Users, User, Stethoscope, ShieldCheck, BrainCircuit, Search } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';

// Sub-component for individual statistic cards
const StatCard = ({ label, value, icon: Icon, theme }) => (
    <GlassCard className="flex items-center gap-4">
        <Icon className={`w-8 h-8 ${theme.primaryText}`} />
        <div>
            <p className={`text-lg font-semibold opacity-80 ${theme.text}`}>{label}</p>
            <p className={`text-3xl font-bold ${theme.text}`}>{value.toLocaleString()}</p>
        </div>
    </GlassCard>
);

// Sub-component for the user/provider tables
const UserTable = ({ title, users, searchTerm, setSearchTerm, theme }) => (
    <GlassCard className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-bold ${theme.text}`}>{title}</h3>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className={`w-full p-2 pl-10 rounded-lg bg-transparent border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme.accent} ${theme.text}`}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" />
            </div>
        </div>
        <div className="flex-grow overflow-y-auto pr-2">
            <div className="space-y-2">
                {users.map(u => (
                    <div key={u.id} className={`p-3 rounded-lg flex justify-between items-center ${theme.secondary}`}>
                        <div>
                            <p className="font-semibold">{u.name}</p>
                            <p className="text-sm opacity-60">{u.id}</p>
                        </div>
                        <p className="text-sm opacity-80">{u.email}</p>
                    </div>
                ))}
            </div>
        </div>
    </GlassCard>
);


// Main page component
const AdminDashboard = ({ user }) => {
    const { theme } = useContext(ThemeContext);
    const [patientSearch, setPatientSearch] = useState('');
    const [providerSearch, setProviderSearch] = useState('');

    const filteredPatients = user.allPatients.filter(p =>
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(patientSearch.toLowerCase())
    );

    const filteredProviders = user.allProviders.filter(p =>
        p.name.toLowerCase().includes(providerSearch.toLowerCase()) ||
        p.id.toLowerCase().includes(providerSearch.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className={`text-3xl font-bold ${theme.text}`}>Admin Console</h1>
                <p className={`opacity-80 ${theme.text}`}>Live platform statistics and user management.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <StatCard label="Total Users" value={user.stats.totalUsers} icon={Users} theme={theme} />
                <StatCard label="Total Patients" value={user.stats.totalPatients} icon={User} theme={theme} />
                <StatCard label="Total Providers" value={user.stats.totalProviders} icon={Stethoscope} theme={theme} />
                <StatCard label="Secured Records" value={user.stats.securedRecords} icon={ShieldCheck} theme={theme} />
                <StatCard label="AI Analyses" value={user.stats.aiAnalyses} icon={BrainCircuit} theme={theme} />
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
                <UserTable
                    title="All Patients"
                    users={filteredPatients}
                    searchTerm={patientSearch}
                    setSearchTerm={setPatientSearch}
                    theme={theme}
                />
                <UserTable
                    title="All Providers"
                    users={filteredProviders}
                    searchTerm={providerSearch}
                    setSearchTerm={setProviderSearch}
                    theme={theme}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;