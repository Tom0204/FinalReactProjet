import { createContext } from 'react';
import type { SearchCriteria } from '../types/search';

/* Critères de recherche et page courante, conservés pendant la navigation */
export interface SearchContextValue {
  criteria: SearchCriteria;
  page: number;
  updateCriteria: (changes: Partial<SearchCriteria>) => void;
  resetCriteria: () => void;
  setPage: (page: number) => void;
}

/* Contexte React des critères de recherche (null hors du provider) */
export const SearchContext = createContext<SearchContextValue | null>(null);
