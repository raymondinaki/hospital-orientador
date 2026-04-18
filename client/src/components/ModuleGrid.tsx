import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin } from "lucide-react";
import { MODULES, type Module } from "../../../shared/data";

interface ModuleGridProps {
  onSelectModule: (module: Module) => void;
}

export default function ModuleGrid({ onSelectModule }: ModuleGridProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-muted-foreground">
        {MODULES.length} módulos disponibles
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MODULES.map((module) => (
          <button
            key={module.id}
            onClick={() => onSelectModule(module)}
            className="text-left p-4 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all group"
            style={{
              borderLeftWidth: "4px",
              borderLeftColor: module.color,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {module.name}
                </div>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>{module.floor}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{module.location}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  className="text-white font-bold"
                  style={{ backgroundColor: module.color }}
                >
                  {module.specialties.length}
                </Badge>
                <div className="text-xs text-muted-foreground mt-1">
                  especialidades
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
