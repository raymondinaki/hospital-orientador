import { lazy, Suspense } from 'react';
import { Route, Switch } from 'wouter';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

// Lazy load pages for code splitting
// Each page needs to be wrapped to work with wouter's component prop
const SearchPage = lazy(() => import('@/features/search/SearchPage').then(m => ({ default: m.default })));
const MapPage = lazy(() => import('@/features/map/MapPage').then(m => ({ default: m.default })));
const ModuleDetail = lazy(() => import('@/features/modules/ModuleDetail').then(m => ({ default: m.default })));
const EmergencyPage = lazy(() => import('@/features/emergency/EmergencyPage').then(m => ({ default: m.default })));

function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground">{t('error.notFound')}</p>
      </div>
    </div>
  );
}

function LazyPage({ Component }: { Component: React.LazyExoticComponent<React.ComponentType> }) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><LoadingSpinner /></div>}>
      <Component />
    </Suspense>
  );
}

export function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <LazyPage Component={SearchPage} />} />
      <Route path="/map" component={() => <LazyPage Component={MapPage} />} />
      <Route path="/module/:id" component={() => <LazyPage Component={ModuleDetail} />} />
      <Route path="/emergency" component={() => <LazyPage Component={EmergencyPage} />} />
      <Route component={NotFound} />
    </Switch>
  );
}