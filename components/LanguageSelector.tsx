
import React from 'react';
import { useTranslation, languages } from '../i18n';

export const LanguageSelector: React.FC = () => {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex justify-center items-center space-x-2">
      {languages.map(lang => {
        const isActive = locale === lang.code;
        const flag = lang.name.split(' ')[0];
        
        return (
            <button
              key={lang.code}
              onClick={() => setLocale(lang.code)}
              className={`
                flex items-center justify-center space-x-2 w-full px-3 py-2 text-sm font-bold rounded-md transition-all duration-300
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]
                ${isActive
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-[#313843] text-[var(--color-text-primary)] hover:bg-[#3E4653] border border-[var(--color-border-light)] hover:border-[#5B6473]'
                }
              `}
            >
              <span>{flag}</span>
              <span>{lang.short}</span>
            </button>
        )
      })}
    </div>
  );
};
