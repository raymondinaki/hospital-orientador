import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, Module, Specialty, Tip } from '@shared/types';

export type { Language, Module, Specialty, Tip };

interface AppState {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // Recent searches (persisted)
  recentSearches: string[];
  addRecentSearch: (id: string) => void;
  clearRecentSearches: () => void;

  // Map state
  selectedFloor: 1 | 2;
  setFloor: (floor: 1 | 2) => void;
  selectedModule: string | null;
  setSelectedModule: (moduleId: string | null) => void;

  // Navigation
  routeOrigin: string | null;
  routeDestination: string | null;
  setRoute: (origin: string | null, destination: string | null) => void;
  clearRoute: () => void;

  // Data
  specialties: Specialty[];
  modules: Module[];
  tips: Tip[];
  dataLoaded: boolean;
  setSpecialties: (specialties: Specialty[]) => void;
  setModules: (modules: Module[]) => void;
  setTips: (tips: Tip[]) => void;
  setDataLoaded: (loaded: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Language - not persisted (always starts with detector)
      language: 'es',
      setLanguage: (lang) => set({ language: lang }),

      // Recent searches - persisted
      recentSearches: [],
      addRecentSearch: (id) =>
        set((state) => {
          const filtered = state.recentSearches.filter((s) => s !== id);
          return { recentSearches: [id, ...filtered].slice(0, 5) };
        }),
      clearRecentSearches: () => set({ recentSearches: [] }),

      // Map state
      selectedFloor: 1,
      setFloor: (floor) => set({ selectedFloor: floor }),
      selectedModule: null,
      setSelectedModule: (moduleId) => set({ selectedModule: moduleId }),

      // Navigation
      routeOrigin: null,
      routeDestination: null,
      setRoute: (origin, destination) => set({ routeOrigin: origin, routeDestination: destination }),
      clearRoute: () => set({ routeOrigin: null, routeDestination: null }),

      // Data
      specialties: [],
      modules: [],
      tips: [],
      dataLoaded: false,
      setSpecialties: (specialties) => set({ specialties }),
      setModules: (modules) => set({ modules }),
      setTips: (tips) => set({ tips }),
      setDataLoaded: (loaded) => set({ dataLoaded: loaded }),
    }),
    {
      name: 'hospital-orientador-storage',
      partialize: (state) => ({
        // Only persist these fields
        recentSearches: state.recentSearches,
      }),
    }
  )
);