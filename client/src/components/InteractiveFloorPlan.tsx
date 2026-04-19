import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getModuleSpecialtiesSummary } from '../../../shared/data';

interface Module {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const MODULES: Module[] = [
  // Torre Hospital (Centro)
  { id: '1B', name: 'Torre Hospital 1B', x: 35, y: 25, width: 15, height: 12, color: '#9CA3AF' },
  { id: '2B', name: 'Torre Hospital 2B', x: 50, y: 25, width: 15, height: 12, color: '#9CA3AF' },
  { id: '3B', name: 'Torre Hospital 3B', x: 20, y: 25, width: 15, height: 12, color: '#9CA3AF' },

  // Módulos Principales
  { id: 'A', name: 'Módulo A', x: 55, y: 35, width: 18, height: 20, color: '#3B82F6' },
  { id: 'B', name: 'Módulo B', x: 20, y: 40, width: 12, height: 15, color: '#10B981' },
  { id: 'C', name: 'Módulo C', x: 15, y: 60, width: 15, height: 18, color: '#F59E0B' },
  { id: 'D', name: 'Módulo D', x: 35, y: 50, width: 15, height: 15, color: '#8B5CF6' },
  { id: 'E', name: 'C.D.T E', x: 30, y: 15, width: 20, height: 12, color: '#6366F1' },
  { id: 'F', name: 'Módulo F', x: 60, y: 55, width: 18, height: 20, color: '#EC4899' },
  { id: 'G', name: 'Módulo G', x: 75, y: 50, width: 12, height: 15, color: '#14B8A6' },
  { id: 'H', name: 'Módulo H', x: 65, y: 75, width: 12, height: 12, color: '#F97316' },
  { id: 'I', name: 'Módulo I', x: 75, y: 70, width: 12, height: 15, color: '#06B6D4' },
  { id: 'J', name: 'Módulo J', x: 80, y: 80, width: 10, height: 10, color: '#8B5CF6' },
  { id: 'K', name: 'Módulo K', x: 75, y: 85, width: 12, height: 10, color: '#EC4899' },
  { id: 'L', name: 'Módulo L', x: 60, y: 85, width: 12, height: 10, color: '#3B82F6' },
  { id: 'M', name: 'Módulo M', x: 70, y: 40, width: 12, height: 12, color: '#10B981' },

  // Módulos Especiales
  { id: 'MOD_A', name: 'MOD A', x: 15, y: 75, width: 10, height: 10, color: '#6366F1' },
  { id: 'MOD_B', name: 'MOD B', x: 25, y: 75, width: 10, height: 10, color: '#06B6D4' },
  { id: 'MOD_CHJ', name: 'MOD CHJ', x: 15, y: 85, width: 10, height: 10, color: '#F59E0B' },
  { id: 'MOD_D', name: 'MOD D', x: 10, y: 35, width: 8, height: 8, color: '#EC4899' },
  { id: 'MOD_I', name: 'MOD I', x: 10, y: 50, width: 8, height: 8, color: '#14B8A6' },
];

interface InteractiveFloorPlanProps {
  onModuleSelect?: (moduleId: string) => void;
  selectedModuleId?: string;
}

export function InteractiveFloorPlan({
  onModuleSelect,
  selectedModuleId,
}: InteractiveFloorPlanProps) {
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  const handleModuleClick = (module: Module | null) => {
    setSelectedModule(module);
    onModuleSelect?.(module?.id || '');
  };

  const specialties = selectedModule ? getModuleSpecialtiesSummary(selectedModule.id) : null;

  return (
    <div className="w-full space-y-4">
      {/* SVG Floor Plan */}
      <div className="relative bg-white rounded-lg border-2 border-slate-200 overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-auto bg-slate-50"
          style={{ aspectRatio: '1 / 1' }}
        >
          {/* Background */}
          <rect width="100" height="100" fill="#F8FAFC" />

          {/* Grid lines (subtle) */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#E2E8F0" strokeWidth="0.1" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" opacity="0.3" />

          {/* Modules */}
          {MODULES.map((module) => (
            <g key={module.id}>
              <rect
                x={module.x}
                y={module.y}
                width={module.width}
                height={module.height}
                fill={module.color}
                stroke={
                  selectedModuleId === module.id || hoveredModule === module.id
                    ? '#000'
                    : '#94A3B8'
                }
                strokeWidth={selectedModuleId === module.id || hoveredModule === module.id ? 0.8 : 0.3}
                opacity={hoveredModule === module.id ? 0.9 : 0.7}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={() => setHoveredModule(module.id)}
                onMouseLeave={() => setHoveredModule(null)}
                onClick={() => handleModuleClick(module)}
              />
              <text
                x={module.x + module.width / 2}
                y={module.y + module.height / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="2"
                fontWeight="bold"
                fill="#fff"
                pointerEvents="none"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
              >
                {module.id}
              </text>
            </g>
          ))}

          {/* Borders and streets */}
          <rect
            x="5"
            y="5"
            width="90"
            height="90"
            fill="none"
            stroke="#1E293B"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* Legend */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="text-sm font-semibold text-slate-900 mb-3">Leyenda de Módulos</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => handleModuleClick(module)}
              className="flex items-center gap-2 p-2 rounded hover:bg-white transition-colors text-sm"
            >
              <div
                className="w-4 h-4 rounded flex-shrink-0"
                style={{ backgroundColor: module.color }}
              />
              <span className="text-slate-700 font-medium">{module.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Module Details */}
      {selectedModule && specialties && (
        <div className="bg-white border-2 border-blue-200 rounded-lg p-4 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{selectedModule.name}</h3>
              <p className="text-sm text-slate-600 mt-1">
                {specialties.reduce((sum: number, floor: any) => sum + floor.specialties.length, 0)} especialidades disponibles
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedModule(null);
                onModuleSelect?.('');
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          </div>

          {/* Specialties by Floor */}
          {specialties.map((floor: { floor: string; specialties: any[] }) => (
            <div key={floor.floor} className="space-y-2">
              <div className="flex items-center gap-2">
                <ChevronDown className="w-4 h-4 text-slate-600" />
                <span className="font-semibold text-slate-900">{floor.floor}</span>
                <Badge variant="secondary" className="text-xs">
                  {floor.specialties.length}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 ml-6">
                {floor.specialties.map((specialty: any) => (
                  <div
                    key={specialty.id}
                    className="text-sm p-2 bg-slate-50 rounded border border-slate-200 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-slate-900">{specialty.name}</div>
                    {specialty.description && (
                      <div className="text-xs text-slate-600 mt-1">{specialty.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-900">
        <p className="font-semibold">💡 Instrucciones:</p>
        <p className="mt-1">Haz clic en los módulos del mapa o en la leyenda para ver las especialidades disponibles.</p>
      </div>
    </div>
  );
}
