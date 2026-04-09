import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { type Specialty } from "../../../shared/data";

interface HospitalMapModalProps {
  specialty: Specialty | null;
  isOpen: boolean;
  onClose: () => void;
}

const MAP_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663362198420/T8T2wZthTUknEzTHtWjSPs/hospital-map-clean-YMUwc3GDnLMGbKj9sk9tJE.webp";

// Colores de módulos para resaltado
const MODULE_COLORS: Record<string, string> = {
  A: "#3B82F6", // Azul
  B: "#8B5CF6", // Púrpura
  C: "#06B6D4", // Cian
  C2: "#06B6D4", // Cian
  D: "#10B981", // Verde
  D2: "#EF4444", // Rojo
  E: "#EC4899", // Rosa
  i1: "#F59E0B", // Ámbar
  i2: "#3B82F6", // Azul
  i3: "#D946EF", // Magenta
};

// Coordenadas aproximadas de cada módulo en el mapa (en porcentaje)
const MODULE_POSITIONS: Record<string, { x: number; y: number; label: string }> = {
  A: { x: 12, y: 25, label: "Módulo A" },
  B: { x: 28, y: 25, label: "Módulo B" },
  C: { x: 40, y: 25, label: "Módulo C" },
  C2: { x: 85, y: 55, label: "Módulo C2" },
  D: { x: 52, y: 25, label: "Módulo D" },
  D2: { x: 50, y: 80, label: "Módulo D2" },
  E: { x: 68, y: 25, label: "Módulo E" },
  i1: { x: 80, y: 25, label: "Módulo i1" },
  i2: { x: 88, y: 25, label: "Módulo i2" },
  i3: { x: 96, y: 25, label: "Módulo i3" },
};

export default function HospitalMapModal({ specialty, isOpen, onClose }: HospitalMapModalProps) {
  const [zoom, setZoom] = useState(100);

  if (!isOpen || !specialty) return null;

  const position = MODULE_POSITIONS[specialty.module];
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
        <div 
          className="px-6 py-4 flex items-center justify-between text-white"
          style={{ backgroundColor: moduleColor }}
        >
          <div>
            <h2 className="text-xl font-bold">{specialty.name}</h2>
            <p className="text-white/80 text-sm">{position?.label}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
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

          {/* Marker Overlay */}
          {position && (
            <div
              className="absolute w-12 h-12 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
            >
              {/* Animated Pulse */}
              <div 
                className="absolute inset-0 rounded-full animate-pulse opacity-75" 
                style={{ backgroundColor: moduleColor }}
              />
              {/* Marker Pin */}
              <div 
                className="absolute inset-0 rounded-full border-4 border-white shadow-lg flex items-center justify-center" 
                style={{ backgroundColor: moduleColor }}
              >
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
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
            💡 Usa los botones de zoom para acercar o alejar el mapa. El marcador resaltado en color indica la ubicación exacta de {specialty.name}.
          </p>
        </div>
      </div>
    </div>
  );
}
