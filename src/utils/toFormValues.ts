import type { Service } from '../types/service';
import type { ServiceFormValues } from '../types/serviceForm';

/* Convertit une annonce en valeurs de formulaire pour préremplir la modification
 * Une illustration générée (URL "data:") n'est pas une URL saisie par l'utilisateur : le champ image reste vide
*/
export function toFormValues(service: Service): ServiceFormValues {
  return {
    firstName: service.firstName,
    lastName: service.lastName,
    email: service.email,
    city: service.city,
    serviceType: service.serviceType,
    title: service.title,
    price: String(service.pricePerHour),
    description: service.description,
    imageUrl: service.image.startsWith('data:') ? '' : service.image,
  };
}