import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { MODULES, type Specialty } from "../../../shared/data";

interface RecentSpecialtiesProps {
  specialties: Specialty[];
  onSelect: (specialty: Specialty) => void;
}

export default function RecentSpecialties({ specialties, onSelect }: RecentSpecialtiesProps) {
  if (specialties.length === 0) return null;

  return (
    <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-amber-600" />
        <h3 className="font-semibold text-slate-900">Búsquedas Recientes</h3>
      </div>
      <div className="space-y-2">
        {specialties.slice(0, 5).map((specialty) => {
          const module = MODULES.find((m) => m.id === specialty.module);
          return (
            <button
              key={specialty.id}
              onClick={() => onSelect(specialty)}
              className="w-full text-left p-3 rounded-lg bg-white hover:bg-amber-50 border border-amber-100 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 truncate">{specialty.name}</div>
                  <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{specialty.floor}</span>
                  </div>
                </div>
                <Badge
                  className="text-white flex-shrink-0"
                  style={{ backgroundColor: module?.color }}
                >
                  {specialty.module}
                </Badge>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
