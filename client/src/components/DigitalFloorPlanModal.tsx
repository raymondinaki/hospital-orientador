import { X } from "lucide-react";
import { type Specialty } from "../../../shared/data";
import { hospitalNodes } from "../../../shared/hospitalGraph";
import DigitalFloorPlan from "./DigitalFloorPlan";

interface DigitalFloorPlanModalProps {
  specialty: Specialty | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DigitalFloorPlanModal({
  specialty,
  isOpen,
  onClose,
}: DigitalFloorPlanModalProps) {
  if (!isOpen || !specialty) return null;

  // Mapear módulo de especialidad a ID del nodo en el grafo
  const graphIdMap: Record<string, string> = {
    A: "modulo_a_inf",
    B: "modulo_b_inf",
    C: "modulo_c_der",
    C2: "modulo_c_der",
    D: "modulo_d_sup",
    D2: "modulo_d_sup",
    E: "modulo_e_inf",
    i1: "modulo_i1_sup",
    i2: "modulo_i2_inf",
    i3: "modulo_i3_inf",
    Inchijap: "inchijap_inf",
    Espera: "sala_espera_inf",
    SUI: "sui_inf",
    Recaudacion: "recaudacion_inf",
    EsperaC: "espera_c_inf",
  };

  const highlightNodeId = graphIdMap[specialty.module];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between text-white sticky top-0">
          <div>
            <h2 className="text-2xl font-bold">Mapa Digital del Hospital</h2>
            <p className="text-blue-100 text-sm mt-1">
              Módulo {specialty.module} • {specialty.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Digital Floor Plan */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          <DigitalFloorPlan
            highlightModuleId={highlightNodeId}
            width={1000}
            height={700}
          />
        </div>

        {/* Footer */}
        <div className="bg-blue-50 px-6 py-4 border-t border-blue-200 sticky bottom-0">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-800">
              Haz clic en los módulos para ver especialidades • Doble clic para zoom • Arrastra para mover
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
