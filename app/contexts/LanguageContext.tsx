'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from '../locales/en';
import { tr } from '../locales/tr';

type Language = 'en' | 'tr';
type TranslationType = typeof en;
type TranslationsType = Record<Language, TranslationType>;

interface LanguageContextType {
    currentLanguage: Language;
    t: (key: string) => string;
    changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: TranslationsType = {
    en,
    tr
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [currentLanguage, setCurrentLanguage] = useState<Language>('en');

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'tr')) {
            setCurrentLanguage(savedLang);
        }
    }, []);

    const changeLanguage = (lang: Language) => {
        setCurrentLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string) => {
        const keys = key.split('.');
        let value: any = translations[currentLanguage];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key;
            }
        }

        return value as string;
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, t, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
} 