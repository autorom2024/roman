
import React from 'react';
import { Check } from 'lucide-react';

export const SegmentedControl = <T extends string>({ options, value, onChange, disabled }: { options: { value: T, label: string }[], value: T, onChange: (value: T) => void, disabled?: boolean }) => (
    <div className="flex items-center bg-[#1E232B] rounded-lg p-1 space-x-1 border border-[#38414F]">
        {options.map(opt => {
            const isActive = value === opt.value;
            return (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    disabled={disabled}
                    className={`relative flex items-center justify-center w-full px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3882F6]
                    ${isActive ? 'text-white' : 'text-[#A0ACC0] hover:text-white'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    {isActive && <div className="absolute inset-0 bg-[#3882F6] rounded-md"></div>}
                    <span className="relative z-10 flex items-center">
                        {isActive && <Check className="w-4 h-4 mr-2" />}
                        {opt.label}
                    </span>
                </button>
            )
        })}
    </div>
);