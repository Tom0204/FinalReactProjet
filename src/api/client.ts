export const API_URL = 'https://dummyjson.com';

/* Erreur levée quand l'API répond avec un statut HTTP d'échec */
export class HttpError extends Error {
  status: number;

  constructor(status: number) {
    super(`Erreur HTTP ${status}`);
    this.status = status;
  }
}

/* Indique si une erreur vient d'une requête annulée (AbortController) */
export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

/* Envoie une requête à l'API et renvoie le JSON de la réponse
 * Lève une HttpError si le statut HTTP n'est pas un succès
*/
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, init);
  if (!response.ok) {
    throw new HttpError(response.status);
  }
  return (await response.json()) as T;
}

/* Envoie un corps JSON (POST ou PUT) avec le header Content-Type adapté */
export function sendJson<T>(
  path: string,
  method: 'POST' | 'PUT',
  body: unknown,
): Promise<T> {
  return request<T>(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}