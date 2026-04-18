import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { MapPin, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-14 items-center justify-between gap-4">
        {/* Logo area */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <MapPin className="size-5 text-primary" />
          <div className="flex flex-col">
            <h1 className="text-base font-semibold leading-tight">{t('header.title')}</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">{t('header.subtitle')}</p>
          </div>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          
          <Link href="/emergency">
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5"
              aria-label={t('emergency.title')}
            >
              <AlertTriangle className="size-4" />
              <span className="hidden sm:inline">{t('emergency.title')}</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}