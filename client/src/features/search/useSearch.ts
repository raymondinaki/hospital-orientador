import { useMemo, useState, useEffect } from 'react';
import { useAppStore } from '@/shared/hooks/useAppStore';
import type { Specialty, Module } from '@shared/types';
import type { Language } from '@shared/types';

export interface SearchResult {
  specialty: Specialty;
  module: Module | undefined;
}

interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  resultCount: number;
  popularSpecialties: Specialty[];
  recentSearches: string[];
  clearRecentSearches: () => void;
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const { specialties, modules, recentSearches, clearRecentSearches } = useAppStore();
  const language = useAppStore((state) => state.language);

  // Debounced search
  useEffect(() => {
    if (query.trim().length === 0) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fuzzy match across all language versions of specialty names
  const results = useMemo(() => {
    if (query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const matchedSpecialties: Specialty[] = [];

    for (const specialty of specialties) {
      // Search across all language versions of the name
      const names: string[] = [
        specialty.name.es,
        specialty.name.ht,
        specialty.name.en,
        specialty.name.arn,
      ];

      // Also include description if available
      if (specialty.description) {
        names.push(
          specialty.description.es,
          specialty.description.ht,
          specialty.description.en,
          specialty.description.arn,
        );
      }

      // Check if any name contains the search term (fuzzy)
      const isMatch = names.some(
        (name) => name && name.toLowerCase().includes(searchTerm)
      );

      if (isMatch) {
        matchedSpecialties.push(specialty);
      }
    }

    // Sort by relevance (exact match first)
    matchedSpecialties.sort((a, b) => {
      const aName = a.name[language as Language] || a.name.es;
      const bName = b.name[language as Language] || b.name.es;
      const aExact = aName.toLowerCase().startsWith(searchTerm);
      const bExact = bName.toLowerCase().startsWith(searchTerm);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });

    return matchedSpecialties.map((specialty) => ({
      specialty,
      module: modules.find((m) => m.id === specialty.module),
    }));
  }, [query, specialties, modules, language]);

  // Popular specialties (first 8)
  const popularSpecialties = useMemo(() => {
    return specialties.slice(0, 8);
  }, [specialties]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    resultCount: results.length,
    popularSpecialties,
    recentSearches,
    clearRecentSearches,
  };
}