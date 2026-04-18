import { Suspense, lazy } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useData } from '@/shared/hooks/useData';
import { Header } from '@/shared/components/Header';
import i18n from '@/i18n';

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

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Header />
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}

export default App;