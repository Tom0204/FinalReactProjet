import { useState, type FormEvent } from 'react';
import { createBooking } from '../../api/bookings';
import { INITIAL_PAYMENT_VALUES, type BookingConfirmationData, type PaymentFormValues, } from '../../types/payment';
import type { Service } from '../../types/service';
import { formatAmount, formatPrice } from '../../utils/format';
import { formatCardNumber, formatExpiry } from '../../utils/formatInput';
import { todayISO, validatePayment } from '../../utils/validatePayment';
import Button from '../ui/Button';
import Field from '../ui/Field';
import Form, { FormGrid } from '../ui/Form';
import Message from '../ui/Message';
import RequiredNote from '../ui/RequiredNote';
import BookingConfirmation from './BookingConfirmation';
import './BookingForm.css';

type Status = 'idle' | 'submitting' | 'error' | 'success';

/* Formulaire de réservation et de paiement FICTIF d'une annonce : validation de la carte (algorithme de Luhn, expiration, code),
 * puis enregistrement de la commande via l'API. Données de carte quittent jamais navigateur et sont effacées après le paiement
*/
export default function BookingForm({ service }: { service: Service }) {
  const [values, setValues] = useState<PaymentFormValues>(
    INITIAL_PAYMENT_VALUES,
  );
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [confirmation, setConfirmation] =
    useState<BookingConfirmationData | null>(null);

  const errors = validatePayment(values);
  const visibleErrors = showErrors ? errors : {};
  const hours = Number(values.hours);
  const total = errors.hours ? 0 : hours * service.pricePerHour;

  /* Propriétés communes d'un champ, `format` nettoie la saisie si besoin */
  function fieldProps(
    name: keyof PaymentFormValues,
    format: (value: string) => string = (value) => value,
  ) {
    return {
      id: `field-${name}`,
      value: values[name],
      error: visibleErrors[name],
      onChange: (value: string) =>
        setValues((current) => ({ ...current, [name]: format(value) })),
    };
  }

  /* Valide, enregistre la réservation via l'API puis efface les données de carte */
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
      const booking = await createBooking(service, hours);
      setConfirmation({
        orderId: booking.orderId,
        hours,
        date: values.date,
        total,
        lastDigits: values.cardNumber.replace(/\s/g, '').slice(-4),
      });
      setValues(INITIAL_PAYMENT_VALUES);
      setStatus('success');
    } catch {
      // Les valeurs saisies restent dans l'état : on peut réessayer
      setStatus('error');
    }
  }

  if (status === 'success' && confirmation) {
    return (
      <BookingConfirmation service={service} confirmation={confirmation} />
    );
  }

  return (
    <>
      <h1>Réserver : {service.title}</h1>
      <Message role="note">
        Paiement fictif : n’utilisez pas de vraie carte. Pour tester, le numéro
        4242 4242 4242 4242 est accepté avec n’importe quelle date d’expiration
        future et un code à 3 chiffres.
      </Message>
      <RequiredNote />

      <Form onSubmit={handleSubmit}>
        <p className="summary">
          {service.firstName} {service.lastName} ·{' '}
          {formatPrice(service.pricePerHour)}
        </p>

        <FormGrid>
          <Field
            label="Durée (heures)"
            type="number"
            required
            inputProps={{ min: 1, max: 12 }}
            {...fieldProps('hours')}
          />
          <Field
            label="Date de la prestation"
            type="date"
            required
            inputProps={{ min: todayISO() }}
            {...fieldProps('date')}
          />
        </FormGrid>

        <p className="summary summary--total" aria-live="polite">
          Total : {formatAmount(total)}
        </p>

        <Field
          label="Nom sur la carte"
          required
          inputProps={{ autoComplete: 'cc-name' }}
          {...fieldProps('cardHolder')}
        />
        <Field
          label="Numéro de carte"
          required
          placeholder="4242 4242 4242 4242"
          inputProps={{ inputMode: 'numeric', autoComplete: 'cc-number' }}
          {...fieldProps('cardNumber', formatCardNumber)}
        />
        <FormGrid>
          <Field
            label="Expiration (MM/AA)"
            required
            placeholder="MM/AA"
            inputProps={{ inputMode: 'numeric', autoComplete: 'cc-exp' }}
            {...fieldProps('expiry', formatExpiry)}
          />
          <Field
            label="Code de sécurité"
            required
            inputProps={{
              inputMode: 'numeric',
              autoComplete: 'cc-csc',
              maxLength: 4,
            }}
            {...fieldProps('cvc', (value) => value.replace(/\D/g, ''))}
          />
        </FormGrid>

        {status === 'error' && (
          <Message variant="error" role="alert">
            Le paiement a échoué. Vos informations sont conservées : vérifiez
            votre connexion puis réessayez.
          </Message>
        )}
        {status === 'submitting' && (
          <Message role="status">Paiement en cours…</Message>
        )}

        <Button type="submit" disabled={status === 'submitting'}>
          {status === 'submitting'
            ? 'Paiement en cours…'
            : status === 'error'
              ? 'Réessayer'
              : `Payer ${formatAmount(total)}`}
        </Button>
      </Form>
    </>
  );
}