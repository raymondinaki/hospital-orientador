import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Layers, ChevronRight, X, Map } from "lucide-react";
import { MODULES, type Specialty } from "../../../shared/data";
import { useState } from "react";

interface SpecialtyDetailProps {
  specialty: Specialty | null;
  onClose: () => void;
  onShowMap?: (specialty: Specialty) => void;
}

export default function SpecialtyDetail({ specialty, onClose, onShowMap }: SpecialtyDetailProps) {
  if (!specialty) return null;

  const module = MODULES.find((m) => m.id === specialty.module);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{specialty.name}</h2>
              {specialty.description && (
                <p className="text-sm text-muted-foreground mt-2">{specialty.description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-accent rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Module Info */}
          {module && (
            <div
              className="p-4 rounded-lg text-white space-y-3"
              style={{ backgroundColor: module.color }}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                <span className="font-semibold">{module.name}</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{module.floor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{module.location}</span>
                </div>
              </div>
            </div>
          )}

          {/* Location Info */}
          <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground">Ubicación</div>
            <div className="space-y-2">
              <button
                onClick={() => onShowMap?.(specialty)}
                className="flex items-center justify-between gap-3 p-3 bg-accent rounded-lg hover:bg-accent/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1">
                  <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">{specialty.floor}</div>
                    <div className="text-xs text-muted-foreground">Piso / Zona</div>
                  </div>
                </div>
                <Map className="w-4 h-4 text-primary flex-shrink-0" />
              </button>
              <button
                onClick={() => onShowMap?.(specialty)}
                className="flex items-center justify-between gap-3 p-3 bg-accent rounded-lg hover:bg-accent/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 flex-1">
                  <Building2 className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">Módulo {specialty.module}</div>
                    <div className="text-xs text-muted-foreground">Sección del hospital</div>
                  </div>
                </div>
                <Map className="w-4 h-4 text-primary flex-shrink-0" />
              </button>
            </div>
          </div>

          {/* Other Specialties in Module */}
          {module && module.specialties.length > 1 && (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground">
                Otras especialidades en {module.name}
              </div>
              <div className="flex flex-wrap gap-2">
                {module.specialties.slice(0, 5).map((specId) => (
                  <Badge key={specId} variant="secondary" className="text-xs">
                    {specId}
                  </Badge>
                ))}
                {module.specialties.length > 5 && (
                  <Badge variant="secondary" className="text-xs">
                    +{module.specialties.length - 5} más
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => onShowMap?.(specialty)}
              className="w-full bg-primary text-primary-foreground hover:opacity-90"
            >
              <Map className="w-4 h-4 mr-2" />
              Ver Mapa
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
