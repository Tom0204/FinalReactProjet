import type { BookingConfirmationData } from '../../types/payment';
import type { Service } from '../../types/service';
import { formatAmount } from '../../utils/format';
import ConfirmationPanel from '../ui/ConfirmationPanel';
import DescriptionList from '../ui/DescriptionList';
import LinkButton from '../ui/LinkButton';

interface BookingConfirmationProps {
  service: Service;
  confirmation: BookingConfirmationData;
}

/* Confirmation d'une réservation (paiement fictif accepté) */
export default function BookingConfirmation({
  service,
  confirmation,
}: BookingConfirmationProps) {
  return (
    <ConfirmationPanel
      title="Réservation confirmée"
      actions={
        <>
          <LinkButton to={`/services/${service.id}`}>
            Retour à l’annonce
          </LinkButton>
          <LinkButton to="/" variant="secondary">
            Voir d’autres annonces
          </LinkButton>
        </>
      }
    >
      <p>
        Paiement fictif accepté : aucun montant n’a été débité. La commande a
        été simulée par l’API.
      </p>
      <DescriptionList
        items={[
          { label: 'Référence', value: `Commande n° ${confirmation.orderId}` },
          { label: 'Service', value: service.title },
          {
            label: 'Prestataire',
            value: `${service.firstName} ${service.lastName}`,
          },
          { label: 'Date', value: confirmation.date },
          { label: 'Durée', value: `${confirmation.hours} h` },
          { label: 'Total', value: formatAmount(confirmation.total) },
          {
            label: 'Carte',
            value: `se terminant par ${confirmation.lastDigits}`,
          },
        ]}
      />
    </ConfirmationPanel>
  );
}