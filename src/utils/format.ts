/** Formate un montant en euros selon les conventions françaises. */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Formate un tarif horaire en euros ("20 € / h"). */
export function formatPrice(price: number): string {
  return `${formatAmount(price)} / h`;
}

/* Texte de la note d'une annonce : "4.3 / 5", "4.3 / 5 (217 avis)" ou "Pas encore d'avis" quand personne n'a encore réagi */
export function formatRating(
  service: { rating: number; reviewsCount: number },
  withCount = false,
): string {
  if (service.reviewsCount === 0) {
    return 'Pas encore d’avis';
  }
  const rating = `${service.rating.toFixed(1)} / 5`;
  return withCount ? `${rating} (${service.reviewsCount} avis)` : rating;
}