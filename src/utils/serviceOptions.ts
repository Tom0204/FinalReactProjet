import type { Service } from '../types/service';

/* Types de services réellement présents dans les annonces, triés */
export function getServiceTypes(services: Service[]): string[] {
  return [...new Set(services.map((service) => service.serviceType))].sort(
    (a, b) => a.localeCompare(b, 'fr'),
  );
}

/* Paliers de tarif maximum (par pas de 10 €) calculés à partir des tarifs des annonces, pour que le filtre suive les données */
export function getPriceSteps(services: Service[]): number[] {
  if (services.length === 0) {
    return [];
  }
  const prices = services.map((service) => service.pricePerHour);
  const first = Math.ceil(Math.min(...prices) / 10) * 10;
  const last = Math.ceil(Math.max(...prices) / 10) * 10;
  const steps: number[] = [];
  for (let step = first; step <= last; step += 10) {
    steps.push(step);
  }
  return steps;
}