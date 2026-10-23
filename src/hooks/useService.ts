import { useSaved } from './useSaved';
import { useServices } from './useServices';

/* Renvoie une annonce par son id (paramètre d'URL) avec son état : chargement, erreur, introuvable ou succès
 * et une fonction pour réessayer. L'annonce est cherchée dans la liste déjà chargée (qui contient aussi les modifications
 * et les créations, que le serveur ne conserve pas), puis dans les sauvegardes
 * Un accès direct à l'URL attend simplement la fin du chargement de la liste. Une annonce supprimée est "introuvable"
*/
export function useService(id: string) {
  const { services, deletedIds, status, reload } = useServices();
  const { saved } = useSaved();

  if (deletedIds.includes(Number(id))) {
    return { service: null, status: 'notfound' as const, reload };
  }
  const service =
    services.find((item) => String(item.id) === id) ??
    saved.find((item) => String(item.id) === id);
  if (service) {
    return { service, status: 'success' as const, reload };
  }
  if (status === 'success') {
    return { service: null, status: 'notfound' as const, reload };
  }
  return { service: null, status, reload };
}
