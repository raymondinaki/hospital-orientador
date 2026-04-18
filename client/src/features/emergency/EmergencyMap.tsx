import { useRef, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/shared/hooks/useAppStore';

// Emergency exit positions for each floor (labels are i18n keys now)
const EMERGENCY_EXITS = {
  floor1: [
    { id: 'exit-main', x: 935, y: 310, labelKey: 'emergency.mainExit' },
    { id: 'exit-side', x: 50, y: 310, labelKey: 'emergency.sideExit' },
  ],
  floor2: [
    { id: 'exit-stairs', x: 500, y: 240, labelKey: 'emergency.stairs' },
    { id: 'exit-main', x: 935, y: 310, labelKey: 'emergency.mainExit' },
  ],
};

// Module positions for Floor 1 (matching HospitalMap)
const FLOOR1_MODULE_POSITIONS: Record<string, { x: number; y: number }> = {
  i3: { x: 95, y: 420 },
  i2: { x: 185, y: 420 },
  E: { x: 295, y: 430 },
  B: { x: 445, y: 430 },
  A: { x: 595, y: 430 },
  C: { x: 870, y: 300 },
  C2: { x: 870, y: 300 },
  i1: { x: 740, y: 165 },
};

// Module positions for Floor 2
const FLOOR2_MODULE_POSITIONS: Record<string, { x: number; y: number }> = {
  D: { x: 610, y: 170 },
  D2: { x: 450, y: 170 },
  i1: { x: 765, y: 170 },
  i2: { x: 240, y: 170 },
  i3: { x: 140, y: 170 },
};

// SVG content for Floor 1 with emergency overlay
const FLOOR1_SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" class="w-full h-full">
  <title>Hospital Floor 1 - Emergency Map</title>
  <desc>Emergency map showing evacuation routes on the first floor</desc>
  <defs>
    <linearGradient id="corridorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#f3f4f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
    </linearGradient>
    <filter id="pulse" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect x="0" y="0" width="1000" height="600" fill="#fef2f2" />
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
  <g id="emergency-exit-1" class="emergency-exit">
    <circle cx="935" cy="310" r="20" fill="#ef4444" opacity="0.3" class="animate-pulse" />
    <circle cx="935" cy="310" r="12" fill="#ef4444" opacity="0.6" />
    <rect x="920" y="280" width="30" height="60" fill="#ef4444" opacity="0.2" stroke="#ef4444" stroke-width="2" rx="2" />
    <text x="935" y="315" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold" transform="rotate(-90, 935, 315)">SALIDA</text>
  </g>
  <g id="emergency-exit-2" class="emergency-exit">
    <circle cx="50" cy="310" r="20" fill="#ef4444" opacity="0.3" class="animate-pulse" />
    <circle cx="50" cy="310" r="12" fill="#ef4444" opacity="0.6" />
    <rect x="30" y="280" width="20" height="60" fill="#ef4444" opacity="0.2" stroke="#ef4444" stroke-width="2" rx="2" />
    <text x="40" y="315" text-anchor="middle" fill="#ef4444" font-size="8" font-weight="bold">SALIDA</text>
  </g>
  <g id="evacuation-routes">
    <path d="M 50 310 L 200 310 L 200 420" stroke="#ef4444" stroke-width="4" stroke-dasharray="8,4" fill="none" opacity="0.7" />
    <path d="M 935 310 L 800 310 L 800 300 L 870 300" stroke="#ef4444" stroke-width="4" stroke-dasharray="8,4" fill="none" opacity="0.7" />
  </g>
  <g id="module-i3" data-module-id="i3" style="cursor: pointer; opacity: 0.5;">
    <rect x="60" y="370" width="70" height="100" fill="#884EA0" fill-opacity="0.1" stroke="#884EA0" stroke-width="2" rx="6" stroke-dasharray="4,4" />
    <text x="95" y="425" text-anchor="middle" fill="#6b7280" font-size="16" font-weight="bold">i3</text>
  </g>
  <g id="module-i2" data-module-id="i2" style="cursor: pointer; opacity: 0.5;">
    <rect x="150" y="370" width="70" height="100" fill="#AF7AC5" fill-opacity="0.1" stroke="#AF7AC5" stroke-width="2" rx="6" stroke-dasharray="4,4" />
    <text x="185" y="425" text-anchor="middle" fill="#6b7280" font-size="16" font-weight="bold">i2</text>
  </g>
  <g id="module-E" data-module-id="E" style="cursor: pointer; opacity: 0.5;">
    <rect x="260" y="390" width="70" height="80" fill="#D4AC0D" fill-opacity="0.1" stroke="#D4AC0D" stroke-width="2" rx="6" stroke-dasharray="4,4" />
    <text x="295" y="435" text-anchor="middle" fill="#6b7280" font-size="16" font-weight="bold">E</text>
  </g>
  <g id="module-B" data-module-id="B" style="cursor: pointer; opacity: 0.5;">
    <rect x="410" y="390" width="70" height="80" fill="#8E44AD" fill-opacity="0.1" stroke="#8E44AD" stroke-width="2" rx="6" stroke-dasharray="4,4" />
    <text x="445" y="435" text-anchor="middle" fill="#6b7280" font-size="16" font-weight="bold">B</text>
  </g>
  <g id="module-A" data-module-id="A" style="cursor: pointer; opacity: 0.5;">
    <rect x="560" y="390" width="70" height="80" fill="#2E86C1" fill-opacity="0.1" stroke="#2E86C1" stroke-width="2" rx="6" stroke-dasharray="4,4" />
    <text x="595" y="435" text-anchor="middle" fill="#6b7280" font-size="16" font-weight="bold">A</text>
  </g>
  <g id="module-C" data-module-id="C" style="cursor: pointer; opacity: 0.5;">
    <rect x="820" y="200" width="100" height="200" fill="#CA6F1E" fill-opacity="0.1" stroke="#CA6F1E" stroke-width="2" rx="6" stroke-dasharray="4,4" />
    <text x="870" y="280" text-anchor="middle" fill="#6b7280" font-size="16" font-weight="bold">C</text>
  </g>
  <g id="module-i1" data-module-id="i1" style="cursor: pointer; opacity: 0.5;">
    <rect x="700" y="120" width="80" height="90" fill="#6C3483" fill-opacity="0.1" stroke="#6C3483" stroke-width="2" rx="6" stroke-dasharray="4,4" />
    <text x="740" y="170" text-anchor="middle" fill="#6b7280" font-size="16" font-weight="bold">i1</text>
  </g>
  <g id="you-are-here" opacity="0.8">
    <circle cx="500" cy="310" r="15" fill="#22c55e" opacity="0.3" class="animate-pulse" />
    <circle cx="500" cy="310" r="8" fill="#22c55e" />
    <text x="500" y="340" text-anchor="middle" fill="#16a34a" font-size="11" font-weight="bold">USTED ESTÁ AQUÍ</text>
  </g>
  <g id="legend" transform="translate(50, 520)">
    <rect x="0" y="0" width="900" height="60" fill="#fef2f2" stroke="#fecaca" rx="4" />
    <text x="10" y="20" fill="#991b1b" font-size="12" font-weight="bold">⚠️ EVACUACIÓN:</text>
    <circle cx="150" cy="15" r="8" fill="#ef4444" />
    <text x="170" y="20" fill="#6b7280" font-size="11">Salida de Emergencia</text>
    <line x1="280" y1="15" x2="320" y2="15" stroke="#ef4444" stroke-width="3" stroke-dasharray="6,3" />
    <text x="335" y="20" fill="#6b7280" font-size="11">Ruta de Evacuación</text>
    <circle cx="480" cy="15" r="6" fill="#22c55e" />
    <text x="500" y="20" fill="#6b7280" font-size="11">Usted está aquí</text>
    <text x="10" y="45" fill="#ef4444" font-size="11" font-weight="bold">Mantenga la calma y diríjase a la salida más cercana</text>
  </g>
</svg>`;

// SVG content for Floor 2 with emergency overlay
const FLOOR2_SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 600" class="w-full h-full">
  <title>Hospital Floor 2 - Emergency Map</title>
  <desc>Emergency map showing evacuation routes on the second floor</desc>
  <defs>
    <linearGradient id="corridorGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#f3f4f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="1000" height="600" fill="#fef2f2" />
  <g id="corridor" data-type="corridor">
    <rect x="50" y="280" width="900" height="60" fill="url(#corridorGradient2)" stroke="#d1d5db" stroke-width="2" rx="4" />
    <text x="500" y="315" text-anchor="middle" fill="#6b7280" font-size="14" font-weight="500">Pasillo Principal</text>
  </g>
  <g id="stairs" class="emergency-exit">
    <circle cx="500" cy="240" r="25" fill="#ef4444" opacity="0.3" class="animate-pulse" />
    <circle cx="500" cy="240" r="15" fill="#ef4444" opacity="0.5" />
    <rect x="460" y="200" width="80" height="80" fill="#ef4444" opacity="0.2" stroke="#ef4444" stroke-width="3" rx="4" />
    <text x="500" y="235" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold">ESCALERAS</text>
    <text x="500" y="250" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold">SALIDA</text>
  </g>
  <g id="emergency-exit" class="emergency-exit">
    <circle cx="935" cy="310" r="20" fill="#ef4444" opacity="0.3" class="animate-pulse" />
    <circle cx="935" cy="310" r="12" fill="#ef4444" opacity="0.6" />
    <rect x="920" y="280" width="30" height="60" fill="#ef4444" opacity="0.2" stroke="#ef4444" stroke-width="2" rx="2" />
    <text x="935" y="315" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="bold" transform="rotate(-90, 935, 315)">SALIDA</text>
  </g>
  <g id="evacuation-routes">
    <path d="M 500 240 L 500 200 L 935 200 L 935 310" stroke="#ef4444" stroke-width="4" stroke-dasharray="8,4" fill="none" opacity="0.7" />
  </g>
  <g id="module-D" data-module-id="D" style="cursor: pointer; opacity: 0.5;">
    <rect x="550" y="120" width="120" height="100" fill="#1E8449" fill-opacity="0.1" stroke="#1E8449" stroke-width="2" rx="6" stroke-dasharray="4,4" />
    <text x="610" y="170" text-anchor="middle" fill="#6b7280" font-size="18" font-weight="bold">D</text>
  </g>
  <g id="module-D2" data-module-id="D2" style="cursor: pointer; opacity: 0.5;">
    <rect x="400" y="120" width="100" height="100" fill="#117A65" fill-opacity="0.1" stroke="#117A65" stroke-width="2" rx="6" stroke-dasharray="4,4" />
    <text x="450" y="170" text-anchor="middle" fill="#6b7280" font-size="16" font-weight="bold">D2</text>
  </g>
  <g id="module-i1" data-module-id="i1" style="cursor: pointer; opacity: 0.5;">
    <rect x="720" y="120" width="90" height="100" fill="#6C3483" fill-opacity="0.1" stroke="#6C3483" stroke-width="2" rx="6" stroke-dasharray="4,4" />
    <text x="765" y="155" text-anchor="middle" fill="#6b7280" font-size="14" font-weight="bold">i1</text>
  </g>
  <g id="module-i2" data-module-id="i2" style="cursor: pointer; opacity: 0.5;">
    <rect x="200" y="120" width="80" height="100" fill="#AF7AC5" fill-opacity="0.1" stroke="#AF7AC5" stroke-width="2" rx="6" stroke-dasharray="4,4" />
    <text x="240" y="155" text-anchor="middle" fill="#6b7280" font-size="14" font-weight="bold">i2</text>
  </g>
  <g id="module-i3" data-module-id="i3" style="cursor: pointer; opacity: 0.5;">
    <rect x="100" y="120" width="80" height="100" fill="#884EA0" fill-opacity="0.1" stroke="#884EA0" stroke-width="2" rx="6" stroke-dasharray="4,4" />
    <text x="140" y="155" text-anchor="middle" fill="#6b7280" font-size="14" font-weight="bold">i3</text>
  </g>
  <g id="you-are-here" opacity="0.8">
    <circle cx="610" cy="170" r="15" fill="#22c55e" opacity="0.3" class="animate-pulse" />
    <circle cx="610" cy="170" r="8" fill="#22c55e" />
    <text x="610" y="200" text-anchor="middle" fill="#16a34a" font-size="11" font-weight="bold">USTED ESTÁ AQUÍ</text>
  </g>
  <g id="legend" transform="translate(50, 540)">
    <rect x="0" y="0" width="900" height="50" fill="#fef2f2" stroke="#fecaca" rx="4" />
    <text x="10" y="20" fill="#991b1b" font-size="12" font-weight="bold">⚠️ EVACUACIÓN:</text>
    <circle cx="150" cy="15" r="8" fill="#ef4444" />
    <text x="170" y="20" fill="#6b7280" font-size="11">Salida de Emergencia</text>
    <line x1="280" y1="15" x2="320" y2="15" stroke="#ef4444" stroke-width="3" stroke-dasharray="6,3" />
    <text x="335" y="20" fill="#6b7280" font-size="11">Ruta de Evacuación</text>
    <circle cx="480" cy="15" r="6" fill="#22c55e" />
    <text x="500" y="20" fill="#6b7280" font-size="11">Usted está aquí</text>
    <text x="10" y="40" fill="#ef4444" font-size="11" font-weight="bold">Para evacuar el 2do piso, use las escaleras hacia el 1er piso</text>
  </g>
</svg>`;

interface EmergencyMapProps {
  className?: string;
}

export function EmergencyMap({ className = '' }: EmergencyMapProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedFloor, setSelectedFloor] = useState<1 | 2>(1);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Floor selector tabs */}
      <div className="flex border-b border-red-200 bg-red-50 rounded-t-lg">
        <button
          onClick={() => setSelectedFloor(1)}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            selectedFloor === 1
              ? 'bg-red-100 text-red-800 border-b-2 border-red-600'
              : 'text-red-600 hover:bg-red-50'
          }`}
        >
          {t('emergency.floor1')}
        </button>
        <button
          onClick={() => setSelectedFloor(2)}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            selectedFloor === 2
              ? 'bg-red-100 text-red-800 border-b-2 border-red-600'
              : 'text-red-600 hover:bg-red-50'
          }`}
        >
          {t('emergency.floor2')}
        </button>
      </div>

      {/* Map */}
      <div className="bg-red-50 rounded-b-lg border border-red-200 p-4">
        <div
          ref={containerRef}
          className="relative w-full min-h-[400px] animate-fade-in"
          role="img"
          aria-label={t('accessibility.floorMap')}
        >
          <div
            className="absolute inset-0 flex items-center justify-center"
            dangerouslySetInnerHTML={{
              __html: selectedFloor === 1 ? FLOOR1_SVG_CONTENT : FLOOR2_SVG_CONTENT,
            }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 p-4 bg-red-100 border border-red-200 rounded-lg">
        <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
          <span>⚠️</span> {t('emergency.exits')}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {EMERGENCY_EXITS[`floor${selectedFloor}`].map((exit) => (
            <div key={exit.id} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-700">
                {t(exit.labelKey)}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-red-600">
          {selectedFloor === 1
            ? t('emergency.floor1Instructions')
            : t('emergency.floor2Instructions')}
        </p>
      </div>
    </div>
  );
}