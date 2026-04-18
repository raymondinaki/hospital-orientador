import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/shared/hooks/useAppStore';
import { ModuleCard } from './ModuleCard';

export function ModuleGrid() {
  const { t } = useTranslation();
  const { modules } = useAppStore();

  return (
    <section className="py-8">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        {t('modules.title')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {modules.map((module, index) => (
          <ModuleCard key={module.id} module={module} index={index} />
        ))}
      </div>
    </section>
  );
}