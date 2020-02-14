import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import XHR from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en';
import ko from './locales/ko';

i18n
  .use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false // not needed for react!!
    },
    resources: {
      en: { translation: en },
      ko: { translation: ko }
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
