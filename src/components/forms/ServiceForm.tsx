import { useState, type FormEvent } from 'react';
import { SERVICE_TYPES } from '../../config/serviceCatalog';
import type { ServiceFormValues } from '../../types/serviceForm';
import { validateServiceForm } from '../../utils/validateServiceForm';
import Button from '../ui/Button';
import Field from '../ui/Field';
import Form, { FormGrid } from '../ui/Form';
import Message from '../ui/Message';

const TYPE_OPTIONS = SERVICE_TYPES.map((type) => ({
  value: type,
  label: type,
}));

interface ServiceFormProps {
  initialValues: ServiceFormValues;
  submitLabel: string;
  /* Envoie les valeurs, doit lever une erreur si l'envoi échoue */
  onSubmit: (values: ServiceFormValues) => Promise<void>;
}

type Status = 'idle' | 'submitting' | 'error';

/* Formulaire d'annonce réutilisé pour la création et la modification : champs contrôlés, validation avant envoi, indicateur
 * d'envoi, bouton désactivé pendant l'envoi et valeurs conservées en cas d'échec
*/
export default function ServiceForm({
  initialValues,
  submitLabel,
  onSubmit,
}: ServiceFormProps) {
  const [values, setValues] = useState<ServiceFormValues>(initialValues);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<Status>('idle');

  // Recalculées à chaque rendu, affichées seulement après une 1re soumission
  const errors = validateServiceForm(values);
  const visibleErrors = showErrors ? errors : {};

  /* Propriétés communes d'un champ (id, valeur, erreur, changement) */
  function fieldProps(name: keyof ServiceFormValues) {
    return {
      id: `field-${name}`,
      value: values[name],
      error: visibleErrors[name],
      onChange: (value: string) =>
        setValues((current) => ({ ...current, [name]: value })),
    };
  }

  /* Valide puis envoie le formulaire, ignore les envois multiples */
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') {
      return;
    }
    setShowErrors(true);
    if (Object.keys(errors).length > 0) {
      return;
    }
    setStatus('submitting');
    try {
      await onSubmit(values);
      setStatus('idle');
    } catch {
      // Les valeurs saisies restent dans l'état : on peut réessayer
      setStatus('error');
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormGrid>
        <Field label="Prénom" required {...fieldProps('firstName')} />
        <Field label="Nom" required {...fieldProps('lastName')} />
        <Field label="E-mail" type="email" required {...fieldProps('email')} />
        <Field label="Localisation (ville)" required {...fieldProps('city')} />
        <Field
          label="Type de service"
          control="select"
          emptyOptionLabel="Choisir un type…"
          options={TYPE_OPTIONS}
          required
          {...fieldProps('serviceType')}
        />
        <Field
          label="Tarif horaire (€)"
          type="number"
          required
          {...fieldProps('price')}
        />
      </FormGrid>

      <Field
        label="Titre de l’annonce"
        placeholder="Ex : Tonte et entretien de jardin"
        required
        {...fieldProps('title')}
      />
      <Field
        label="Description"
        control="textarea"
        hint="Entre 20 et 500 caractères."
        required
        {...fieldProps('description')}
      />
      <Field
        label="Image de promotion (URL)"
        type="url"
        hint="Facultatif. Sans lien, une illustration du type de service est utilisée."
        {...fieldProps('imageUrl')}
      />

      {status === 'error' && (
        <Message variant="error" role="alert">
          L’envoi a échoué. Vos informations sont conservées : vérifiez votre
          connexion puis réessayez.
        </Message>
      )}
      {status === 'submitting' && (
        <Message role="status">Envoi en cours…</Message>
      )}

      <Button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting'
          ? 'Envoi en cours…'
          : status === 'error'
            ? 'Réessayer'
            : submitLabel}
      </Button>
    </Form>
  );
}