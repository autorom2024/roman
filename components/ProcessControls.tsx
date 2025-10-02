
import React from 'react';
import { useTranslation } from '../i18n';

interface ProcessControlsProps {
  isRunning: boolean;
  progress: number;
  progressLabel: string;
  startProcess: () => void;
  stopProcess: () => void;
}

export const ProcessControls: React.FC<ProcessControlsProps> = ({ isRunning, progress, progressLabel, startProcess, stopProcess }) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      <div className="relative w-full bg-black/30 rounded-full h-6 border border-black/50 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500" 
          style={{ 
            width: `${Math.min(progress, 100)}%`,
            background: `linear-gradient(90deg, var(--color-accent), var(--color-accent-hover))`,
            boxShadow: '0 0 10px 2px var(--color-accent-glow)'
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.7)' }}>
                {progressLabel}
            </span>
        </div>
      </div>
      <div className="flex space-x-2">
        <button 
          onClick={startProcess} 
          disabled={isRunning}
          className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] disabled:bg-opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-300
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-panel-secondary)]"
          style={{
             boxShadow: isRunning ? 'none' : '0 0 12px var(--color-accent-glow)',
             animation: isRunning ? 'none' : 'pulse 2.5s infinite'
          }}
        >
          {t('processControls.start')}
        </button>
        <button 
          onClick={stopProcess} 
          disabled={!isRunning}
          className="w-full bg-[#313843] hover:bg-[#3E4653] border border-[var(--color-border-light)] disabled:bg-opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-lg transition"
        >
          {t('processControls.stop')}
        </button>
      </div>
    </div>
  );
};
