import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { useAppStore } from '@/shared/hooks/useAppStore';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { useSearch } from './useSearch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Layers } from 'lucide-react';
import type { Language } from '@shared/types';

export default function SearchPage() {
  const { t } = useTranslation();
  const { modules, specialties } = useAppStore();
  const language = useAppStore((state) => state.language);
  const {
    query,
    setQuery,
    results,
    isSearching,
    popularSpecialties,
    recentSearches,
    clearRecentSearches,
  } = useSearch();

  // Stats
  const totalModules = modules.length;
  const totalSpecialties = specialties.length;
  const floorCount = 2;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="py-12 md:py-16 px-4 timeline-view animate-fade-in-up">
        <div className="container max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">{t('header.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('header.tagline')}</p>
          
          {/* Search Input */}
          <div className="pt-4">
            <SearchInput value={query} onChange={setQuery} isSearching={isSearching} />
          </div>
        </div>
      </section>

      {/* Search Results (when query is active) */}
      {query.trim().length > 0 && (
        <section className="px-4 pb-8">
          <div className="container max-w-3xl mx-auto">
            <SearchResults results={results} isSearching={isSearching} />
          </div>
        </section>
      )}

      {/* Main Content (when no active search) */}
      {query.trim().length === 0 && (
        <div className="container max-w-6xl mx-auto px-4 space-y-10">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <section className="timeline-view animate-fade-in-up">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="size-4" />
                  {t('search.recentSearches')}
                </h2>
                <button
                  onClick={clearRecentSearches}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {t('search.clearHistory')}
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((id) => {
                  const specialty = specialties.find((s) => s.id === id);
                  if (!specialty) return null;
                  return (
                    <Link key={id} href={`/map?to=${specialty.module}`}>
                      <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                        {specialty.name[language as Language] || specialty.name.es}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Quick Access Grid */}
          <section className="timeline-view animate-fade-in-up">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="size-4" />
              {t('specialties.allSpecialties')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {specialties.slice(0, 12).map((specialty) => (
                <Link key={specialty.id} href={`/map?to=${specialty.module}`}>
                  <Card className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer h-full">
                    <CardContent className="p-3 text-center">
                      <p className="font-medium text-sm truncate">
                        {specialty.name[language as Language] || specialty.name.es}
                      </p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {specialty.floor === 1 ? t('floors.first') : t('floors.second')}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* Stats Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 timeline-view animate-fade-in-up">
            <Card>
              <CardContent className="p-6 text-center">
                <Layers className="size-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold">{totalModules}</p>
                <p className="text-sm text-muted-foreground">{t('modules.title')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="size-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold">{totalSpecialties}</p>
                <p className="text-sm text-muted-foreground">{t('specialties.title')}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Layers className="size-8 mx-auto mb-2 text-primary" />
                <p className="text-3xl font-bold">{floorCount}</p>
                <p className="text-sm text-muted-foreground">{t('map.floorSelector')}</p>
              </CardContent>
            </Card>
          </section>

          {/* Module Legend */}
          <section className="timeline-view animate-fade-in-up">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="size-4" />
              {t('modules.title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {modules.map((module) => (
                <Link key={module.id} href={`/module/${module.id}`}>
                  <Card
                    className="hover:shadow-md transition-all cursor-pointer h-full"
                    style={{ borderLeftColor: module.color, borderLeftWidth: '4px' }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">
                          {module.name[language as Language] || module.name.es}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" style={{ borderColor: module.color }}>
                          {t('floors.first')}
                        </Badge>
                        <span className="text-xs">
                          {module.specialties.length} {t('specialties.title').toLowerCase()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}