import { SERVICE_CATALOG } from '../config/serviceCatalog';
import type { Service } from '../types/service';

/* Génère l'illustration d'un type de service : un émoji sur fond coloré, sous forme d'image SVG encodée dans une URL "data:" 
 * (aucun fichier ni service externe nécessaire)
*/
export function getServiceImage(type: string): string {
  const template = SERVICE_CATALOG.find((item) => item.type === type);
  const emoji = template?.emoji ?? '🤝';
  const color = template?.color ?? '#eceef5';
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">` +
    `<rect width="400" height="400" fill="${color}"/>` +
    `<text x="200" y="215" font-size="180" text-anchor="middle" ` +
    `dominant-baseline="central" font-family="'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif">${emoji}</text>` +
    `</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/* Texte alternatif de l'image d'une annonce (photo de plat ou illustration) */
export function getServiceImageAlt(service: Service): string {
  return service.dish
    ? `Photo du plat « ${service.dish.name} »`
    : `Illustration du service ${service.serviceType}`;
}