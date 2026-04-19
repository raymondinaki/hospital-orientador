import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearch } from 'wouter';
import { Link } from 'wouter';
import { useAppStore } from '@/shared/hooks/useAppStore';
import { HospitalMap } from './HospitalMap';
import { FloorSwitcher } from './FloorSwitcher';
import { TipBanner } from '@/features/tips/TipBanner';
import { useTips } from '@/features/tips/useTips';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Layers, X, Navigation } from 'lucide-react';
import type { Language } from '@shared/types';

export default function MapPage() {
  const { t } = useTranslation();
  const searchParams = useSearch();

  const {
    modules,
    specialties,
    selectedFloor,
    selectedModule,
    routeOrigin,
    routeDestination,
    setFloor,
    setSelectedModule,
    setRoute,
    clearRoute,
  } = useAppStore();

  const language = useAppStore((state) => state.language);

  // Get tips for selected module
  const { paymentTips, hoursTips, instructionTips, emergencyTips, hasTips } = useTips(selectedModule);

  // Use a ref to track if URL params were already applied to prevent double renders
  const paramsApplied = useRef(false);

  // Parse URL search params
  useEffect(() => {
    if (paramsApplied.current) return;
    const params = new URLSearchParams(searchParams);
    const from = params.get('from');
    const to = params.get('to');

    if (from || to) {
      setRoute(from || null, to || null);

      // Auto-switch floor if destination is on different floor
      if (to) {
        const destModule = modules.find((m) => m.id === to);
        if (destModule && destModule.floor !== selectedFloor) {
          setFloor(destModule.floor);
        }
      }
      paramsApplied.current = true;
    }
  }, [searchParams, modules, selectedFloor, setRoute, setFloor]);

  // Get selected module data
  const selectedModuleData = useMemo(() => {
    if (!selectedModule) return null;
    return modules.find((m) => m.id === selectedModule) || null;
  }, [modules, selectedModule]);

  const selectedModuleSpecialties = useMemo(() => {
    if (!selectedModuleData) return [];
    return specialties.filter((s) => selectedModuleData.specialties.includes(s.id));
  }, [specialties, selectedModuleData]);

  // Group specialties by floor for sidebar display
  const specialtiesByFloor = useMemo(() => {
    if (!selectedModuleSpecialties.length) return { 1: [], 2: [] };
    const grouped = selectedModuleSpecialties.reduce(
      (acc, s) => {
        const floor = s.floor;
        if (!acc[floor]) acc[floor] = [];
        acc[floor].push(s);
        return acc;
      },
      {} as Record<number, typeof selectedModuleSpecialties>
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
  }, [selectedModuleSpecialties, language]);

  // Get route modules
  const originModule = useMemo(() => {
    if (!routeOrigin) return null;
    return modules.find((m) => m.id === routeOrigin) || null;
  }, [modules, routeOrigin]);

  const destModule = useMemo(() => {
    if (!routeDestination) return null;
    return modules.find((m) => m.id === routeDestination) || null;
  }, [modules, routeDestination]);

  // Check if route spans floors
  const routeSpansFloors = useMemo(() => {
    if (!originModule || !destModule) return false;
    return originModule.floor !== destModule.floor;
  }, [originModule, destModule]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="size-4" />
                  {t('common.back')}
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">{t('map.floorSelector')}</h1>
            </div>
            <FloorSwitcher />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div
                  id="floor-map"
                  role="application"
                  aria-label={`${t('accessibility.floorMap')}: ${selectedFloor === 1 ? t('map.floor1') : t('map.floor2')}`}
                  className="relative aspect-[1000/600] bg-muted/30 animate-fade-in"
                  data-map-container
                >
                  <HospitalMap />
                </div>
              </CardContent>
            </Card>

            {/* Tips for selected module */}
            {selectedModule && hasTips && (
              <Card className="animate-slide-in-bottom">
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

            {/* Route info bar */}
            {routeOrigin && routeDestination && (
              <Card className="animate-fade-in">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      {/* Origin */}
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: originModule?.color || '#22c55e' }}
                        />
                        <span className="text-sm">
                          <span className="text-muted-foreground">{t('map.routeFrom')}: </span>
                          <span className="font-medium">{originModule?.name[language as Language] || originModule?.name.es}</span>
                        </span>
                      </div>

                      <Navigation className="size-4 text-muted-foreground" />

                      {/* Destination */}
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: destModule?.color || '#ef4444' }}
                        />
                        <span className="text-sm">
                          <span className="text-muted-foreground">{t('map.routeTo')}: </span>
                          <span className="font-medium">{destModule?.name[language as Language] || destModule?.name.es}</span>
                        </span>
                      </div>

                      {/* Stairs indicator if cross-floor */}
                      {routeSpansFloors && (
                        <Badge variant="outline" className="gap-1">
                          <Layers className="size-3" />
                          {t('map.stairsIndicator')}
                        </Badge>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRoute}
                      className="gap-2 text-muted-foreground"
                    >
                      <X className="size-4" />
                      {t('map.clearRoute')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <p className="text-sm text-muted-foreground text-center">
              {t('map.instructions')}
            </p>
          </div>

          {/* Sidebar - Module Details */}
          <div className="space-y-4">
            {selectedModuleData ? (
              <Card className="animate-fade-in" style={{ borderTopColor: selectedModuleData.color, borderTopWidth: '4px' }}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">
                      {selectedModuleData.name[language as Language] || selectedModuleData.name.es}
                    </CardTitle>
                    <Badge variant="outline" style={{ borderColor: selectedModuleData.color }}>
                      <Layers className="size-3 mr-1" />
                      {selectedModuleData.floor === 1 ? t('floors.first') : t('floors.second')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3" />
                    {selectedModuleData.location[language as Language] || selectedModuleData.location.es}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{t('modules.allSpecialtiesForModule')}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {selectedModuleSpecialties.length}
                      </Badge>
                    </div>
                    {selectedModuleSpecialties.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t('modules.noSpecialties')}</p>
                    ) : (
                      <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1">
                        {[1, 2].map((floor) => {
                          const floorSpecialties = specialtiesByFloor[floor] || [];
                          if (floorSpecialties.length === 0) return null;
                          return (
                            <div key={floor}>
                              <div className="flex items-center gap-2 mb-2 sticky top-0 bg-background/95 backdrop-blur py-1 z-10">
                                <Badge variant="outline" className="text-xs">
                                  {floor === 1 ? t('floors.first') : t('floors.second')}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {t('map.specialtiesOnFloor', { count: floorSpecialties.length })}
                                </span>
                              </div>
                              <div className="space-y-1">
                                {floorSpecialties.map((specialty) => (
                                  <Link key={specialty.id} href={`/module/${selectedModuleData.id}`}>
                                    <div className="text-sm p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                                      <span className="font-medium">
                                        {specialty.name[language as Language] || specialty.name.es}
                                      </span>
                                      {specialty.description && (
                                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                          {specialty.description[language as Language] || specialty.description.es}
                                        </p>
                                      )}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="pt-2 border-t">
                      <Link href={`/module/${selectedModuleData.id}`}>
                        <Button variant="outline" className="w-full gap-2">
                          <MapPin className="size-4" />
                          {t('modules.moduleDetails')}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="animate-fade-in">
                <CardContent className="py-12 text-center">
                  <MapPin className="size-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">{t('modules.selectModule')}</p>
                </CardContent>
              </Card>
            )}

            {/* Quick module list */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{t('modules.title')}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {modules
                  .filter((m) => m.floor === selectedFloor)
                  .map((module) => (
                    <button
                      key={module.id}
                      onClick={() => setSelectedModule(module.id)}
                      className={`
                        p-2 rounded-md text-left text-sm transition-all
                        ${selectedModule === module.id
                          ? 'bg-primary/10 border border-primary/30'
                          : 'hover:bg-muted/50 border border-transparent'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: module.color }}
                        />
                        <span className="truncate">
                          {module.name[language as Language] || module.name.es}
                        </span>
                      </div>
                    </button>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}