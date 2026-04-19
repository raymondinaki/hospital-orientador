import { X } from "lucide-react";
import { type Specialty } from "../../../shared/data";
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
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
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

        {/* Content */}
        <div className="bg-slate-50 p-6">
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-2">📍 Ubicación</h3>
              <p className="text-gray-700">
                <span className="font-medium">Módulo:</span> {specialty.module}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Piso:</span> {floor}
              </p>
            </div>

            {specialty.description && (
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">ℹ️ Descripción</h3>
                <p className="text-gray-700">{specialty.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-blue-50 px-6 py-4 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-800">
              Dirígete al módulo {specialty.module} para acceder a {specialty.name}
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
