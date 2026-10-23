/* Plat proposé par un prestataire de cuisine */
export interface Dish {
  name: string;
  cuisine: string;
  difficulty: string;
  prepMinutes: number;
  cookMinutes: number;
  servings: number;
}

/* Une annonce de service proposée par un particulier. Pour les annonces issues de DummyJSON, tout vient de l'API (utilisateurs,
 * recettes, publications) sauf le type de service, le titre générique, la description générique et le tarif
 * Les annonces créées via le formulaire n'ont pas les champs optionnels
*/
export interface Service {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  city: string;
  serviceType: string;
  title: string;
  description: string;
  pricePerHour: number;
  rating: number;
  reviewsCount: number;
  age?: number;
  phone?: string;
  region?: string;
  country?: string;
  profession?: string;
  dish?: Dish;
  /* Vrai pour une annonce créée dans l'appli (inconnue du serveur DummyJSON) */
  local?: boolean;
}