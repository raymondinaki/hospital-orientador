import { useTranslation } from 'react-i18next';
import { Link, useRoute } from 'wouter';
import { useAppStore } from '@/shared/hooks/useAppStore';
import { TipBanner } from '@/features/tips/TipBanner';
import { useTips } from '@/features/tips/useTips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Layers, Map } from 'lucide-react';
import type { Language } from '@shared/types';

export default function ModuleDetail() {
  const { t } = useTranslation();
  const [, params] = useRoute<{ id: string }>('/module/:id');
  const { modules, specialties } = useAppStore();
  const language = useAppStore((state) => state.language);

  const moduleId = params?.id;
  const module = modules.find((m) => m.id === moduleId);

  // Get tips for this module
  const { tips: moduleTips, hasTips } = useTips(moduleId || null);

  if (!module) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">{t('error.notFound')}</h1>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="size-4" />
            {t('common.back')}
          </Button>
        </Link>
      </div>
    );
  }

  const moduleSpecialties = specialties.filter((s) => module.specialties.includes(s.id));

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      {/* Back button */}
      <Link href="/">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="size-4" />
          {t('common.back')}
        </Button>
      </Link>

      {/* Tips for this module */}
      {hasTips && (
        <Card className="mb-6 animate-slide-in-bottom">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              💡 {t('tips.viewDetails')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TipBanner tips={moduleTips} />
          </CardContent>
        </Card>
      )}

      {/* Module Header */}
      <Card
        className="mb-6"
        style={{ borderTopColor: module.color, borderTopWidth: '4px' }}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-2xl">
              {module.name[language as Language] || module.name.es}
            </CardTitle>
            <Badge
              variant="outline"
              style={{ borderColor: module.color }}
              className="text-sm"
            >
              <Layers className="size-3 mr-1" />
              {module.floor === 1 ? t('floors.first') : t('floors.second')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="size-4" />
              <span>{module.location[language as Language] || module.location.es}</span>
            </div>
          </div>
          {/* View on Map button */}
          <div className="mt-4">
            <Link href={`/map?to=${module.id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Map className="size-4" />
                {t('map.viewOnMap')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Specialties List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('modules.specialties')}</CardTitle>
        </CardHeader>
        <CardContent>
          {moduleSpecialties.length === 0 ? (
            <p className="text-muted-foreground">{t('modules.noSpecialties')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {moduleSpecialties.map((specialty) => (
                <Link key={specialty.id} href={`/map?to=${specialty.module}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-3">
                      <p className="font-medium">
                        {specialty.name[language as Language] || specialty.name.es}
                      </p>
                      {specialty.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {specialty.description[language as Language] || specialty.description.es}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}