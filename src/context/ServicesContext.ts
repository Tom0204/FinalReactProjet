import { createContext } from 'react';
import type { RequestStatus } from '../hooks/useRequest';
import type { Service } from '../types/service';

/* Liste des annonces partagée par toute l'application */
export interface ServicesContextValue {
  /* Annonces de l'API (avec modifications) + annonces créées, sans les supprimées */
  services: Service[];
  /* Ids des annonces supprimées (le serveur ne les supprime pas vraiment) */
  deletedIds: number[];
  status: RequestStatus;
  reload: () => void;
  addService: (service: Service) => void;
  replaceService: (service: Service) => void;
  removeService: (id: number) => void;
}

/* Contexte React des annonces (null hors du provider) */
export const ServicesContext = createContext<ServicesContextValue | null>(null);