import { useContext } from 'react';
import { SearchContext } from '../context/SearchContext';

/* Accède aux critères de recherche, doit être utilisé sous SearchProvider */
export function useSearch() {
  const context = useContext(SearchContext);
  if (context === null) {
    throw new Error('useSearch doit être utilisé dans un SearchProvider');
  }
  return context;
}