import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/shared/hooks/useAppStore';
import type { Module } from '@shared/types';
import type { Language } from '@shared/types';

interface ModuleMarkerProps {
  module: Module;
  x: number;
  y: number;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export function ModuleMarker({
  module,
  x,
  y,
  isSelected,
  isHovered,
  onClick,
  onHover,
}: ModuleMarkerProps) {
  const { t } = useTranslation();
  const language = useAppStore((state) => state.language);

  // Scale factor to convert SVG coordinates to percentage
  // SVG viewBox is 1000x600, so we need to scale to container
  const scaleX = 100 / 1000;
  const scaleY = 100 / 600;

  return (
    <div
      className={`
        absolute pointer-events-auto
        transform -translate-x-1/2 -translate-y-1/2
        transition-all duration-200
        ${isSelected ? 'z-20' : 'z-10'}
      `}
      style={{
        left: `${x * scaleX}%`,
        top: `${y * scaleY}%`,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        className={`
          relative flex flex-col items-center justify-center
          w-12 h-12 rounded-full
          border-2 shadow-md
          transition-all duration-200
          ${isSelected
            ? 'border-primary bg-primary/20 scale-110 module-pulse'
            : isHovered
              ? 'border-primary/70 bg-primary/10 scale-105'
              : 'border-border bg-background hover:border-primary/50 hover:bg-primary/5'
          }
        `}
        style={{
          borderColor: isSelected ? undefined : module.color,
          backgroundColor: isSelected ? undefined : `${module.color}15`,
        }}
        aria-label={`${module.name[language as Language] || module.name.es} - ${t('accessibility.moduleInfo')}`}
        aria-pressed={isSelected}
      >
        {/* Module ID */}
        <span
          className="text-xs font-bold"
          style={{ color: module.color }}
        >
          {module.id}
        </span>

        {/* Selection indicator */}
        {isSelected && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-ping" />
        )}
      </button>

      {/* Module name label */}
      <div
        className={`
          absolute left-1/2 -translate-x-1/2 mt-1
          px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap
          transition-opacity duration-200
          ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ backgroundColor: `${module.color}20`, color: module.color }}
      >
        {module.name[language as Language] || module.name.es}
      </div>
    </div>
  );
}
