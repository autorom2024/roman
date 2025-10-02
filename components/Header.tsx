
import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from '../i18n';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  return (
    <header className="h-12 bg-[var(--color-bg-panel-secondary)] border-b border-[var(--color-border)] flex-shrink-0 flex items-center justify-between px-4"
            style={{ boxShadow: '0 4px 15px -5px rgba(0,0,0,0.4)' }}
    >
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="font-bold text-[var(--color-text-secondary)]">VOIKAN RECORDS - [PRO]</span>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-sm bg-[#313843] hover:bg-[#3E4653] border border-[var(--color-border-light)] px-3 py-1 rounded-md transition text-[var(--color-text-primary)] font-semibold">
          {t('header.changePC')}
        </button>
        <div 
          className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-bold
                     bg-green-500/20 border border-green-400/30 text-green-300
                     shadow-lg shadow-green-500/10"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))'
          }}
        >
          <Star className="w-4 h-4" />
          <span>PRO</span>
        </div>
      </div>
    </header>
  );
};
