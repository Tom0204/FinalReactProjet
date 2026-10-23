import type { Service } from '../types/service';
import { sendJson } from './client';

/* Résultat d'une réservation acceptée par l'API */
export interface BookingResult {
  orderId: number;
}

/* Enregistre la réservation (POST /carts/add, JSON) et renvoie son numéro
 * DummyJSON n'a ni endpoint de paiement ni de réservation : /carts/add est le plus proche, il simule la création d'une commande
 * (userId + liste de produits {id, quantity}) sans l'enregistrer. Le "produit" est ici l'annonce et la quantité est la durée
 * en heures. Les ids de produits DummyJSON allant de 1 à 100 au moins, l'id de l'annonce est ramené dans cette plage
 * Aucune donnée de carte n'est envoyée : le paiement est entièrement fictif et reste dans le navigateur
*/
export async function createBooking(
  service: Service,
  hours: number,
): Promise<BookingResult> {
  const data = await sendJson<{ id: number }>('/carts/add', 'POST', {
    userId: 1,
    products: [{ id: ((service.id - 1) % 100) + 1, quantity: hours }],
  });
  return { orderId: data.id };
}