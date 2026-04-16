import { X, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface EmergencyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMERGENCY_PLAN_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663362198420/T8T2wZthTUknEzTHtWjSPs/ZonasSeguridadHCSBA_cbe745b9.jpg";

export default function EmergencyPlanModal({ isOpen, onClose }: EmergencyPlanModalProps) {
  const [zoom, setZoom] = useState(100);

  if (!isOpen) return null;

  const handleZoom = (direction: "in" | "out") => {
    setZoom((prev) => {
      const newZoom = direction === "in" ? prev + 20 : prev - 20;
      return Math.max(100, Math.min(300, newZoom));
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header con alerta */}
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">Plan de Emergencia y Evacuación</h2>
              <p className="text-red-100 text-sm">Zonas de Seguridad - Hospital Clínico San Borja Arriarán</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Map Container */}
        <div className="relative bg-slate-100 overflow-hidden" style={{ height: "600px" }}>
          {/* Plan Image */}
          <div className="absolute inset-0 flex items-center justify-center overflow-auto">
            <img
              src={EMERGENCY_PLAN_URL}
              alt="Plan de Emergencia y Evacuación"
              className="transition-transform duration-300"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center",
              }}
            />
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2 z-10">
            <button
              onClick={() => handleZoom("in")}
              className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
              title="Zoom in"
            >
              <span className="text-lg font-bold">+</span>
            </button>
            <button
              onClick={() => handleZoom("out")}
              className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
              title="Zoom out"
            >
              <span className="text-lg font-bold">−</span>
            </button>
          </div>

          {/* Zoom Level Display */}
          <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-lg shadow-lg text-sm font-medium text-slate-700">
            {zoom}%
          </div>
        </div>

        {/* Footer with Info */}
        <div className="bg-red-50 px-6 py-4 border-t border-red-200">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-sm text-red-900 font-semibold mb-2">
                ⚠️ En caso de emergencia:
              </p>
              <ul className="text-xs text-red-800 space-y-1">
                <li>• Identifica tu ubicación actual en el plano</li>
                <li>• Dirígete a la zona de seguridad más cercana (marcadas en verde)</li>
                <li>• Sigue las instrucciones del personal de seguridad</li>
                <li>• No uses ascensores durante evacuación</li>
              </ul>
            </div>
            <div className="text-right">
              <p className="text-xs text-red-700 font-medium">
                Teléfono de Emergencia: <br />
                <span className="text-lg font-bold text-red-600">131</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
