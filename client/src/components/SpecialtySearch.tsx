import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Layers } from "lucide-react";
import { useState, useMemo } from "react";
import { SPECIALTIES, MODULES, type Specialty } from "../../../shared/data";

interface SpecialtySearchProps {
  onSelectSpecialty: (specialty: typeof SPECIALTIES[0]) => void;
}

export default function SpecialtySearch({ onSelectSpecialty }: SpecialtySearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const filteredSpecialties = useMemo(() => {
    return SPECIALTIES.filter((specialty: Specialty) => {
      const matchesSearch = specialty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specialty.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesModule = !selectedModule || specialty.module === selectedModule;
      return matchesSearch && matchesModule;
    });
  }, [searchQuery, selectedModule]);

  const getModuleColor = (moduleId: string): string => {
    return MODULES.find((m: typeof MODULES[0]) => m.id === moduleId)?.color || "#999";
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Busca una especialidad (ej: Pediatría, Cardiología...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Module Filter */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Layers className="w-4 h-4" />
          Filtrar por módulo
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedModule === null ? "default" : "outline"}
            className="cursor-pointer px-3 py-1.5"
            onClick={() => setSelectedModule(null)}
          >
            Todos
          </Badge>
          {MODULES.map((module: typeof MODULES[0]) => (
            <Badge
              key={module.id}
              variant={selectedModule === module.id ? "default" : "outline"}
              className="cursor-pointer px-3 py-1.5"
              style={
                selectedModule === module.id
                  ? { backgroundColor: module.color, color: "white" }
                  : { borderColor: module.color, color: module.color }
              }
              onClick={() => setSelectedModule(module.id)}
            >
              {module.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-muted-foreground">
          {filteredSpecialties.length} resultado{filteredSpecialties.length !== 1 ? "s" : ""}
        </div>
        <div className="grid gap-2 max-h-96 overflow-y-auto">
          {filteredSpecialties.map((specialty: typeof SPECIALTIES[0]) => {
            const module = MODULES.find((m: typeof MODULES[0]) => m.id === specialty.module);
            return (
              <button
                key={specialty.id}
                onClick={() => onSelectSpecialty(specialty)}
                className="text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {specialty.name}
                    </div>
                    {specialty.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {specialty.description}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{specialty.floor}</span>
                      <span>•</span>
                      <span
                        className="font-semibold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: module?.color }}
                      >
                        {specialty.module}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
          {filteredSpecialties.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No se encontraron especialidades</p>
              <p className="text-xs mt-1">Intenta con otro término de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
