import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'tr',
        supportedLngs: ['tr', 'en'],
        debug: process.env.NODE_ENV === 'development',
        
        interpolation: {
            escapeValue: false,
        },

        backend: {
            loadPath: process.env.NODE_ENV === 'development' 
                ? 'http://localhost:3000/locales/{{lng}}/{{ns}}.json'
                : '/locales/{{lng}}/{{ns}}.json',
        },

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },

        ns: ['common', 'menu', 'auth', 'crud'],
        defaultNS: 'common',
    });

export default i18n; 