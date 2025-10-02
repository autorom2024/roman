
import React from 'react';

export const GroupBox: React.FC<{ title: string; children: React.ReactNode, className?: string }> = ({ title, children, className }) => (
  <div className={`relative p-px rounded-xl bg-gradient-to-b from-[var(--color-border-light)] to-transparent ${className}`}>
    <div className="bg-[var(--color-bg-panel)] rounded-[11px] p-5 pt-6">
      <h2 className="absolute -top-3 left-4 bg-[var(--color-bg-panel)] px-2 text-[13px] font-semibold text-[var(--color-text-tertiary)]">
        {title}
      </h2>
      {children}
    </div>
  </div>
);
