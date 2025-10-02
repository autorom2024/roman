import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

// --- Config ---
export const languages = [
    { code: 'uk', name: "🇺🇦 Українська", short: "UA" },
    { code: 'en', name: "🇺🇸 English", short: "EN" },
];
export const DEFAULT_LOCALE = 'uk';

// --- Context and Provider ---
interface LanguageContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, params?: { [key: string]: any }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNestedValue = (obj: any, path: string): string | undefined => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch(`./locales/${locale}.json`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error(`Could not load translations for locale: ${locale}`, error);
        try {
            const response = await fetch(`./locales/${DEFAULT_LOCALE}.json`);
            if (!response.ok) throw new Error('Network response was not ok for fallback');
            const data = await response.json();
            setTranslations(data);
        } catch (fallbackError) {
             console.error(`Could not load fallback translations`, fallbackError);
        }
      }
    };
    fetchTranslations();
  }, [locale]);

  const t = useCallback((key: string, params: { [key:string]: any } = {}): string => {
    let translation = getNestedValue(translations, key);
    if (typeof translation !== 'string') {
      return key;
    }
    Object.keys(params).forEach(paramKey => {
      const regex = new RegExp(`{{${paramKey}}}`, 'g');
      translation = (translation as string).replace(regex, String(params[paramKey]));
    });
    return translation;
  }, [translations]);

  const value = { locale, setLocale, t };

  return (
    <LanguageContext.Provider value={value}>
      {Object.keys(translations).length > 0 ? children : <div className="bg-[#080c12] h-screen w-screen"></div>}
    </LanguageContext.Provider>
  );
};

// --- Hook ---
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};