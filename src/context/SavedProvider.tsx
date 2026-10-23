import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Service } from '../types/service';
import { SavedContext } from './SavedContext';

const STORAGE_KEY = 'saved-services';

/* Lit les annonces sauvegardées dans le localStorage
 * Renvoie une liste vide si la donnée est absente, illisible ou invalide
*/
function loadSaved(): Service[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item): item is Service =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as { id?: unknown }).id === 'number',
    );
  } catch {
    return [];
  }
}

/* Gère les annonces sauvegardées : stockées dans le localStorage et restaurées au chargement
 * Une annonce est identifiée par son id, elle ne peut donc pas être ajoutée deux fois
 * On stocke l'annonce complète pour pouvoir l'afficher même si elle ne vient pas de l'API (annonce créée)
*/
export function SavedProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<Service[]>(loadSaved);

  // Écrit la liste dans le localStorage à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    } catch {
      // Stockage indisponible (mode privé, quota) : l'appli reste utilisable
    }
  }, [saved]);

  /* Indique si l'annonce est déjà sauvegardée */
  const isSaved = useCallback(
    (id: number) => saved.some((service) => service.id === id),
    [saved],
  );

  /* Sauvegarde l'annonce si elle ne l'est pas, la retire sinon */
  const toggleSaved = useCallback((service: Service) => {
    setSaved((current) =>
      current.some((item) => item.id === service.id)
        ? current.filter((item) => item.id !== service.id)
        : [...current, service],
    );
  }, []);

  /* Met à jour la copie d'une annonce déjà sauvegardée (après modification) */
  const updateSaved = useCallback((service: Service) => {
    setSaved((current) =>
      current.map((item) => (item.id === service.id ? service : item)),
    );
  }, []);

  /* Retire une annonce des sauvegardes (après suppression) */
  const removeSaved = useCallback((id: number) => {
    setSaved((current) => current.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(
    () => ({ saved, isSaved, toggleSaved, updateSaved, removeSaved }),
    [saved, isSaved, toggleSaved, updateSaved, removeSaved],
  );

  return <SavedContext value={value}>{children}</SavedContext>;
}