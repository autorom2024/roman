import React from 'react';
import { LanguageSelector } from './LanguageSelector';
import { ResourceMonitor } from './ResourceMonitor';
import { ProcessControls } from './ProcessControls';
import { Logs } from './Logs';
import { useTranslation } from '../i18n';

interface ControlPanelProps {
  logs: string[];
  setLogs: React.Dispatch<React.SetStateAction<string[]>>;
  isRunning: boolean;
  progress: number;
  progressLabel: string;
  startProcess: () => void;
  stopProcess: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = (props) => {
  const { t } = useTranslation();
  return (
    <aside className="w-80 bg-[var(--color-bg-panel-secondary)] border-l border-[var(--color-border)] flex-shrink-0 p-4 flex flex-col space-y-4">
      
      <div className="bg-black/20 border border-[var(--color-border)] rounded-xl p-2">
        <LanguageSelector />
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        <div>
          <ResourceMonitor isRunning={props.isRunning} />
        </div>

        <div className="w-full h-[1px] bg-[var(--color-border)]"></div>

        <div>
           <h3 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-2 px-1">{t('controlPanel.processControl')}</h3>
           <ProcessControls {...props} />
        </div>

        <div className="w-full h-[1px] bg-[var(--color-border)]"></div>

        <div className="flex-1 flex flex-col min-h-0">
          <h3 className="text-sm font-semibold text-[var(--color-text-tertiary)] mb-2 px-1">{t('controlPanel.logs')}</h3>
          <Logs logs={props.logs} setLogs={props.setLogs} />
        </div>
      </div>
    </aside>
  );
};