
import React from 'react';

export const Checkbox: React.FC<{ label: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled?: boolean }> = ({ label, checked, onChange, disabled }) => (
    <label className={`flex items-center space-x-2 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
        <div className="relative w-5 h-5">
            <input 
                type="checkbox" 
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="appearance-none w-5 h-5 border-2 border-[var(--color-border-light)] rounded-[4px] transition-colors
                           hover:border-[var(--color-text-secondary)]
                           checked:bg-[var(--color-accent)] checked:border-[var(--color-accent)]
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)] focus:ring-offset-[var(--color-bg-panel)]"
            />
            {checked && (
                 <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M10.354 4.646a.5.5 0 0 1 0 .708L6.707 8.646a.5.5 0 0 1-.708 0L4.646 7.707a.5.5 0 0 1 .708-.708L6 7.293l4.243-4.243a.5.5 0 0 1 .702 0z"/>
                </svg>
            )}
        </div>
        <span className={`text-sm ${disabled ? 'text-gray-500' : 'text-[var(--color-text-secondary)]'}`}>{label}</span>
    </label>
);
