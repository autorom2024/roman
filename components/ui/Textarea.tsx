
import React from 'react';

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} rows={props.rows || 3} className={`w-full bg-black/30 border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-primary)]
    focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-glow)] focus:border-[var(--color-accent)] focus:bg-black/40
    hover:border-[var(--color-border-light)]
    transition-all duration-300 disabled:opacity-50 ${props.className || ''}`} />
);
