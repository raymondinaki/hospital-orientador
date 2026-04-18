import { useRef, useCallback, useEffect, useState, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/shared/hooks/useAppStore';
import { ModuleMarker } from './ModuleMarker';
import { PathHighlight } from './PathHighlight';
import type { Module } from '@shared/types';

// SVG content as strings for Floor 1
const FLOOR1_SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" class="w-full h-full">
  <title>Hospital Floor 1 - Primer Piso</title>
  <desc>Interactive map showing hospital modules on the first floor</desc>
  <defs>
    <linearGradient id="corridorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#f3f4f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="1000" height="600" fill="#fafafa" />
  <g id="corridor" data-type="corridor">
    <rect x="50" y="280" width="900" height="60" fill="url(#corridorGradient)" stroke="#d1d5db" stroke-width="2" rx="4" />
    <text x="500" y="315" text-anchor="middle" fill="#6b7280" font-size="14" font-weight="500">Pasillo Principal</text>
  </g>
  <g id="stairs">
    <rect x="460" y="200" width="80" height="80" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2" rx="4" />
    <text x="500" y="240" text-anchor="middle" fill="#6b7280" font-size="12">Escaleras</text>
    <text x="500" y="260" text-anchor="middle" fill="#6b7280" font-size="12">Ascensor</text>
    <line x1="500" y1="280" x2="500" y2="340" stroke="#9ca3af" stroke-width="2" stroke-dasharray="4,4" />
  </g>
  <g id="emergency-exit">
    <rect x="920" y="280" width="30" height="60" fill="#ef4444" opacity="0.2" stroke="#ef4444" stroke-width="2" rx="2" />
    <text x="935" y="315" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold" transform="rotate(-90, 935, 315)">SALIDA</text>
  </g>
  <g id="module-i3" data-module-id="i3" style="cursor: pointer;">
    <rect x="60" y="370" width="70" height="100" fill="#884EA0" fill-opacity="0.2" stroke="#884EA0" stroke-width="3" rx="6" />
    <text x="95" y="425" text-anchor="middle" fill="#884EA0" font-size="18" font-weight="bold">i3</text>
    <text x="95" y="445" text-anchor="middle" fill="#6b7280" font-size="10">Oncología</text>
  </g>
  <g id="module-i2" data-module-id="i2" style="cursor: pointer;">
    <rect x="150" y="370" width="70" height="100" fill="#AF7AC5" fill-opacity="0.2" stroke="#AF7AC5" stroke-width="3" rx="6" />
    <text x="185" y="425" text-anchor="middle" fill="#AF7AC5" font-size="18" font-weight="bold">i2</text>
    <text x="185" y="445" text-anchor="middle" fill="#6b7280" font-size="10">Cir. Tórax</text>
  </g>
  <g id="module-E" data-module-id="E" style="cursor: pointer;">
    <rect x="260" y="390" width="70" height="80" fill="#D4AC0D" fill-opacity="0.2" stroke="#D4AC0D" stroke-width="3" rx="6" />
    <text x="295" y="435" text-anchor="middle" fill="#D4AC0D" font-size="18" font-weight="bold">E</text>
    <text x="295" y="455" text-anchor="middle" fill="#6b7280" font-size="10">Gastro</text>
  </g>
  <g id="module-B" data-module-id="B" style="cursor: pointer;">
    <rect x="410" y="390" width="70" height="80" fill="#8E44AD" fill-opacity="0.2" stroke="#8E44AD" stroke-width="3" rx="6" />
    <text x="445" y="435" text-anchor="middle" fill="#8E44AD" font-size="18" font-weight="bold">B</text>
    <text x="445" y="455" text-anchor="middle" fill="#6b7280" font-size="10">Oftalmo</text>
  </g>
  <g id="module-A" data-module-id="A" style="cursor: pointer;">
    <rect x="560" y="390" width="70" height="80" fill="#2E86C1" fill-opacity="0.2" stroke="#2E86C1" stroke-width="3" rx="6" />
    <text x="595" y="435" text-anchor="middle" fill="#2E86C1" font-size="18" font-weight="bold">A</text>
    <text x="595" y="455" text-anchor="middle" fill="#6b7280" font-size="10">Pediatría</text>
  </g>
  <g id="module-C" data-module-id="C" style="cursor: pointer;">
    <rect x="820" y="200" width="100" height="200" fill="#CA6F1E" fill-opacity="0.2" stroke="#CA6F1E" stroke-width="3" rx="6" />
    <text x="870" y="280" text-anchor="middle" fill="#CA6F1E" font-size="18" font-weight="bold">C</text>
    <text x="870" y="305" text-anchor="middle" fill="#6b7280" font-size="10">Trauma</text>
  </g>
  <g id="module-C2" data-module-id="C2" style="cursor: pointer;">
    <rect x="820" y="200" width="100" height="200" fill="#C0392B" fill-opacity="0.15" stroke="#C0392B" stroke-width="3" rx="6" />
    <text x="870" y="350" text-anchor="middle" fill="#C0392B" font-size="14" font-weight="bold">C2</text>
    <text x="870" y="370" text-anchor="middle" fill="#6b7280" font-size="10">Cardio</text>
  </g>
  <g id="module-i1" data-module-id="i1" style="cursor: pointer;">
    <rect x="700" y="120" width="80" height="90" fill="#6C3483" fill-opacity="0.2" stroke="#6C3483" stroke-width="3" rx="6" />
    <text x="740" y="170" text-anchor="middle" fill="#6C3483" font-size="18" font-weight="bold">i1</text>
    <text x="740" y="190" text-anchor="middle" fill="#6b7280" font-size="10">Hemato-Onco</text>
  </g>
  <g id="module-D-floor1">
    <rect x="580" y="120" width="80" height="90" fill="#1E8449" fill-opacity="0.1" stroke="#1E8449" stroke-width="2" stroke-dasharray="5,5" rx="6" />
    <text x="620" y="165" text-anchor="middle" fill="#1E8449" font-size="12" font-style="italic">D (Piso 2)</text>
  </g>
  <g id="connections" stroke="#d1d5db" stroke-width="2">
    <line x1="95" y1="370" x2="95" y2="340" /><line x1="95" y1="340" x2="150" y2="340" />
    <line x1="185" y1="370" x2="185" y2="340" /><line x1="185" y1="340" x2="200" y2="340" />
    <line x1="295" y1="390" x2="295" y2="340" />
    <line x1="445" y1="390" x2="445" y2="340" />
    <line x1="595" y1="390" x2="595" y2="340" />
    <line x1="870" y1="200" x2="870" y2="150" /><line x1="870" y1="150" x2="900" y2="150" /><line x1="900" y1="150" x2="900" y2="280" />
    <line x1="740" y1="210" x2="740" y2="280" />
  </g>
  <g id="entrance">
    <path d="M 50 290 L 50 330 L 30 330 L 40 310 L 30 290 Z" fill="#22c55e" stroke="#16a34a" stroke-width="2" />
    <text x="25" y="355" text-anchor="middle" fill="#16a34a" font-size="11" font-weight="bold">ENTRADA</text>
  </g>
  <g id="legend" transform="translate(50, 520)">
    <rect x="0" y="0" width="900" height="60" fill="#f9fafb" stroke="#e5e7eb" rx="4" />
    <text x="10" y="20" fill="#374151" font-size="12" font-weight="bold">Leyenda:</text>
    <rect x="80" y="10" width="16" height="16" fill="#2E86C1" fill-opacity="0.2" stroke="#2E86C1" rx="2" />
    <text x="102" y="22" fill="#6b7280" font-size="11">1er Piso</text>
    <rect x="180" y="10" width="16" height="16" fill="#1E8449" fill-opacity="0.2" stroke="#1E8449" stroke-dasharray="3,2" rx="2" />
    <text x="202" y="22" fill="#6b7280" font-size="11">2do Piso (parcial)</text>
    <rect x="330" y="10" width="16" height="16" fill="#22c55e" rx="2" />
    <text x="352" y="22" fill="#6b7280" font-size="11">Entrada</text>
    <rect x="430" y="10" width="16" height="16" fill="#ef4444" opacity="0.2" stroke="#ef4444" rx="2" />
    <text x="452" y="22" fill="#6b7280" font-size="11">Salida Emergencia</text>
    <text x="10" y="45" fill="#9ca3af" font-size="10">Toque un módulo para ver detalles</text>
  </g>
</svg>`;

// SVG content for Floor 2
const FLOOR2_SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" class="w-full h-full">
  <title>Hospital Floor 2 - Segundo Piso</title>
  <desc>Interactive map showing hospital modules on the second floor</desc>
  <defs>
    <linearGradient id="corridorGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#f3f4f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="1000" height="600" fill="#fafafa" />
  <g id="corridor" data-type="corridor">
    <rect x="50" y="280" width="900" height="60" fill="url(#corridorGradient2)" stroke="#d1d5db" stroke-width="2" rx="4" />
    <text x="500" y="315" text-anchor="middle" fill="#6b7280" font-size="14" font-weight="500">Pasillo Principal</text>
  </g>
  <g id="stairs">
    <rect x="460" y="200" width="80" height="80" fill="#e5e7eb" stroke="#9ca3af" stroke-width="2" rx="4" />
    <text x="500" y="240" text-anchor="middle" fill="#6b7280" font-size="12">Escaleras</text>
    <text x="500" y="260" text-anchor="middle" fill="#6b7280" font-size="12">Ascensor</text>
    <line x1="500" y1="280" x2="500" y2="200" stroke="#9ca3af" stroke-width="2" stroke-dasharray="4,4" />
  </g>
  <g id="module-D" data-module-id="D" style="cursor: pointer;">
    <rect x="550" y="120" width="120" height="100" fill="#1E8449" fill-opacity="0.2" stroke="#1E8449" stroke-width="3" rx="6" />
    <text x="610" y="165" text-anchor="middle" fill="#1E8449" font-size="20" font-weight="bold">D</text>
    <text x="610" y="190" text-anchor="middle" fill="#6b7280" font-size="11">Cirugía</text>
    <text x="610" y="205" text-anchor="middle" fill="#6b7280" font-size="10">Neurología</text>
  </g>
  <g id="module-D2" data-module-id="D2" style="cursor: pointer;">
    <rect x="400" y="120" width="100" height="100" fill="#117A65" fill-opacity="0.2" stroke="#117A65" stroke-width="3" rx="6" />
    <text x="450" y="165" text-anchor="middle" fill="#117A65" font-size="18" font-weight="bold">D2</text>
    <text x="450" y="190" text-anchor="middle" fill="#6b7280" font-size="11">Reumatología</text>
    <text x="450" y="205" text-anchor="middle" fill="#6b7280" font-size="10">Nefrología</text>
  </g>
  <g id="module-i1-floor2" data-module-id="i1" style="cursor: pointer;">
    <rect x="720" y="120" width="90" height="100" fill="#6C3483" fill-opacity="0.2" stroke="#6C3483" stroke-width="3" rx="6" />
    <text x="765" y="155" text-anchor="middle" fill="#6C3483" font-size="14" font-weight="bold">i1</text>
    <text x="765" y="175" text-anchor="middle" fill="#6b7280" font-size="10">Urología</text>
    <text x="765" y="190" text-anchor="middle" fill="#6b7280" font-size="10">Nefrología</text>
  </g>
  <g id="module-i2-floor2" data-module-id="i2" style="cursor: pointer;">
    <rect x="200" y="120" width="80" height="100" fill="#AF7AC5" fill-opacity="0.2" stroke="#AF7AC5" stroke-width="3" rx="6" />
    <text x="240" y="155" text-anchor="middle" fill="#AF7AC5" font-size="14" font-weight="bold">i2</text>
    <text x="240" y="175" text-anchor="middle" fill="#6b7280" font-size="10">Neuroinfantil</text>
    <text x="240" y="190" text-anchor="middle" fill="#6b7280" font-size="10">Neurocirugía</text>
  </g>
  <g id="module-i3-floor2" data-module-id="i3" style="cursor: pointer;">
    <rect x="100" y="120" width="80" height="100" fill="#884EA0" fill-opacity="0.2" stroke="#884EA0" stroke-width="3" rx="6" />
    <text x="140" y="155" text-anchor="middle" fill="#884EA0" font-size="14" font-weight="bold">i3</text>
    <text x="140" y="175" text-anchor="middle" fill="#6b7280" font-size="10">Hemato-Onco</text>
    <text x="140" y="190" text-anchor="middle" fill="#6b7280" font-size="10">Quimioterapia</text>
  </g>
  <g id="module-E-floor2">
    <rect x="300" y="120" width="60" height="50" fill="#D4AC0D" fill-opacity="0.1" stroke="#D4AC0D" stroke-dasharray="4,4" rx="4" />
    <text x="330" y="150" text-anchor="middle" fill="#D4AC0D" font-size="11" font-style="italic">E Box 5</text>
  </g>
  <g id="connections" stroke="#d1d5db" stroke-width="2">
    <line x1="140" y1="220" x2="140" y2="280" />
    <line x1="240" y1="220" x2="240" y2="280" />
    <line x1="330" y1="170" x2="330" y2="280" />
    <line x1="450" y1="220" x2="450" y2="280" />
    <line x1="610" y1="220" x2="610" y2="280" />
    <line x1="765" y1="220" x2="765" y2="280" />
  </g>
  <g id="floor1-ghosts" opacity="0.15">
    <rect x="60" y="370" width="70" height="100" fill="#9ca3af" rx="4" />
    <rect x="150" y="370" width="70" height="100" fill="#9ca3af" rx="4" />
    <rect x="260" y="390" width="70" height="80" fill="#9ca3af" rx="4" />
    <rect x="410" y="390" width="70" height="80" fill="#9ca3af" rx="4" />
    <rect x="560" y="390" width="70" height="80" fill="#9ca3af" rx="4" />
    <rect x="820" y="200" width="100" height="200" fill="#9ca3af" rx="4" />
  </g>
  <text x="500" y="520" text-anchor="middle" fill="#9ca3af" font-size="12" font-style="italic">--- Módulos del 1er piso (visibles abajo) ---</text>
  <g id="legend" transform="translate(50, 540)">
    <rect x="0" y="0" width="900" height="50" fill="#f9fafb" stroke="#e5e7eb" rx="4" />
    <text x="10" y="20" fill="#374151" font-size="12" font-weight="bold">Leyenda:</text>
    <rect x="80" y="10" width="16" height="16" fill="#1E8449" fill-opacity="0.2" stroke="#1E8449" rx="2" />
    <text x="102" y="22" fill="#6b7280" font-size="11">2do Piso</text>
    <rect x="180" y="10" width="16" height="16" fill="#9ca3af" fill-opacity="0.15" stroke="#9ca3af" rx="2" />
    <text x="202" y="22" fill="#6b7280" font-size="11">1er Piso (abajo)</text>
    <rect x="330" y="10" width="16" height="16" fill="#6C3483" fill-opacity="0.2" stroke="#6C3483" rx="2" />
    <text x="352" y="22" fill="#6b7280" font-size="11">Módulo 2 pisos</text>
    <text x="10" y="40" fill="#9ca3af" font-size="10">Toque un módulo para ver detalles</text>
  </g>
</svg>`;

// Module positions for Floor 1 (SVG coordinates based on the SVG viewBox 0 0 1000 600)
// These match the center of each module rectangle in floor-1.svg
const FLOOR1_MODULE_POSITIONS: Record<string, { x: number; y: number; labelX: number; labelY: number }> = {
  // Module i3: rect x=60 y=370 width=70 height=100 → center x=95, y=420
  i3: { x: 95, y: 420, labelX: 95, labelY: 420 },
  // Module i2: rect x=150 y=370 width=70 height=100 → center x=185, y=420
  i2: { x: 185, y: 420, labelX: 185, labelY: 420 },
  // Module E: rect x=260 y=390 width=70 height=80 → center x=295, y=430
  E: { x: 295, y: 430, labelX: 295, labelY: 430 },
  // Module B: rect x=410 y=390 width=70 height=80 → center x=445, y=430
  B: { x: 445, y: 430, labelX: 445, labelY: 430 },
  // Module A: rect x=560 y=390 width=70 height=80 → center x=595, y=430
  A: { x: 595, y: 430, labelX: 595, labelY: 430 },
  // Module C: rect x=820 y=200 width=100 height=200 → center x=870, y=300
  C: { x: 870, y: 300, labelX: 870, labelY: 300 },
  // Module C2: same rect as C
  C2: { x: 870, y: 300, labelX: 870, labelY: 300 },
  // Module i1: rect x=700 y=120 width=80 height=90 → center x=740, y=165
  i1: { x: 740, y: 165, labelX: 740, labelY: 165 },
};

// Module positions for Floor 2
// These match the center of each module rectangle in floor-2.svg
const FLOOR2_MODULE_POSITIONS: Record<string, { x: number; y: number; labelX: number; labelY: number }> = {
  // Module D: rect x=550 y=120 width=120 height=100 → center x=610, y=170
  D: { x: 610, y: 170, labelX: 610, labelY: 170 },
  // Module D2: rect x=400 y=120 width=100 height=100 → center x=450, y=170
  D2: { x: 450, y: 170, labelX: 450, labelY: 170 },
  // Module i1 (floor 2): rect x=720 y=120 width=90 height=100 → center x=765, y=170
  i1: { x: 765, y: 170, labelX: 765, labelY: 170 },
  // Module i2 (floor 2): rect x=200 y=120 width=80 height=100 → center x=240, y=170
  i2: { x: 240, y: 170, labelX: 240, labelY: 170 },
  // Module i3 (floor 2): rect x=100 y=120 width=80 height=100 → center x=140, y=170
  i3: { x: 140, y: 170, labelX: 140, labelY: 170 },
};

interface HospitalMapProps {
  className?: string;
}

export const HospitalMap = memo(function HospitalMap({ className = '' }: HospitalMapProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const {
    modules,
    selectedFloor,
    selectedModule,
    routeOrigin,
    routeDestination,
    setSelectedModule,
  } = useAppStore();

  // Get modules for current floor
  const floorModules = modules.filter((m) => m.floor === selectedFloor);

  // Get module positions based on floor
  const modulePositions = selectedFloor === 1 ? FLOOR1_MODULE_POSITIONS : FLOOR2_MODULE_POSITIONS;

  // Memoize SVG content - only changes when floor changes
  const svgContent = useMemo(
    () => (selectedFloor === 1 ? FLOOR1_SVG_CONTENT : FLOOR2_SVG_CONTENT),
    [selectedFloor]
  );

  // Memoize hovered module data
  const hoveredModuleData = useMemo(
    () => (hoveredModule ? modules.find((m) => m.id === hoveredModule) : null),
    [hoveredModule, modules]
  );

  // Event delegation for click and hover on SVG module areas
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-module-id]');
      if (!target) return;
      const moduleId = target.getAttribute('data-module-id');
      if (!moduleId) return;

      const module = modules.find((m) => m.id === moduleId);
      if (module && module.floor === selectedFloor) {
        setSelectedModule(moduleId === selectedModule ? null : moduleId);
      }
    };

    const handleHover = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-module-id]');
      if (target) {
        const moduleId = target.getAttribute('data-module-id');
        setHoveredModule(moduleId);

        // Update tooltip position
        const rect = container.getBoundingClientRect();
        setTooltipPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      } else {
        setHoveredModule(null);
      }
    };

    container.addEventListener('click', handleClick);
    container.addEventListener('mousemove', handleHover);

    return () => {
      container.removeEventListener('click', handleClick);
      container.removeEventListener('mousemove', handleHover);
    };
  }, [modules, selectedFloor, selectedModule, setSelectedModule]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[400px] ${className}`}
      role="img"
      aria-label={t('accessibility.floorMap')}
    >
      {/* SVG Floor Map - memoized, only re-parses when floor changes */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />

      {/* Module Markers Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {floorModules.map((module) => {
          const pos = modulePositions[module.id];
          if (!pos) return null;

          return (
            <ModuleMarker
              key={module.id}
              module={module}
              x={pos.labelX}
              y={pos.labelY}
              isSelected={selectedModule === module.id}
              isHovered={hoveredModule === module.id}
              onClick={() => setSelectedModule(module.id === selectedModule ? null : module.id)}
              onHover={(hovered) => setHoveredModule(hovered ? module.id : null)}
            />
          );
        })}
      </div>

      {/* Path Highlight Overlay */}
      {routeOrigin && routeDestination && (
        <PathHighlight
          origin={routeOrigin}
          destination={routeDestination}
          floor={selectedFloor}
          modulePositions={modulePositions}
        />
      )}

      {/* Tooltip */}
      {hoveredModule && hoveredModuleData && (
        <div
          className="absolute z-50 bg-popover border border-border rounded-md shadow-lg px-3 py-2 text-sm pointer-events-none animate-fade-in"
          style={{
            left: tooltipPos.x + 10,
            top: tooltipPos.y - 40,
          }}
        >
          <div>
            <p className="font-semibold">{hoveredModuleData.name.es}</p>
            <p className="text-xs text-muted-foreground">
              {hoveredModuleData.specialties.length} {t('modules.specialties').toLowerCase()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
