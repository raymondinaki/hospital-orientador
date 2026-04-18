import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SPECIALTIES, MODULES } from "../../../shared/data";

interface QuickAccessProps {
  onSelectSpecialty: (specialty: typeof SPECIALTIES[0]) => void;
}

export default function QuickAccess({ onSelectSpecialty }: QuickAccessProps) {
  // Mostrar algunas especialidades populares
  const popularSpecialties = [
    SPECIALTIES.find((s) => s.id === "ped"),
    SPECIALTIES.find((s) => s.id === "oftalmologia"),
    SPECIALTIES.find((s) => s.id === "cardio-adult"),
    SPECIALTIES.find((s) => s.id === "trauma-adult"),
    SPECIALTIES.find((s) => s.id === "orl"),
    SPECIALTIES.find((s) => s.id === "gine-general"),
  ].filter(Boolean);

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-slate-700">Especialidades Populares</div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {popularSpecialties.map((specialty) => {
          if (!specialty) return null;
          const module = MODULES.find((m) => m.id === specialty.module);
          return (
            <button
              key={specialty.id}
              onClick={() => onSelectSpecialty(specialty)}
              className="p-3 rounded-lg border border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <div className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {specialty.name}
              </div>
              <Badge
                className="text-xs mt-2 text-white"
                style={{ backgroundColor: module?.color }}
              >
                {specialty.module}
              </Badge>
            </button>
          );
        })}
      </div>
    </div>
  );
}
