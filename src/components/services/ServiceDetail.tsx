import type { Service } from '../../types/service';
import { formatPrice } from '../../utils/format';
import { getServiceImageAlt } from '../../utils/serviceImage';
import ServiceActions from './ServiceActions';
import ServiceInfoList from './ServiceInfoList';
import './ServiceDetail.css';

interface ServiceDetailProps {
  service: Service;
  onDeleted: () => void;
}

/* Fiche détaillée d'une annonce : image, texte, actions et informations */
export default function ServiceDetail({
  service,
  onDeleted,
}: ServiceDetailProps) {
  return (
    <article className="detail">
      <img
        className="detail__image"
        src={service.image}
        alt={getServiceImageAlt(service)}
      />
      <div className="detail__content">
        <p className="service-type">{service.serviceType}</p>
        <h1>{service.title}</h1>
        <p className="service-price">{formatPrice(service.pricePerHour)}</p>
        <p>{service.description}</p>
        <ServiceActions service={service} onDeleted={onDeleted} />
        <ServiceInfoList service={service} />
      </div>
    </article>
  );
}