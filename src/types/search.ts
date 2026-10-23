/* Critères de recherche et de filtrage de la liste */
export interface SearchCriteria {
  /* Texte libre recherché */
  query: string;
  /* Type de service sélectionné ("" = tous les types) */
  serviceType: string;
  /* Tarif horaire maximum (null = pas de limite) */
  maxPrice: number | null;
}

/* Critères par défaut : aucun filtre actif */
export const DEFAULT_CRITERIA: SearchCriteria = {
  query: '',
  serviceType: '',
  maxPrice: null,
};