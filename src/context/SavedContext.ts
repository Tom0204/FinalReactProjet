import { createContext } from 'react';
import type { Service } from '../types/service';

/* Annonces sauvegardées par l'utilisateur */
export interface SavedContextValue {
  saved: Service[];
  isSaved: (id: number) => boolean;
  toggleSaved: (service: Service) => void;
  /* Met à jour la copie sauvegardée d'une annonce modifiée */
  updateSaved: (service: Service) => void;
  /* Retire une annonce supprimée des sauvegardes */
  removeSaved: (id: number) => void;
}

/* Contexte React des sauvegardes (null hors du provider) */
export const SavedContext = createContext<SavedContextValue | null>(null);