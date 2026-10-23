import type { Service } from '../../types/service';
import ServiceCard from './ServiceCard';

/* Grille responsive de cartes d'annonces */
export default function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="grid">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}