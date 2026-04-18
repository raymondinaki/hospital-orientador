import { useTranslation } from 'react-i18next';

export default function EmergencyPage() {
  const { t } = useTranslation();
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">{t('emergency.title')}</h1>
      <p className="text-muted-foreground">{t('emergency.instructions')}</p>
    </div>
  );
}