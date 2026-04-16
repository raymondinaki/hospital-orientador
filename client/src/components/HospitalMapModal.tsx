import { X } from "lucide-react";
import { type Specialty } from "../../../shared/data";
import DigitalFloorPlan from "./DigitalFloorPlan";
import { hospitalNodes } from "../../../shared/hospitalGraph";

interface HospitalMapModalProps {
  specialty: Specialty | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function HospitalMapModal({ specialty, isOpen, onClose }: HospitalMapModalProps) {
  if (!isOpen || !specialty) return null;

  // Mapear módulo de especialidad a ID del nodo en el grafo
  const graphIdMap: Record<string, string> = {
    A: "modulo_a_inf",
    B: "modulo_b_inf",
    C: "modulo_c_der",
    C2: "modulo_c_der",
    D: "modulo_d_sup",
    D2: "modulo_d2_inf",
    E: "modulo_e_inf",
    i1: "modulo_i1_sup",
    i2: "modulo_i2_inf",
    i3: "modulo_i3_inf",
    Inchijap: "modulo_inchijap_inf",
    Espera: "modulo_espera_inf",
    SUI: "modulo_sui_inf",
    Recaudacion: "modulo_recaudacion_inf",
    EsperaC: "modulo_esperac_inf",
  };

  const highlightNodeId = graphIdMap[specialty.module];

  // Obtener información del nodo
  const highlightedNode = hospitalNodes.find((n) => n.id === highlightNodeId);
  const floor = highlightedNode?.floor || "1er piso";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between text-white">
          <div>
            <h2 className="text-2xl font-bold">{specialty.name}</h2>
            <p className="text-blue-100 text-sm mt-1">
              Módulo {specialty.module} • {floor}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Floor Plan Container */}
        <div className="bg-slate-50 p-6">
          <DigitalFloorPlan highlightModuleId={highlightNodeId} width={900} height={550} />
        </div>

        {/* Footer with Instructions */}
        <div className="bg-blue-50 px-6 py-4 border-t border-blue-200">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                📍 Ubicación: {specialty.name}
              </p>
              <p className="text-xs text-blue-800">
                Usa los controles de zoom para acercarte o alejarte. Arrastra el mapa para desplazarte.
                El módulo {specialty.module} está resaltado en el plano digital.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex-shrink-0"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
