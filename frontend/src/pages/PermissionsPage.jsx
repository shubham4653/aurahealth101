import React, { useContext } from 'react';
import { Lock } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import GlassCard from '../components/ui/GlassCard';
import PermissionsList from '../components/features/Permissions';

const PermissionsPage = ({ user, onUpdatePermissions }) => {
    const { theme } = useContext(ThemeContext);

    const handleScopeChange = (id, newScope) => {
        const updatedPermissions = user.permissions.map(p =>
            p.id === id ? { ...p, scope: newScope } : p
        );
        onUpdatePermissions(updatedPermissions);
    };

    const handleStatusToggle = (id) => {
        const updatedPermissions = user.permissions.map(p =>
            p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p
        );
        onUpdatePermissions(updatedPermissions);
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
                <PermissionsList
                    permissions={user.permissions}
                    theme={theme}
                    onScopeChange={handleScopeChange}
                    onStatusToggle={handleStatusToggle}
                />
            </GlassCard>
        </div>
    );
};

export default PermissionsPage;