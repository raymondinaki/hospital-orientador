import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Layers, Info, MapPin, Building2, Clock, X, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import SpecialtySearch from "@/components/SpecialtySearch";
import SpecialtyDetail from "@/components/SpecialtyDetail";
import ModuleGrid from "@/components/ModuleGrid";
import QuickAccess from "@/components/QuickAccess";
import RecentSpecialties from "@/components/RecentSpecialties";
import DigitalFloorPlanModal from "@/components/DigitalFloorPlanModal";

import SecurityZonesMap from "@/components/SecurityZonesMap";
import { MODULES, SPECIALTIES, type Specialty, type Module } from "../../../shared/data";

export default function Home() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [activeTab, setActiveTab] = useState("search");
  const [recentSpecialties, setRecentSpecialties] = useState<Specialty[]>([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapSpecialty, setMapSpecialty] = useState<Specialty | null>(null);

  const [showSecurityZones, setShowSecurityZones] = useState(false);

  const handleSelectSpecialty = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setRecentSpecialties((prev) => {
      const filtered = prev.filter((s) => s.id !== specialty.id);
      return [specialty, ...filtered].slice(0, 5);
    });
  };

  const handleShowMap = (specialty: Specialty) => {
    setMapSpecialty(specialty);
    setShowMapModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />

      {/* Hero Section */}
      <section className="container py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Encuentra especialidades rápidamente
          </h2>
          <p className="text-lg text-slate-600">
            Herramienta diseñada para orientadores: busca, localiza y accede a la información de todas las especialidades del hospital en segundos.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/navigation" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              <MapPin className="w-5 h-5" />
              Ver Navegación Interactiva
            </a>

            <button onClick={() => setShowSecurityZones(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              <MapPin className="w-5 h-5" />
              Zonas de Seguridad
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container pb-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100 p-1">
            <TabsTrigger value="search" className="flex items-center gap-2 data-[state=active]:bg-white">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Buscar</span>
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center gap-2 data-[state=active]:bg-white">
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Módulos</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2 data-[state=active]:bg-white">
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">Información</span>
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card className="p-6 md:p-8 shadow-lg border-blue-100">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Buscar Especialidad</h2>
                <p className="text-slate-600 mt-2">
                  Escribe el nombre de la especialidad que buscas para obtener su ubicación exacta
                </p>
              </div>
              <SpecialtySearch onSelectSpecialty={handleSelectSpecialty} />
              {recentSpecialties.length > 0 && (
                <div className="mt-8 pt-8 border-t border-blue-100">
                  <RecentSpecialties specialties={recentSpecialties} onSelect={handleSelectSpecialty} />
                </div>
              )}
              <div className="mt-8 pt-8 border-t border-blue-100">
                <QuickAccess onSelectSpecialty={handleSelectSpecialty} />
              </div>
            </Card>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <Card className="p-6 md:p-8 shadow-lg border-blue-100">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Módulos del Hospital</h2>
                <p className="text-slate-600 mt-2">
                  Explora todos los módulos disponibles y sus especialidades
                </p>
              </div>
              <ModuleGrid onSelectModule={setSelectedModule} />
              <div className="mt-8 pt-8 border-t border-blue-100">
                <QuickAccess onSelectSpecialty={handleSelectSpecialty} />
              </div>
            </Card>
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stats */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-slate-700">Total de Módulos</span>
                  </div>
                  <div className="text-4xl font-bold text-blue-600">{MODULES.length}</div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-slate-700">Especialidades</span>
                  </div>
                  <div className="text-4xl font-bold text-purple-600">
                    {MODULES.reduce((sum, m) => sum + m.specialties.length, 0)}
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 shadow-md">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-teal-600" />
                    <span className="text-sm font-semibold text-slate-700">Ubicaciones</span>
                  </div>
                  <div className="text-4xl font-bold text-teal-600">3</div>
                  <p className="text-xs text-slate-600">Planta Baja, 1er y 2do Piso</p>
                </div>
              </Card>
            </div>

            {/* Module Legend */}
            <Card className="p-6 md:p-8 shadow-lg border-blue-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Leyenda de Módulos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {MODULES.map((module) => (
                  <button
                    key={module.id}
                    onClick={() => {
                      setSelectedModule(module);
                      setActiveTab("modules");
                    }}
                    className="text-left p-4 rounded-lg border-2 transition-all hover:shadow-md"
                    style={{
                      borderColor: module.color,
                      backgroundColor: module.color + "10",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-md flex-shrink-0"
                        style={{ backgroundColor: module.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900">{module.name}</div>
                        <div className="text-xs text-slate-600">{module.floor}</div>
                      </div>
                      <Badge className="text-xs flex-shrink-0" style={{ backgroundColor: module.color }}>
                        {module.specialties.length}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Quick Tips */}
            <Card className="p-6 md:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Consejos de Uso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Busca por nombre</div>
                    <p className="text-sm text-slate-600">Escribe el nombre completo o parcial de la especialidad</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Filtra por módulo</div>
                    <p className="text-sm text-slate-600">Usa los filtros para ver especialidades de un módulo específico</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Consulta detalles</div>
                    <p className="text-sm text-slate-600">Haz clic en cualquier especialidad para ver su ubicación completa</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">Explora módulos</div>
                    <p className="text-sm text-slate-600">Accede a la pestaña Módulos para ver todas las especialidades de cada sección</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Detail Modal */}
      <SpecialtyDetail
        specialty={selectedSpecialty}
        onClose={() => setSelectedSpecialty(null)}
        onShowMap={handleShowMap}
      />

      {/* Digital Floor Plan Modal */}
      <DigitalFloorPlanModal
        specialty={mapSpecialty}
        isOpen={showMapModal}
        onClose={() => {
          setShowMapModal(false);
          setMapSpecialty(null);
        }}
      />

      {/* Security Zones Map Modal */}
      <SecurityZonesMap
        isOpen={showSecurityZones}
        onClose={() => setShowSecurityZones(false)}
      />

      {/* Module Detail Modal */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <Card className="w-full max-w-md shadow-2xl border-0">
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900">{selectedModule.name}</h2>
                  <p className="text-sm text-slate-600 mt-1">{selectedModule.floor}</p>
                </div>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div
                className="p-4 rounded-lg text-white space-y-2"
                style={{ backgroundColor: selectedModule.color }}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span className="font-semibold">{selectedModule.location}</span>
                </div>
                <div className="text-sm opacity-90">
                  {selectedModule.specialties.length} especialidades disponibles
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-semibold text-slate-900">Especialidades</div>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {selectedModule.specialties.map((specId) => (
                    <Badge key={specId} variant="secondary" className="text-xs">
                      {specId}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setSelectedModule(null)}
                className="w-full"
                style={{ backgroundColor: selectedModule.color }}
              >
                Cerrar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
