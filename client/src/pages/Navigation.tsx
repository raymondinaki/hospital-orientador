import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import InteractiveMapNavigator from "@/components/InteractiveMapNavigator";
import Three3DNavigator from "@/components/Three3DNavigator";
import Three3DNavigatorAdvanced from "@/components/Three3DNavigatorAdvanced";
import { SPECIALTIES, MODULES, MODULE_COORDINATES } from "@/../../shared/data";
import { MapPin, Navigation as NavigationIcon, Box } from "lucide-react";

interface RoutePoint {
  x: number;
  y: number;
  label: string;
}

export default function Navigation() {
  const [startSpecialty, setStartSpecialty] = useState<string>("");
  const [endSpecialty, setEndSpecialty] = useState<string>("");
  const [startPoint, setStartPoint] = useState<RoutePoint | undefined>();
  const [endPoint, setEndPoint] = useState<RoutePoint | undefined>();
  const [filteredStart, setFilteredStart] = useState<typeof SPECIALTIES>([]);
  const [filteredEnd, setFilteredEnd] = useState<typeof SPECIALTIES>([]);
  const [view3D, setView3D] = useState(false);
  const [view3DAdvanced, setView3DAdvanced] = useState(false);
  const [selectedStartModule, setSelectedStartModule] = useState<string | undefined>();
  const [selectedEndSpecialty, setSelectedEndSpecialty] = useState<any>(null);

  const mapUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310519663362198420/T8T2wZthTUknEzTHtWjSPs/hospital-ground-floor_29f832fc.png";

  // Filtrar especialidades según búsqueda
  const handleStartSearch = (value: string) => {
    setStartSpecialty(value);
    if (value.length > 0) {
      setFilteredStart(
        SPECIALTIES.filter((s: typeof SPECIALTIES[0]) =>
          s.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredStart([]);
    }
  };

  const handleEndSearch = (value: string) => {
    setEndSpecialty(value);
    if (value.length > 0) {
      setFilteredEnd(
        SPECIALTIES.filter((s: typeof SPECIALTIES[0]) =>
          s.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setFilteredEnd([]);
    }
  };

  // Seleccionar especialidad de inicio
  const selectStartSpecialty = (specialty: typeof SPECIALTIES[0]) => {
    const module = MODULES.find((m: typeof MODULES[0]) => m.id === specialty.module);
    const coords = MODULE_COORDINATES[specialty.module];
    if (coords) {
      setStartPoint({
        x: coords.x,
        y: coords.y,
        label: `${specialty.name} (${module?.name})`,
      });
      setStartSpecialty(specialty.name);
      setSelectedStartModule(specialty.module);
      setFilteredStart([]);
    }
  };

  // Seleccionar especialidad de destino
  const selectEndSpecialty = (specialty: typeof SPECIALTIES[0]) => {
    const module = MODULES.find((m: typeof MODULES[0]) => m.id === specialty.module);
    const coords = MODULE_COORDINATES[specialty.module];
    if (coords) {
      setEndPoint({
        x: coords.x,
        y: coords.y,
        label: `${specialty.name} (${module?.name})`,
      });
      setEndSpecialty(specialty.name);
      setSelectedEndSpecialty(specialty);
      setFilteredEnd([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <NavigationIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">Navegación Interactiva</h1>
        </div>
          <p className="text-gray-600">Busca tu ruta dentro del hospital</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel de búsqueda */}
          <div className="lg:col-span-1 space-y-4">
            {/* Punto de inicio */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  Punto de Inicio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Input
                  placeholder="Buscar especialidad..."
                  value={startSpecialty}
                  onChange={(e) => handleStartSearch(e.target.value)}
                  className="text-sm"
                />
                {filteredStart.length > 0 && (
                  <div className="border rounded-lg max-h-40 overflow-y-auto">
                    {filteredStart.map((specialty: typeof SPECIALTIES[0]) => (
                      <button
                        key={specialty.id}
                        onClick={() => selectStartSpecialty(specialty)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm border-b last:border-b-0"
                      >
                        <div className="font-medium">{specialty.name}</div>
                        <div className="text-xs text-gray-500">{specialty.module}</div>
                      </button>
                    ))}
                  </div>
                )}
                {startPoint && (
                  <div className="p-2 bg-green-50 rounded text-sm text-green-700">
                    ✓ {startPoint.label}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Punto de destino */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  Punto de Destino
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Input
                  placeholder="Buscar especialidad..."
                  value={endSpecialty}
                  onChange={(e) => handleEndSearch(e.target.value)}
                  className="text-sm"
                />
                {filteredEnd.length > 0 && (
                  <div className="border rounded-lg max-h-40 overflow-y-auto">
                    {filteredEnd.map((specialty: typeof SPECIALTIES[0]) => (
                      <button
                        key={specialty.id}
                        onClick={() => selectEndSpecialty(specialty)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm border-b last:border-b-0"
                      >
                        <div className="font-medium">{specialty.name}</div>
                        <div className="text-xs text-gray-500">{specialty.module}</div>
                      </button>
                    ))}
                  </div>
                )}
                {endPoint && (
                  <div className="p-2 bg-red-50 rounded text-sm text-red-700">
                    ✓ {endPoint.label}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setStartPoint(undefined);
                  setEndPoint(undefined);
                  setStartSpecialty("");
                  setEndSpecialty("");
                  setSelectedStartModule(undefined);
                  setSelectedEndSpecialty(null);
                }}
              >
                Limpiar
              </Button>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                onClick={() => setView3D(!view3D)}
                disabled={!startPoint || !endPoint}
              >
                <Box className="w-4 h-4" />
                {view3D ? "Vista 2D" : "Vista 3D"}
              </Button>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                onClick={() => setView3DAdvanced(!view3DAdvanced)}
                disabled={!startPoint || !endPoint}
              >
                <Box className="w-4 h-4" />
                {view3DAdvanced ? "Cerrar 3D" : "Vista 3D Avanzada"}
              </Button>
            </div>
          </div>

          {/* Mapa interactivo */}
          <div className="lg:col-span-3">
            {view3DAdvanced ? (
              <Card>
                <CardHeader>
                  <CardTitle>Navegación 3D Avanzada</CardTitle>
                </CardHeader>
                <CardContent>
                  <Three3DNavigatorAdvanced
                    startModuleId={selectedStartModule}
                    endModuleId={selectedEndSpecialty?.module}
                  />
                </CardContent>
              </Card>
            ) : view3D ? (
              <Three3DNavigator
                origin={selectedStartModule}
                destination={selectedEndSpecialty}
                isOpen={view3D}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Mapa del Hospital - 1er Piso</CardTitle>
                </CardHeader>
                <CardContent>
                  <InteractiveMapNavigator
                    mapUrl={mapUrl}
                    startPoint={startPoint}
                    endPoint={endPoint}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Información adicional */}
        {startPoint && endPoint && (
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-700">
                <strong>Ruta calculada:</strong> Desde {startPoint.label} hasta {endPoint.label}
              </p>
              <p className="text-xs text-gray-600 mt-2">
                Sigue la línea punteada azul en el mapa para navegar. Usa los botones de zoom para explorar en detalle.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
