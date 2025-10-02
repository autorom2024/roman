
import React from 'react';
import { Copyright, Sparkles } from 'lucide-react';
import { useTranslation } from '../i18n';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  return (
    <footer className="h-8 bg-[var(--color-bg-panel-secondary)] border-t border-[var(--color-border)] flex-shrink-0 flex items-center justify-between px-4 text-xs text-gray-400"
      style={{ boxShadow: '0 -4px 15px -5px rgba(0,0,0,0.4)' }}
    >
      <div className="flex items-center space-x-2">
        <Copyright className="w-3.5 h-3.5" />
        <span>VOIKAN RECORDS v1.3.5 {currentYear} {t('footer.rights')}</span>
      </div>
      <div 
        className="flex items-center space-x-1.5 font-bold text-purple-300"
        style={{
            filter: 'drop-shadow(0 0 8px rgba(192, 132, 252, 0.5))'
        }}
        >
        <Sparkles className="w-3.5 h-3.5" />
        <span>{t('footer.plan')}: Pro</span>
      </div>
    </footer>
  );
};
