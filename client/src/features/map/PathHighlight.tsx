import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/shared/hooks/useAppStore';

interface PathHighlightProps {
  origin: string;
  destination: string;
  floor: 1 | 2;
  modulePositions: Record<string, { x: number; y: number; labelX: number; labelY: number }>;
}

// Calculate path between two modules following the corridor
// SVG viewBox is 0 0 1000 600, corridor is at y=280 to y=340 (center y=310)
function calculatePath(
  origin: { x: number; y: number },
  dest: { x: number; y: number },
  _floor: 1 | 2
): string {
  const corridorY = 310; // Center of the corridor

  const originY = origin.y;
  const destY = dest.y;

  // Determine if modules are above (y < corridorY) or below (y > corridorY) the corridor
  const originAboveCorridor = originY < corridorY;
  const destAboveCorridor = destY < corridorY;

  const startX = origin.x;
  const startY = origin.y;
  const endX = dest.x;
  const endY = dest.y;

  // If on same side of corridor, go along corridor
  if (originAboveCorridor === destAboveCorridor) {
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }

  // Modules on opposite sides - go to corridor, across, then to destination
  // For modules below corridor: go up to corridorY, across, then to destination
  // For modules above corridor: go down to corridorY, across, then to destination
  if (!originAboveCorridor && destAboveCorridor) {
    // Origin below (y > corridorY), destination above (y < corridorY)
    return `M ${startX} ${startY} L ${startX} ${corridorY} L ${endX} ${corridorY} L ${endX} ${endY}`;
  } else {
    // Origin above (y < corridorY), destination below (y > corridorY)
    return `M ${startX} ${startY} L ${startX} ${corridorY} L ${endX} ${corridorY} L ${endX} ${endY}`;
  }
}

export function PathHighlight({
  origin,
  destination,
  floor,
  modulePositions,
}: PathHighlightProps) {
  const { t } = useTranslation();
  const modules = useAppStore((state) => state.modules);

  const originModule = modules.find((m) => m.id === origin);
  const destModule = modules.find((m) => m.id === destination);

  const pathData = useMemo(() => {
    const originPos = modulePositions[origin];
    const destPos = modulePositions[destination];

    if (!originPos || !destPos) return null;

    return {
      path: calculatePath(
        { x: originPos.x, y: originPos.labelY },
        { x: destPos.x, y: destPos.labelY },
        floor
      ),
      originX: originPos.x,
      originY: originPos.labelY,
      destX: destPos.x,
      destY: destPos.labelY,
    };
  }, [origin, destination, floor, modulePositions]);

  if (!pathData) return null;

  const pathColor = '#3b82f6'; // Blue for regular route
  const originColor = originModule?.color || '#22c55e';
  const destColor = destModule?.color || '#ef4444';

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={pathColor} />
        </marker>
      </defs>

      {/* Animated path */}
      <path
        d={pathData.path}
        fill="none"
        stroke={pathColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="12,8"
        className="route-animated"
        markerEnd="url(#arrowhead)"
      />

      {/* Origin marker ("You are here") */}
      <g className="animate-pulse">
        <circle
          cx={pathData.originX}
          cy={pathData.originY}
          r="16"
          fill={originColor}
          fillOpacity="0.3"
        />
        <circle
          cx={pathData.originX}
          cy={pathData.originY}
          r="10"
          fill={originColor}
          stroke="#ffffff"
          strokeWidth="2"
        />
        <text
          x={pathData.originX}
          y={pathData.originY + 30}
          textAnchor="middle"
          className="text-xs font-semibold fill-green-600"
        >
          {t('map.youAreHere')}
        </text>
      </g>

      {/* Destination marker */}
      <g>
        <circle
          cx={pathData.destX}
          cy={pathData.destY}
          r="14"
          fill={destColor}
          fillOpacity="0.3"
        />
        <circle
          cx={pathData.destX}
          cy={pathData.destY}
          r="8"
          fill={destColor}
          stroke="#ffffff"
          strokeWidth="2"
        />
        <text
          x={pathData.destX}
          y={pathData.destY - 16}
          textAnchor="middle"
          className="text-xs font-semibold"
          fill={destColor}
        >
          {destModule?.name.es || destination}
        </text>
      </g>
    </svg>
  );
}

