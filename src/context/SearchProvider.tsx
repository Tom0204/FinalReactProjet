import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_CRITERIA, type SearchCriteria } from '../types/search';
import { SearchContext } from './SearchContext';

/* Fournit les critères de recherche et la page courante à toute l'application
 * Placé au-dessus du routeur, il conserve les critères lors d'un aller-retour entre la liste et une fiche de détail
*/
export function SearchProvider({ children }: { children: ReactNode }) {
  const [criteria, setCriteria] = useState<SearchCriteria>(DEFAULT_CRITERIA);
  const [page, setPage] = useState(1);

  /* Modifie un ou plusieurs critères et ramène à la première page */
  const updateCriteria = useCallback((changes: Partial<SearchCriteria>) => {
    setCriteria((current) => ({ ...current, ...changes }));
    setPage(1);
  }, []);

  /* Supprime tous les critères et ramène à la première page */
  const resetCriteria = useCallback(() => {
    setCriteria(DEFAULT_CRITERIA);
    setPage(1);
  }, []);

  const value = useMemo(
    () => ({ criteria, page, updateCriteria, resetCriteria, setPage }),
    [criteria, page, updateCriteria, resetCriteria],
  );

  return <SearchContext value={value}>{children}</SearchContext>;
}