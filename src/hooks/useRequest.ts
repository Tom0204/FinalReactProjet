import { useCallback, useEffect, useRef, useState } from 'react';
import { isAbortError } from '../api/client';

export type RequestStatus = 'loading' | 'error' | 'success';

interface RequestState<T> {
  key: string;
  status: RequestStatus;
  data: T | null;
}

/* Exécute une requête au montage et chaque fois que `key` change, avec annulation automatique
 * Renvoie les données, l'état (chargement, erreur, succès) et une fonction pour relancer la requête après un échec
*/
export function useRequest<T>(
  key: string,
  fetcher: (signal: AbortSignal) => Promise<T>,
) {
  const [state, setState] = useState<RequestState<T>>({
    key,
    status: 'loading',
    data: null,
  });
  const [attempt, setAttempt] = useState(0);

  // On garde la dernière version de `fetcher` sans relancer la requête quand sa référence change à chaque rendu
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    const controller = new AbortController();
    fetcherRef
      .current(controller.signal)
      .then((data) => setState({ key, status: 'success', data }))
      .catch((error: unknown) => {
        // Une requête annulée (démontage, changement de clé) n'est pas une erreur
        if (!isAbortError(error)) {
          setState({ key, status: 'error', data: null });
        }
      });
    return () => controller.abort();
  }, [key, attempt]);

  /* Relance la requête (repasse en chargement) */
  const reload = useCallback(() => {
    setState({ key, status: 'loading', data: null });
    setAttempt((value) => value + 1);
  }, [key]);

  // Si la clé a changé, l'état stocké est périmé : on affiche le chargement
  const current: RequestState<T> =
    state.key === key ? state : { key, status: 'loading', data: null };

  return { data: current.data, status: current.status, reload };
}