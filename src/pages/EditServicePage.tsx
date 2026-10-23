import { useState } from 'react';
import { useParams } from 'react-router';
import { updateService } from '../api/services';
import ServiceForm from '../components/forms/ServiceForm';
import ServiceSummary from '../components/services/ServiceSummary';
import AsyncContent from '../components/ui/AsyncContent';
import BackLink from '../components/ui/BackLink';
import ConfirmationPanel from '../components/ui/ConfirmationPanel';
import LinkButton from '../components/ui/LinkButton';
import RequiredNote from '../components/ui/RequiredNote';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSaved } from '../hooks/useSaved';
import { useService } from '../hooks/useService';
import { useServices } from '../hooks/useServices';
import type { Service } from '../types/service';
import type { ServiceFormValues } from '../types/serviceForm';
import { toFormValues } from '../utils/toFormValues';

/* Page de modification d'une annonce (UPDATE), URL /services/:id/edit.
 * Le formulaire est prérempli, après succès, la liste et les sauvegardes sont mises à jour avec la réponse de l'API
*/
export default function EditServicePage() {
  useDocumentTitle('Modifier l’annonce');
  const { id = '' } = useParams();
  const { service, status, reload } = useService(id);
  const { replaceService } = useServices();
  const { updateSaved } = useSaved();
  const [updated, setUpdated] = useState<Service | null>(null);

  /* Envoie la modification puis met à jour l'interface */
  async function handleSubmit(values: ServiceFormValues) {
    if (!service) {
      return;
    }
    const result = await updateService(service, values);
    replaceService(result);
    updateSaved(result);
    setUpdated(result);
  }

  return (
    <>
      <BackLink to={`/services/${id}`}>Retour à l’annonce</BackLink>

      {updated ? (
        <ConfirmationPanel
          title="Annonce modifiée"
          actions={
            <LinkButton to={`/services/${updated.id}`}>
              Voir l’annonce
            </LinkButton>
          }
        >
          <p>
            La modification a bien été envoyée. DummyJSON simule la mise à jour
            : elle reste visible jusqu’au rechargement de la page.
          </p>
          <ServiceSummary service={updated} />
        </ConfirmationPanel>
      ) : (
        <AsyncContent
          status={status}
          onRetry={reload}
          loadingText="Chargement de l'annonce…"
          errorText="Impossible de charger cette annonce."
        >
          {service && (
            <>
              <h1>Modifier l’annonce</h1>
              <RequiredNote />
              <ServiceForm
                key={service.id}
                initialValues={toFormValues(service)}
                submitLabel="Enregistrer les modifications"
                onSubmit={handleSubmit}
              />
            </>
          )}
        </AsyncContent>
      )}
    </>
  );
}