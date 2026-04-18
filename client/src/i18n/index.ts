import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import type { Language } from '@shared/types';

// Import locale resources directly (small files, no need for lazy loading)
import es from './locales/es.json';
import ht from './locales/ht.json';
import en from './locales/en.json';
import arn from './locales/arn.json';

const resources = {
  es: { translation: es },
  ht: { translation: ht },
  en: { translation: en },
  arn: { translation: arn },
};

// Missing translation handler — i18next expects (lngs, ns, key, fallbackValue, updateMissing, options)
const missingKeyHandler = (
  lngs: readonly string[],
  ns: string,
  key: string,
  fallbackValue: string
): void => {
  // Mapudungún keys will show fallback value with "(pendiente traducción)" badge
  // For 'en' and 'ht', just return the fallback value naturally
  // This handler just logs missing keys — i18next returns fallbackValue automatically
  if (lngs.includes('arn')) {
    // Mapudungún: the fallback value will already be shown
    // UI components add the "(pendiente)" badge separately
  }
};

// Create and configure i18n instance
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    supportedLngs: ['es', 'ht', 'en', 'arn'],

    detection: {
      // Order: localStorage -> navigator.language -> fallback
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18n-lang',
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },

    missingKeyHandler,

    react: {
      useSuspense: true,
    },

    // Debug only in development
    debug: false,

    // Namespace configuration
    ns: ['translation'],
    defaultNS: 'translation',
  });

export default i18n;

// Helper to sync i18n language with external state (e.g., Zustand store)
export function syncLanguage(lang: Language): void {
  i18n.changeLanguage(lang);
}

// Helper to get current language
export function getCurrentLanguage(): Language {
  return i18n.language as Language;
}