import React from 'react';

export const FormRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 py-2">
        <label className="text-right font-semibold text-gray-400 pr-4">{label}:</label>
        <div className="md:col-span-3">{children}</div>
    </div>
);
