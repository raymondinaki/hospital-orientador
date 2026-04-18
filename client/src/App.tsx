import { Suspense, lazy } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useData } from '@/shared/hooks/useData';
import { Header } from '@/shared/components/Header';
import { OfflineIndicator } from '@/shared/components/OfflineIndicator';
import i18n from '@/i18n';
import { useTranslation } from 'react-i18next';

// Lazy load Router to enable code splitting
const Router = lazy(() => import('./app/Router'));

function LoadingScreen() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
      <div className="text-center">
        <div className="h-12 w-12 animate-pulse rounded-full bg-primary/20 mx-auto mb-4" />
      </div>
    </div>
  );
}

function AppContent() {
  const { isLoading } = useData();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Router />
    </Suspense>
  );
}

function SkipToContent() {
  const { t } = useTranslation();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground"
    >
      {t('accessibility.skipToContent')}
    </a>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <SkipToContent />
          <Header />
          <main id="main-content" tabIndex={-1}>
            <AppContent />
          </main>
          <OfflineIndicator />
        </TooltipProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;