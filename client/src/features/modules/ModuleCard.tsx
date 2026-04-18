import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/shared/hooks/useAppStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import type { Language } from '@shared/types';
import type { Module } from '@shared/types';
import { memo } from 'react';

interface ModuleCardProps {
  module: Module;
  index: number;
}

export const ModuleCard = memo(function ModuleCard({ module, index }: ModuleCardProps) {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);

  return (
    <Link href={`/module/${module.id}`}>
      <Card
        className="hover:shadow-lg transition-all cursor-pointer h-full animate-pop"
        style={{
          borderLeftColor: module.color,
          borderLeftWidth: '4px',
          animationDelay: `${index * 50}ms`,
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg">
              {module.name[language as Language] || module.name.es}
            </h3>
            <MapPin className="size-4 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" style={{ borderColor: module.color }}>
                {module.floor === 1 ? t('floors.first') : t('floors.second')}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {module.specialties.length} {t('specialties.title').toLowerCase()}
              </span>
            </div>

            <p className="text-sm text-muted-foreground">
              {module.location[language as Language] || module.location.es}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});