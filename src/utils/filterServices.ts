import type { SearchCriteria } from '../types/search';
import type { Service } from '../types/service';

/* Nombre de cartes affichées par page */
export const PAGE_SIZE = 20;

/* Met en minuscules et retire les accents */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/* Applique tous les critères : texte (titre, description, type, nom du prestataire, ville), type de service et tarif maximum
 * Un service n'est conservé que s'il respecte chacun des critères
*/
export function filterServices(
  services: Service[],
  criteria: SearchCriteria,
): Service[] {
  const search = normalize(criteria.query.trim());

  return services.filter((service) => {
    if (criteria.serviceType && service.serviceType !== criteria.serviceType) {
      return false;
    }
    if (
      criteria.maxPrice !== null &&
      service.pricePerHour > criteria.maxPrice
    ) {
      return false;
    }
    if (search === '') {
      return true;
    }
    const text = normalize(
      [
        service.title,
        service.description,
        service.serviceType,
        service.firstName,
        service.lastName,
        service.city,
      ].join(' '),
    );
    return text.includes(search);
  });
}

/* Extrait les éléments de la page demandée */
export function paginate<T>(items: T[], page: number): T[] {
  const start = (page - 1) * PAGE_SIZE;
  return items.slice(start, start + PAGE_SIZE);
}