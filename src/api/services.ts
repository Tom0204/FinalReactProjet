import type { Service } from '../types/service';
import type { ServiceFormValues } from '../types/serviceForm';
import { getServiceImage } from '../utils/serviceImage';
import { buildServices } from '../utils/buildServices';
import { isAbortError, request, sendJson } from './client';
import { fetchPosts } from './posts';
import { fetchRecipes } from './recipes';
import { fetchUsers } from './users';

/* Exécute une requête secondaire : si elle échoue, on continue sans ses données (liste vide) plutôt que de bloquer toute
 * l'application. Une annulation volontaire est propagée
*/
async function optional<T>(promise: Promise<T[]>): Promise<T[]> {
  try {
    return await promise;
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }
    return [];
  }
}

/* Récupère toutes les annonces en croisant trois ressources DummyJSON : les utilisateurs (prestataires, obligatoire),
 * les recettes (annonces de cuisine) et les publications (note), ces deux dernières étant facultatives
 * Choix recherche/filtres/pagination : côté CLIENT
 * DummyJSON ne permet pas de combiner une recherche textuelle et plusieurs filtres (type de service, prix) dans une même requête,
 * et le type et le prix d'une annonce n'existent pas dans l'API (ils sont définis côté client)
 * On charge donc la liste complète (~200 éléments, allégée grâce à `select`) puis on filtre et on pagine en local :
 * chaque résultat respecte tous les critères, sur l'ensemble des données
*/
export async function fetchServices(signal?: AbortSignal): Promise<Service[]> {
  const [users, recipes, posts] = await Promise.all([
    fetchUsers(signal),
    optional(fetchRecipes(signal)),
    optional(fetchPosts(signal)),
  ]);
  return buildServices(users, recipes, posts);
}

/* Corps JSON envoyé à DummyJSON pour créer ou modifier une annonce */
function buildPayload(values: ServiceFormValues) {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    address: { city: values.city.trim() },
    serviceType: values.serviceType,
    title: values.title.trim(),
    pricePerHour: Number(values.price),
    description: values.description.trim(),
    image: values.imageUrl.trim(),
  };
}

type Payload = ReturnType<typeof buildPayload>;

/* Champs que l'on espère retrouver dans la réponse de DummyJSON */
interface ServiceResponse {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  address?: { city?: string };
  serviceType?: string;
  title?: string;
  pricePerHour?: number | string;
  description?: string;
  image?: string;
}

/* Construit les champs d'une annonce à partir de la RÉPONSE de l'API : pour un champ absent de la réponse, on se rabat sur
 * la valeur envoyée
 * L'image n'est reprise de la réponse que si une URL a été saisie : sinon (surtout en modification) l'API renverrait
 * l'avatar d'origine du prestataire, d'où une illustration du type de service à la place
*/
function fromResponse(payload: Payload, data: ServiceResponse) {
  const serviceType = data.serviceType ?? payload.serviceType;
  return {
    firstName: data.firstName ?? payload.firstName,
    lastName: data.lastName ?? payload.lastName,
    email: data.email ?? payload.email,
    city: data.address?.city ?? payload.address.city,
    serviceType,
    title: data.title ?? payload.title,
    description: data.description ?? payload.description,
    pricePerHour: Number(data.pricePerHour ?? payload.pricePerHour),
    image:
      payload.image === ''
        ? getServiceImage(serviceType)
        : (data.image ?? payload.image),
  };
}

/* CREATE : envoie la nouvelle annonce (POST /users/add, JSON) et renvoie l'annonce construite à partir de la réponse de l'API
 * Lève une erreur si la réponse HTTP n'est pas un succès
 * DummyJSON simule la création sans l'enregistrer et renvoie toujours le même id : on attribue un id local unique pour
 * distinguer plusieurs annonces créées (et les sauvegarder sans collision)
 */
export async function createService(
  values: ServiceFormValues,
): Promise<Service> {
  const payload = buildPayload(values);
  const data = await sendJson<ServiceResponse>('/users/add', 'POST', payload);
  return {
    id: Date.now(),
    local: true,
    rating: 0,
    reviewsCount: 0,
    ...fromResponse(payload, data),
  };
}

/* UPDATE : modifie une annonce (PUT /users/:id, JSON) et renvoie l'annonce mise à jour
 * Une annonce créée localement n'existe pas sur le serveur (DummyJSON répondrait 404) : elle est donc modifiée sans requête
*/
export async function updateService(
  service: Service,
  values: ServiceFormValues,
): Promise<Service> {
  const payload = buildPayload(values);
  if (service.local) {
    return { ...service, ...fromResponse(payload, {}) };
  }
  const data = await sendJson<ServiceResponse>(
    `/users/${service.id}`,
    'PUT',
    payload,
  );
  return { ...service, ...fromResponse(payload, data) };
}

/* DELETE : supprime une annonce (DELETE /users/:id). Comme pour la modification, une annonce créée localement est supprimée
 * sans requête. Lève une erreur si la réponse HTTP n'est pas un succès
*/
export async function deleteService(service: Service): Promise<void> {
  if (service.local) {
    return;
  }
  await request<unknown>(`/users/${service.id}`, { method: 'DELETE' });
}