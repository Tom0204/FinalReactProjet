import { useParams } from 'react-router';
import BookingForm from '../components/payment/BookingForm';
import AsyncContent from '../components/ui/AsyncContent';
import BackLink from '../components/ui/BackLink';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useService } from '../hooks/useService';

/* Page de réservation (URL /services/:id/book) : charge l'annonce puis affiche le formulaire */
export default function PaymentPage() {
  useDocumentTitle('Réserver');
  const { id = '' } = useParams();
  const { service, status, reload } = useService(id);

  return (
    <>
      <BackLink to={`/services/${id}`}>Retour à l’annonce</BackLink>
      <AsyncContent
        status={status}
        onRetry={reload}
        loadingText="Chargement de l'annonce…"
        errorText="Impossible de charger cette annonce."
      >
        {service && <BookingForm key={service.id} service={service} />}
      </AsyncContent>
    </>
  );
}