// Calculate path between two modules following the corridor
function calculatePath(
  origin: { x: number; y: number },
  dest: { x: number; y: number },
  _floor: 1 | 2
): string {
  // Main corridor y coordinate in SVG space
  const corridorY = 310; // Center of corridor (y=280 to y=340)

  const originY = origin.y;
  const destY = dest.y;

  const originAboveCorridor = originY < corridorY;
  const destAboveCorridor = destY < corridorY;

  const startX = origin.x;
  const startY = originY;
  const endX = dest.x;
  const endY = dest.y;

  // If on same side of corridor, go straight along corridor
  if (originAboveCorridor === destAboveCorridor) {
    const midY = corridorY;
    return `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
  }

  // Modules on opposite sides - go to corridor, across, then to destination
  if (!originAboveCorridor && destAboveCorridor) {
    return `M ${startX} ${startY} L ${startX} ${corridorY} L ${endX} ${corridorY} L ${endX} ${endY}`;
  } else {
    return `M ${startX} ${startY} L ${startX} ${corridorY} L ${endX} ${corridorY} L ${endX} ${endY}`;
  }
}

export function PathHighlight({
  origin,
  destination,
  floor,
  modulePositions,
}: PathHighlightProps) {
  const { t } = useTranslation();
  const modules = useAppStore((state) => state.modules);

  const originModule = modules.find((m) => m.id === origin);
  const destModule = modules.find((m) => m.id === destination);

  const pathData = useMemo(() => {
    const originPos = modulePositions[origin];
    const destPos = modulePositions[destination];

    if (!originPos || !destPos) return null;

    return {
      path: calculatePath(
        { x: originPos.x, y: originPos.labelY },
        { x: destPos.x, y: destPos.labelY },
        floor
      ),
      originX: originPos.x,
      originY: originPos.labelY,
      destX: destPos.x,
      destY: destPos.labelY,
    };
  }, [origin, destination, floor, modulePositions]);

  if (!pathData) return null;

  const pathColor = '#3b82f6'; // Blue for regular route
  const originColor = originModule?.color || '#22c55e';
  const destColor = destModule?.color || '#ef4444';

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={pathColor} />
        </marker>
      </defs>

      {/* Animated path */}
      <path
        d={pathData.path}
        fill="none"
        stroke={pathColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="12,8"
        className="route-animated"
        markerEnd="url(#arrowhead)"
      />

      {/* Origin marker ("You are here") */}
      <g className="animate-pulse">
        <circle
          cx={pathData.originX}
          cy={pathData.originY}
          r="16"
          fill={originColor}
          fillOpacity="0.3"
        />
        <circle
          cx={pathData.originX}
          cy={pathData.originY}
          r="10"
          fill={originColor}
          stroke="#ffffff"
          strokeWidth="2"
        />
        <text
          x={pathData.originX}
          y={pathData.originY + 30}
          textAnchor="middle"
          className="text-xs font-semibold fill-green-600"
        >
          {t('map.youAreHere')}
        </text>
      </g>

      {/* Destination marker */}
      <g>
        <circle
          cx={pathData.destX}
          cy={pathData.destY}
          r="14"
          fill={destColor}
          fillOpacity="0.3"
        />
        <circle
          cx={pathData.destX}
          cy={pathData.destY}
          r="8"
          fill={destColor}
          stroke="#ffffff"
          strokeWidth="2"
        />
        <text
          x={pathData.destX}
          y={pathData.destY - 16}
          textAnchor="middle"
          className="text-xs font-semibold"
          fill={destColor}
        >
          {destModule?.name.es || destination}
        </text>
      </g>
    </svg>
  );
}
