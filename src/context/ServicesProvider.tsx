import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { fetchServices } from '../api/services';
import { useRequest } from '../hooks/useRequest';
import type { Service } from '../types/service';
import { ServicesContext } from './ServicesContext';

/* Charge les annonces une seule fois pour toute l'application (pas de rechargement à chaque retour sur l'accueil)
 * Les créations, modifications et suppressions confirmées par l'API sont conservées à part, par-dessus les données de
 * l'API : DummyJSON ne les enregistre pas, elles sont donc perdues au rechargement de la page
*/
export function ServicesProvider({ children }: { children: ReactNode }) {
  const { data, status, reload } = useRequest('services', fetchServices);
  const [created, setCreated] = useState<Service[]>([]);
  const [overrides, setOverrides] = useState<Record<number, Service>>({});
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  // Annonces créées en tête, puis celles de l'API avec leurs modifications
  const services = useMemo(() => {
    const fromApi = (data ?? []).map((item) => overrides[item.id] ?? item);
    return [...created, ...fromApi].filter(
      (item) => !deletedIds.includes(item.id),
    );
  }, [data, created, overrides, deletedIds]);

  /* Ajoute une annonce créée en tête de liste */
  const addService = useCallback((service: Service) => {
    setCreated((current) => [service, ...current]);
  }, []);

  /* Remplace une annonce modifiée (venant de l'API ou du formulaire) */
  const replaceService = useCallback((updated: Service) => {
    setOverrides((current) => ({ ...current, [updated.id]: updated }));
    setCreated((current) =>
      current.map((item) => (item.id === updated.id ? updated : item)),
    );
  }, []);

  /* Mémorise la suppression d'une annonce */
  const removeService = useCallback((id: number) => {
    setDeletedIds((current) => [...current, id]);
  }, []);

  const value = useMemo(
    () => ({
      services,
      deletedIds,
      status,
      reload,
      addService,
      replaceService,
      removeService,
    }),
    [
      services,
      deletedIds,
      status,
      reload,
      addService,
      replaceService,
      removeService,
    ],
  );

  return <ServicesContext value={value}>{children}</ServicesContext>;
}