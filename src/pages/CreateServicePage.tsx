import { useState } from 'react';
import { createService } from '../api/services';
import ServiceForm from '../components/forms/ServiceForm';
import ServiceSummary from '../components/services/ServiceSummary';
import Button from '../components/ui/Button';
import ConfirmationPanel from '../components/ui/ConfirmationPanel';
import LinkButton from '../components/ui/LinkButton';
import RequiredNote from '../components/ui/RequiredNote';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useServices } from '../hooks/useServices';
import type { Service } from '../types/service';
import {
  INITIAL_FORM_VALUES,
  type ServiceFormValues,
} from '../types/serviceForm';

/* Page de création d'annonce (CREATE) : affiche le formulaire, puis une confirmation construite à partir de la réponse de l'API */
export default function CreateServicePage() {
  useDocumentTitle('Publier une annonce');
  const { addService } = useServices();
  const [created, setCreated] = useState<Service | null>(null);
  // Changer la clé recrée un formulaire vide pour une nouvelle annonce
  const [formKey, setFormKey] = useState(0);

  /* Envoie l'annonce puis l'ajoute à la liste locale */
  async function handleSubmit(values: ServiceFormValues) {
    const service = await createService(values);
    addService(service);
    setCreated(service);
  }

  /* Revient à un formulaire vide */
  function handleReset() {
    setCreated(null);
    setFormKey((key) => key + 1);
  }

  if (created) {
    return (
      <ConfirmationPanel
        title="Annonce publiée"
        actions={
          <>
            <LinkButton to={`/services/${created.id}`}>
              Voir l’annonce
            </LinkButton>
            <Button variant="secondary" onClick={handleReset}>
              Publier une autre annonce
            </Button>
          </>
        }
      >
        <p>
          Votre annonce a bien été envoyée. DummyJSON simule la création : elle
          reste visible dans l’application jusqu’au rechargement de la page.
        </p>
        <ServiceSummary service={created} />
      </ConfirmationPanel>
    );
  }

  return (
    <>
      <h1>Publier une annonce</h1>
      <RequiredNote />
      <ServiceForm
        key={formKey}
        initialValues={INITIAL_FORM_VALUES}
        submitLabel="Publier l’annonce"
        onSubmit={handleSubmit}
      />
    </>
  );
}