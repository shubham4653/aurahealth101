import React from 'react';

const FormInput = ({ icon: Icon, type = "text", placeholder, name, value, onChange, theme, children }) => (
    <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className={`w-5 h-5 ${theme.text} opacity-50`} />
        </span>
        {children || <input type={type} placeholder={placeholder} name={name} value={value} onChange={onChange} className={`w-full p-3 pl-10 rounded-lg bg-transparent border-2 ${theme.accent} ${theme.text} focus:outline-none focus:ring-2 focus:ring-blue-500`} />}
    </div>
);

export default FormInput;