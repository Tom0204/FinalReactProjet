import type { Service } from '../../types/service';
import { formatPrice } from '../../utils/format';
import { getServiceImageAlt } from '../../utils/serviceImage';
import DescriptionList from '../ui/DescriptionList';
import './ServiceSummary.css';

/* Récapitulatif d'une annonce (image et informations clés), utilisé dans les confirmations */
export default function ServiceSummary({ service }: { service: Service }) {
  return (
    <>
      <img
        className="summary-image"
        src={service.image}
        alt={getServiceImageAlt(service)}
      />
      <DescriptionList
        items={[
          { label: 'Titre', value: service.title },
          { label: 'Type de service', value: service.serviceType },
          { label: 'Tarif', value: formatPrice(service.pricePerHour) },
          {
            label: 'Prestataire',
            value: `${service.firstName} ${service.lastName}`,
          },
          { label: 'Localisation', value: service.city },
          { label: 'E-mail', value: service.email },
          { label: 'Description', value: service.description },
        ]}
      />
    </>
  );
}