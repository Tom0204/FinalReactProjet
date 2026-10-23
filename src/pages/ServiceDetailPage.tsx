import { useState } from 'react';
import { useParams } from 'react-router';
import ServiceDetail from '../components/services/ServiceDetail';
import AsyncContent from '../components/ui/AsyncContent';
import BackLink from '../components/ui/BackLink';
import ConfirmationPanel from '../components/ui/ConfirmationPanel';
import LinkButton from '../components/ui/LinkButton';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useService } from '../hooks/useService';

/* Fiche détaillée d'une annonce (URL /services/:id). Fonctionne en accès direct et au rechargement : l'annonce est retrouvée
 * à partir de l'id de l'URL. Après une suppression, une confirmation remplace la fiche
*/
export default function ServiceDetailPage() {
  const { id = '' } = useParams();
  const { service, status, reload } = useService(id);
  const [deleted, setDeleted] = useState(false);
  useDocumentTitle(service ? service.title : 'Annonce');

  if (deleted) {
    return (
      <ConfirmationPanel
        title="Annonce supprimée"
        actions={<LinkButton to="/">Retour aux annonces</LinkButton>}
      >
        <p>
          L’annonce a bien été supprimée. DummyJSON simule la suppression : elle
          réapparaîtra au rechargement de la page.
        </p>
      </ConfirmationPanel>
    );
  }

  return (
    <>
      <BackLink to="/">Retour aux annonces</BackLink>
      <AsyncContent
        status={status}
        onRetry={reload}
        loadingText="Chargement de l'annonce…"
        errorText="Impossible de charger cette annonce."
      >
        {service && (
          <ServiceDetail service={service} onDeleted={() => setDeleted(true)} />
        )}
      </AsyncContent>
    </>
  );
}