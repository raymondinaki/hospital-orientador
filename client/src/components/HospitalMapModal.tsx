import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useState } from "react";
import { type Specialty } from "../../../shared/data";

interface HospitalMapModalProps {
  specialty: Specialty | null;
  isOpen: boolean;
  onClose: () => void;
}

const MAP_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663362198420/T8T2wZthTUknEzTHtWjSPs/hospital-map-hd-ECmykUqMvvnapXzynS4rvW.webp";

// Coordenadas aproximadas de cada módulo en el mapa (en porcentaje)
const MODULE_POSITIONS: Record<string, { x: number; y: number; label: string }> = {
  A: { x: 35, y: 12, label: "Módulo A" },
  B: { x: 35, y: 22, label: "Módulo B" },
  C: { x: 35, y: 32, label: "Módulo C" },
  C2: { x: 35, y: 42, label: "Módulo C2" },
  D: { x: 35, y: 58, label: "Módulo D" },
  D2: { x: 35, y: 68, label: "Módulo D2" },
  E: { x: 35, y: 78, label: "Módulo E" },
  i1: { x: 75, y: 22, label: "Módulo i1" },
  i2: { x: 75, y: 32, label: "Módulo i2" },
  i3: { x: 75, y: 42, label: "Módulo i3" },
};

export default function HospitalMapModal({ specialty, isOpen, onClose }: HospitalMapModalProps) {
  const [zoom, setZoom] = useState(100);

  if (!isOpen || !specialty) return null;

  const position = MODULE_POSITIONS[specialty.module];

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
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{specialty.name}</h2>
            <p className="text-blue-100 text-sm">{position?.label}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
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
              <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse opacity-75" />
              {/* Marker Pin */}
              <div className="absolute inset-0 bg-red-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
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
            <div>
              <div className="text-xs font-semibold text-slate-600 uppercase">Módulo</div>
              <div className="text-sm font-medium text-slate-900">{specialty.module}</div>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-3">
            💡 Usa los botones de zoom para acercar o alejar el mapa. El marcador rojo indica la ubicación exacta de {specialty.name}.
          </p>
        </div>
      </div>
    </div>
  );
}
