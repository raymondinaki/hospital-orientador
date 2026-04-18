import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/shared/hooks/useAppStore';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';

interface FloorSwitcherProps {
  className?: string;
}

export function FloorSwitcher({ className = '' }: FloorSwitcherProps) {
  const { t } = useTranslation();
  const selectedFloor = useAppStore((state) => state.selectedFloor);
  const setFloor = useAppStore((state) => state.setFloor);

  return (
    <div
      className={`flex items-center gap-2 p-1 bg-muted rounded-lg ${className}`}
      role="tablist"
      aria-label={t('map.floorSelector')}
    >
      <Button
        variant={selectedFloor === 1 ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setFloor(1)}
        role="tab"
        aria-selected={selectedFloor === 1}
        aria-controls="floor-map"
        className={`
          flex items-center gap-2 transition-all
          ${selectedFloor === 1 ? 'animate-fade-in' : ''}
        `}
      >
        <Layers className="size-4" />
        {t('map.floor1')}
      </Button>

      <Button
        variant={selectedFloor === 2 ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setFloor(2)}
        role="tab"
        aria-selected={selectedFloor === 2}
        aria-controls="floor-map"
        className={`
          flex items-center gap-2 transition-all
          ${selectedFloor === 2 ? 'animate-fade-in' : ''}
        `}
      >
        <Layers className="size-4" />
        {t('map.floor2')}
      </Button>
    </div>
  );
}
