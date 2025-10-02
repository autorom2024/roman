
import React from 'react';
import { useTranslation } from '../i18n';

interface PagePlaceholderProps {
  titleKey: string;
  icon: React.ElementType;
}

export const PagePlaceholder: React.FC<PagePlaceholderProps> = ({ titleKey, icon: Icon }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
        <Icon className="w-24 h-24 mb-4 text-gray-700" />
        <h1 className="text-4xl font-bold text-gray-600">{t(titleKey)}</h1>
        <p className="mt-2 text-lg">{t('pagePlaceholder.underConstruction')}</p>
    </div>
  );
};
