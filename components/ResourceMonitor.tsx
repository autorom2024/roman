import React, { useState, useEffect } from 'react';
import { Cpu, MemoryStick, HardDrive, Info } from 'lucide-react';
import { useTranslation } from '../i18n';

interface Stat {
  name: string;
  value: number;
  icon: React.ElementType;
}

const StatDisplay: React.FC<{ stat: Stat }> = ({ stat }) => {
  const Icon = stat.icon;
  const val = Math.min(100, Math.max(0, stat.value));

  const getBarColor = () => {
    if (val > 85) return 'bg-red-500';
    if (val > 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getGlowStyle = () => {
    if (val > 85) return { boxShadow: '0 0 8px rgba(239, 68, 68, 0.7)' };
    if (val > 60) return { boxShadow: '0 0 8px rgba(234, 179, 8, 0.6)' };
    return { boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)' };
  }

  return (
    <div className="grid grid-cols-6 items-center gap-2 text-sm p-2 rounded-md">
      <div className="col-span-1 flex items-center justify-center">
        <Icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
      </div>
      <div className="col-span-5 flex flex-col">
        <div className="flex justify-between items-baseline mb-1">
            <span className="font-semibold text-[var(--color-text-secondary)]">{stat.name}</span>
            <span className={`font-bold text-xs text-white`}>{val.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-black/30 rounded-full h-2 border border-black/50">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${val}%`, ...getGlowStyle() }}
          ></div>
        </div>
      </div>
    </div>
  );
};

interface ResourceMonitorProps {
  isRunning: boolean;
}

export const ResourceMonitor: React.FC<ResourceMonitorProps> = ({ isRunning }) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ cpu: 0, ram: 0, gpu: 0 });

  useEffect(() => {
    const updateStats = () => {
        if (isRunning) {
            setStats({
                cpu: Math.random() * 50 + 40, // 40-90%
                ram: Math.random() * 20 + 70, // 70-90%
                gpu: Math.random() * 60 + 30, // 30-90%
            });
        } else {
             setStats({
                cpu: Math.random() * 20 + 5,  // 5-25%
                ram: Math.random() * 40 + 30, // 30-70%
                gpu: Math.random() * 25 + 5,  // 5-30%
            });
        }
    };
    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="space-y-1 bg-black/20 border border-[var(--color-border)] rounded-xl p-1">
      <div className="flex items-center justify-between px-2 pt-1">
        <h3 className="text-sm font-semibold text-[var(--color-text-tertiary)]">{t('resourceMonitor.title')}</h3>
        <div className="group relative">
          <Info className="w-3.5 h-3.5 text-[var(--color-text-tertiary)] cursor-help" />
          <div className="absolute bottom-full right-0 mb-2 w-max max-w-xs p-2 text-xs text-white bg-black/80 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {t('resourceMonitor.tooltip')}
          </div>
        </div>
      </div>
      <StatDisplay stat={{ name: t('resourceMonitor.cpu'), value: stats.cpu, icon: Cpu }} />
      <StatDisplay stat={{ name: t('resourceMonitor.ram'), value: stats.ram, icon: MemoryStick }} />
      <StatDisplay stat={{ name: t('resourceMonitor.gpu'), value: stats.gpu, icon: HardDrive }} />
    </div>
  );
};