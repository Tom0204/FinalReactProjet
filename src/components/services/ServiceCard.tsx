import { Link } from 'react-router';
import type { Service } from '../../types/service';
import { formatPrice, formatRating } from '../../utils/format';
import { getServiceImageAlt } from '../../utils/serviceImage';
import SaveButton from './SaveButton';
import './ServiceCard.css';

/* Carte d'une annonce : image, titre (lien vers la fiche), type de service, prestataire, ville, tarif, note et bouton sauvegarde */
export default function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="card">
      <img
        className="card__image"
        src={service.image}
        alt={getServiceImageAlt(service)}
        loading="lazy"
      />
      <div className="card__body">
        <p className="service-type">{service.serviceType}</p>
        <h2 className="card__title">
          <Link to={`/services/${service.id}`} className="card__link">
            {service.title}
          </Link>
        </h2>
        <p className="card__meta">
          {service.firstName} {service.lastName.charAt(0)}. · {service.city}
        </p>
        <p className="service-price">{formatPrice(service.pricePerHour)}</p>
        <p className="card__meta">Note : {formatRating(service)}</p>
        <div className="card__actions">
          <SaveButton service={service} />
        </div>
      </div>
    </article>
  );
}