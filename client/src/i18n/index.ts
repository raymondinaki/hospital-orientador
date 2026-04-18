import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import type { Language } from '@shared/types';

// Lazy-loaded locale resources
const resources = {
  es: () => import('./locales/es.json'),
  ht: () => import('./locales/ht.json'),
  en: () => import('./locales/en.json'),
  arn: () => import('./locales/arn.json'),
};

// Missing translation handler
const missingKeyHandler = (
  lng: string | undefined,
  ns: string,
  key: string,
  defaultValue: string
): string => {
  // Only add "pendiente traducción" badge for Mapudungún
  if (lng === 'arn') {
    return `${defaultValue} <span class="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded ml-2">(pendiente traducción)</span>`;
  }
  // For 'en' and 'ht', just return the key as fallback
  return defaultValue;
};

// Create and configure i18n instance
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es' as Language,
    supportedLngs: ['es', 'ht', 'en', 'arn'],

    detection: {
      // Order: localStorage -> navigator.language -> fallback
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18n-lang',
      caches: ['localStorage'],
    },

    interpolation: {
      defaultVariables: {
        // Default values for common interpolation patterns
      },
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