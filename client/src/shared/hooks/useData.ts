import { useEffect, useState } from 'react';
import { useAppStore } from './useAppStore';
import type { Module, Specialty, Tip } from '@shared/types';

// Embedded fallback data (backup if fetch fails)
const DEFAULT_SPECIALTIES: Specialty[] = [
  { id: 'ped', name: { es: 'Pediatría', ht: 'Pedyatrik', en: 'Pediatrics', arn: 'Pedyatrik' }, module: 'A', floor: 1 },
  { id: 'cardio-adult', name: { es: 'Cardiología', ht: 'Kadyoloji', en: 'Cardiology', arn: 'Kadyoloji' }, module: 'C2', floor: 1 },
  { id: 'neuro-adult', name: { es: 'Neurología', ht: 'Neyoloji', en: 'Neurology', arn: 'Neyoloji' }, module: 'D', floor: 2 },
];

const DEFAULT_MODULES: Module[] = [
  { id: 'A', name: { es: 'Módulo A', ht: 'Modil A', en: 'Module A', arn: 'Modil A' }, color: '#2E86C1', floor: 1, location: { es: 'Abajo del pasillo', ht: 'Anba ranpa', en: 'Below the hallway', arn: 'Anba ranpa' }, specialties: ['ped'] },
  { id: 'C2', name: { es: 'Módulo C2', ht: 'Modil C2', en: 'Module C2', arn: 'Modil C2' }, color: '#C0392B', floor: 1, location: { es: 'Lado derecho', ht: 'Kote dwat', en: 'Right side', arn: 'Kote dwat' }, specialties: ['cardio-adult'] },
  { id: 'D', name: { es: 'Módulo D', ht: 'Modil D', en: 'Module D', arn: 'Modil D' }, color: '#1E8449', floor: 2, location: { es: 'Arriba del pasillo', ht: 'Anwo ranpa', en: 'Above the hallway', arn: 'Anwo ranpa' }, specialties: ['neuro-adult'] },
];

const DEFAULT_TIPS: Tip[] = [];

interface UseDataReturn {
  isLoading: boolean;
  isError: boolean;
  specialties: Specialty[];
  modules: Module[];
  tips: Tip[];
}

export function useData(): UseDataReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const { specialties, modules, tips, dataLoaded, setSpecialties, setModules, setTips, setDataLoaded } = useAppStore();

  useEffect(() => {
    // Already loaded - no need to refetch
    if (dataLoaded) {
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      setIsError(false);

      try {
        const baseUrl = '/data';

        const [specRes, modRes, tipsRes] = await Promise.all([
          fetch(`${baseUrl}/specialties.json`),
          fetch(`${baseUrl}/modules.json`),
          fetch(`${baseUrl}/tips.json`),
        ]);

        if (!specRes.ok || !modRes.ok || !tipsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const [specData, modData, tipsData] = await Promise.all([
          specRes.json() as Promise<Specialty[]>,
          modRes.json() as Promise<Module[]>,
          tipsRes.json() as Promise<Tip[]>,
        ]);

        setSpecialties(specData);
        setModules(modData);
        setTips(tipsData);
        setDataLoaded(true);
      } catch (err) {
        console.error('Failed to load data:', err);
        setIsError(true);
        // Use fallback data
        setSpecialties(DEFAULT_SPECIALTIES);
        setModules(DEFAULT_MODULES);
        setTips(DEFAULT_TIPS);
        setDataLoaded(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [dataLoaded, setSpecialties, setModules, setTips, setDataLoaded]);

  return {
    isLoading,
    isError,
    specialties,
    modules,
    tips,
  };
}