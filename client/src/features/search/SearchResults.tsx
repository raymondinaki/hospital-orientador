import { useTranslation } from 'react-i18next';
import { Link } from 'wouter';
import { MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/shared/hooks/useAppStore';
import type { Language } from '@shared/types';
import type { SearchResult } from './useSearch';

interface SearchResultsProps {
  results: SearchResult[];
  isSearching: boolean;
}

export function SearchResults({ results, isSearching }: SearchResultsProps) {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);
  const addRecentSearch = useAppStore((state) => state.addRecentSearch);

  if (isSearching) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MapPin className="size-8 mx-auto mb-2 opacity-50" />
        <p>{t('search.noResults')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-slide-in-bottom">
      <p className="text-sm text-muted-foreground px-1">
        {t('search.resultsCount', { count: results.length })}
      </p>
      {results.map(({ specialty, module }) => (
        <Link
          key={specialty.id}
          href={`/map?to=${specialty.module}`}
          className="block"
          onClick={() => addRecentSearch(specialty.id)}
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {specialty.name[language as Language] || specialty.name.es}
                </p>
                {specialty.description && (
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {specialty.description[language as Language] || specialty.description.es}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {module && (
                  <Badge
                    style={{ backgroundColor: module.color + '20', color: module.color, borderColor: module.color }}
                    variant="outline"
                  >
                    {module.name[language as Language] || module.name.es}
                  </Badge>
                )}
                <Badge variant="secondary">
                  {specialty.floor === 1 ? t('floors.first') : t('floors.second')}
                </Badge>
                <ArrowRight className="size-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}