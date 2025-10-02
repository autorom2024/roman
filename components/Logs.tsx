import React, { useRef, useEffect } from 'react';
import { useTranslation } from '../i18n';

interface LogsProps {
  logs: string[];
  setLogs: React.Dispatch<React.SetStateAction<string[]>>;
}

export const Logs: React.FC<LogsProps> = ({ logs, setLogs }) => {
  const { t } = useTranslation();
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-2">
      <div className="flex-1 bg-black/30 border border-[var(--color-border)] rounded-md p-2 text-xs font-mono overflow-y-auto">
        {logs.map((log, index) => (
            <div key={index} className="text-[var(--color-text-secondary)]">
              {log}
            </div>
          ))}
        <div ref={logsEndRef} />
      </div>
      <button 
        onClick={() => setLogs([`[System] ${t('logs.cleared')}`])}
        className="w-full bg-[#313843] hover:bg-[#3E4653] border border-[var(--color-border-light)] text-white font-bold py-2 px-4 rounded-lg transition text-sm"
      >
        {t('logs.clear')}
      </button>
    </div>
  );
};