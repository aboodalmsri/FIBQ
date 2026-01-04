import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ar from './locales/ar.json';
import fr from './locales/fr.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  fr: { translation: fr },
};

// Get saved language or default to 'en'
const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

export const languages = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'fr', name: 'Français', dir: 'ltr' },
];

export const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
  localStorage.setItem('language', lng);
  
  // Update document direction for RTL languages
  const language = languages.find(l => l.code === lng);
  document.documentElement.dir = language?.dir || 'ltr';
  document.documentElement.lang = lng;
};
