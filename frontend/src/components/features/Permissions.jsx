import React from 'react';
import AnimatedButton from '../ui/AnimatedButton';

const PermissionsList = ({ permissions, theme, onScopeChange, onStatusToggle }) => {
    return (
        <div className="space-y-3">
            {permissions.map(p => (
                <div key={p.id} className={`p-4 rounded-lg ${theme.secondary}`}>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        {/* Grantee Info */}
                        <div className="md:col-span-1">
                            <p className={`font-semibold text-lg ${theme.secondaryText}`}>{p.grantee}</p>
                            <p className={`text-sm ${p.status === 'Active' ? 'text-green-400' : 'text-red-400'}`}>{p.status}</p>
                        </div>

                        {/* Scope Dropdown */}
                        <div className="md:col-span-1">
                            <label className={`text-xs opacity-70 ${theme.secondaryText}`}>Scope</label>
                            <select
                                value={p.scope}
                                onChange={(e) => onScopeChange(p.id, e.target.value)}
                                className={`w-full p-2 mt-1 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-1`}
                                disabled={p.status !== 'Active'}
                            >
                                <option className={theme.bg}>Full Record</option>
                                <option className={theme.bg}>Vitals Only</option>
                                <option className={theme.bg}>Anonymized Vitals</option>
                                <option className={theme.bg}>Lab Reports Only</option>
                            </select>
                        </div>

                        {/* Duration Info */}
                        <div className="md:col-span-1">
                            <p className={`text-xs opacity-70 ${theme.secondaryText}`}>Duration</p>
                            <p className={theme.secondaryText}>{p.duration}</p>
                        </div>

                        {/* Action Button */}
                        <div className="md:col-span-1 flex justify-end">
                            <AnimatedButton
                                onClick={() => onStatusToggle(p.id)}
                                className={`px-4 py-2 text-sm ${p.status === 'Active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                            >
                                {p.status === 'Active' ? 'Revoke' : 'Activate'}
                            </AnimatedButton>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PermissionsList;