import { useMemo } from 'react';
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
  const { paymentTips, hoursTips, instructionTips, emergencyTips, hasTips } = useTips(moduleId || null);

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

  const moduleSpecialties = useMemo(() => {
    return specialties.filter((s) => module.specialties.includes(s.id));
  }, [specialties, module]);

  // Group specialties by floor
  const specialtiesByFloor = useMemo(() => {
    if (!moduleSpecialties.length) return { 1: [], 2: [] };
    const grouped = moduleSpecialties.reduce(
      (acc, s) => {
        const floor = s.floor;
        if (!acc[floor]) acc[floor] = [];
        acc[floor].push(s);
        return acc;
      },
      {} as Record<number, typeof moduleSpecialties>
    );
    // Sort alphabetically by name in current language
    Object.keys(grouped).forEach((floor) => {
      grouped[Number(floor)].sort((a, b) => {
        const nameA = a.name[language as Language] || a.name.es || '';
        const nameB = b.name[language as Language] || b.name.es || '';
        return nameA.localeCompare(nameB);
      });
    });
    return grouped;
  }, [moduleSpecialties, language]);

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
            <TipBanner
              paymentTips={paymentTips}
              hoursTips={hoursTips}
              instructionTips={instructionTips}
              emergencyTips={emergencyTips}
            />
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{t('modules.specialties')}</CardTitle>
            <Badge variant="secondary">
              {t('modules.specialtiesCount', { count: moduleSpecialties.length })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {moduleSpecialties.length === 0 ? (
            <p className="text-muted-foreground">{t('modules.noSpecialties')}</p>
          ) : (
            <div className="space-y-6">
              {[1, 2].map((floor) => {
                const floorSpecialties = specialtiesByFloor[floor] || [];
                if (floorSpecialties.length === 0) return null;
                return (
                  <div key={floor} className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <Badge variant="outline" style={{ borderColor: module.color }}>
                        {floor === 1 ? t('floors.first') : t('floors.second')}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {t('modules.specialtiesOnFloor', {
                          count: floorSpecialties.length,
                          floor: floor === 1 ? t('floors.first') : t('floors.second'),
                        })}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {floorSpecialties.map((specialty) => (
                        <Link key={specialty.id} href={`/map?to=${specialty.module}`}>
                          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium">
                                    {specialty.name[language as Language] || specialty.name.es}
                                  </p>
                                  {specialty.description && (
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                      {specialty.description[language as Language] || specialty.description.es}
                                    </p>
                                  )}
                                </div>
                                <Badge variant="secondary" className="text-xs shrink-0">
                                  {floor === 1 ? t('floors.first') : t('floors.second')}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}