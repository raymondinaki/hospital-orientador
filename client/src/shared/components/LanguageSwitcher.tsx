import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAppStore } from '@/shared/hooks/useAppStore';
import { syncLanguage } from '@/i18n';
import type { Language } from '@shared/types';

// Language configuration
const languages: { code: Language; flag: string; label: string }[] = [
  { code: 'es', flag: '🇪🇸', label: 'Español' },
  { code: 'ht', flag: '🇭🇹', label: 'Kreyòl Ayisyen' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'arn', flag: '🌐', label: 'Mapudungún' },
];

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { language, setLanguage } = useAppStore();

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  const handleLanguageChange = useCallback(
    (lang: Language) => {
      setLanguage(lang);
      syncLanguage(lang);
      // localStorage is handled by both Zustand persist middleware
      // and i18next-browser-languagedetector
    },
    [setLanguage]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          aria-label={t('accessibility.languageMenu')}
        >
          <Globe className="size-4" />
          <span className="font-medium uppercase tracking-wider">
            {currentLang.code}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="animate-fade-in"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal pb-2">
          {t('common.language')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center gap-3 cursor-pointer"
            aria-label={`${lang.label} (${
              lang.code === language ? t('common.language') : ''
            })`}
          >
            <span className="text-lg leading-none" role="img" aria-hidden="true">
              {lang.flag}
            </span>
            <span className="flex-1">{lang.label}</span>
            {lang.code === 'arn' && (
              <span className="text-xs text-muted-foreground">(pendiente)</span>
            )}
            {lang.code === language && (
              <span className="text-xs text-primary font-medium ml-2">
                ✓
              </span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}