import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { type Specialty } from "../../../shared/data";

interface HospitalMapModalProps {
  specialty: Specialty | null;
  isOpen: boolean;
  onClose: () => void;
}

const MAP_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663362198420/T8T2wZthTUknEzTHtWjSPs/hospital-map-clean_9278f0da.jpg";

// Colores de módulos para resaltado (coinciden con MODULES en data.ts)
const MODULE_COLORS: Record<string, string> = {
  A: "#2E86C1", // Azul
  B: "#8E44AD", // Púrpura
  C: "#CA6F1E", // Naranja
  C2: "#C0392B", // Rojo
  D: "#1E8449", // Verde
  D2: "#117A65", // Verde oscuro
  E: "#D4AC0D", // Oro
  i1: "#6C3483", // Púrpura oscuro
  i2: "#1A5276", // Azul oscuro
  i3: "#922B21", // Rojo oscuro
};

// Áreas de cada módulo en el mapa (en porcentaje: x, y, width, height)
const MODULE_AREAS: Record<string, { x: number; y: number; width: number; height: number; label: string }> = {
  A: { x: 43, y: 38, width: 10, height: 32, label: "Módulo A" },
  B: { x: 26, y: 38, width: 10, height: 32, label: "Módulo B" },
  C: { x: 76, y: 38, width: 12, height: 32, label: "Módulo C y C2" },
  C2: { x: 76, y: 38, width: 12, height: 32, label: "Módulo C2" },
  D: { x: 36, y: 38, width: 10, height: 32, label: "Módulo D" },
  D2: { x: 18, y: 72, width: 28, height: 10, label: "Módulo D2" },
  E: { x: 55, y: 38, width: 10, height: 32, label: "Módulo E" },
  i1: { x: 5, y: 8, width: 12, height: 20, label: "Módulo i1" },
  i2: { x: 21, y: 8, width: 12, height: 20, label: "Módulo i2" },
  i3: { x: 5, y: 38, width: 12, height: 32, label: "Módulo i3" },
};

export default function HospitalMapModal({ specialty, isOpen, onClose }: HospitalMapModalProps) {
  const [zoom, setZoom] = useState(100);

  if (!isOpen || !specialty) return null;

  const area = MODULE_AREAS[specialty.module];
  const moduleColor = MODULE_COLORS[specialty.module] || "#3B82F6";

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => {
      const newZoom = direction === "in" ? prev + 20 : prev - 20;
      return Math.max(100, Math.min(300, newZoom));
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800 px-6 py-4 flex items-center justify-between text-white">
          <div>
            <h2 className="text-xl font-bold">{specialty.name}</h2>
            <p className="text-slate-300 text-sm">{area?.label}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Map Container */}
        <div className="relative bg-slate-100 overflow-hidden" style={{ height: "500px" }}>
          {/* Map Image */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={MAP_URL}
              alt="Mapa del Hospital"
              className="h-full w-full object-contain transition-transform duration-300"
              style={{
                transform: `scale(${zoom / 100})`,
              }}
            />
          </div>

          {/* Module Area Highlight - Filled */}
          {area && (
            <div
              className="absolute pointer-events-none transition-all duration-300"
              style={{
                left: `${area.x}%`,
                top: `${area.y}%`,
                width: `${area.width}%`,
                height: `${area.height}%`,
                backgroundColor: moduleColor,
                opacity: 0.35,
                boxShadow: `inset 0 0 0 2px ${moduleColor}`,
              }}
            />
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-10">
            <button
              onClick={() => handleZoom("in")}
              className="p-2 bg-white rounded-lg shadow-md hover:bg-slate-50 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-5 h-5 text-slate-700" />
            </button>
            <button
              onClick={() => handleZoom("out")}
              className="p-2 bg-white rounded-lg shadow-md hover:bg-slate-50 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          {/* Zoom Level Display */}
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-lg shadow-md text-sm font-semibold text-slate-700">
            {zoom}%
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-slate-600 uppercase">Ubicación</div>
              <div className="text-sm font-medium text-slate-900">{specialty.floor}</div>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <div className="text-xs font-semibold text-slate-600 uppercase">Módulo</div>
                <div className="text-sm font-medium text-slate-900">{specialty.module}</div>
              </div>
              <div 
                className="w-8 h-8 rounded border-2 border-slate-300 shadow-sm" 
                style={{ backgroundColor: moduleColor }}
              />
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3">
            💡 Usa los botones de zoom para acercar o alejar el mapa. El área resaltada indica la ubicación exacta de {specialty.name}.
          </p>
        </div>
      </div>
    </div>
  );
}
