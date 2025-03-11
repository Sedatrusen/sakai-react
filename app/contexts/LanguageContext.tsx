'use client';

import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import '../i18n';

interface LanguageContextType {
    t: (key: string) => string;
    changeLanguage: (lang: string) => void;
    currentLanguage: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{
            t,
            changeLanguage,
            currentLanguage: i18n.language
        }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}; 