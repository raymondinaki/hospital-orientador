import { lazy, Suspense } from 'react';
import { Route, Switch } from 'wouter';
import { useTranslation } from 'react-i18next';

// Lazy load pages for code splitting
const SearchPage = lazy(() => import('@/features/search/SearchPage'));
const MapPage = lazy(() => import('@/features/map/MapPage'));
const ModuleDetail = lazy(() => import('@/features/modules/ModuleDetail'));
const EmergencyPage = lazy(() => import('@/features/emergency/EmergencyPage'));

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

export function Router() {
  return (
    <Switch>
      <Route path="/" component={SearchPage} />
      <Route path="/map" component={MapPage} />
      <Route path="/module/:id" component={ModuleDetail} />
      <Route path="/emergency" component={EmergencyPage} />
      <Route component={NotFound} />
    </Switch>
  );
}