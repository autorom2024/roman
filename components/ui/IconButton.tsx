
import React from 'react';

export const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
    <button {...props} className={`p-2 bg-[#313843] hover:bg-[#3E4653] border border-[var(--color-border-light)] rounded-lg transition text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:opacity-50 ${props.className || ''}`}>
        {children}
    </button>
);
