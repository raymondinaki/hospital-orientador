import { useTranslation } from 'react-i18next';

export default function MapPage() {
  const { t } = useTranslation();
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">{t('map.floorSelector')}</h1>
      <p className="text-muted-foreground">Mapa interactivo - Fase 4</p>
    </div>
  );
}