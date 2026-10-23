/* Valeurs du formulaire de paiement fictif */
export interface PaymentFormValues {
  hours: string;
  date: string;
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

/* Message d'erreur éventuel pour chaque champ du paiement */
export type PaymentErrors = Partial<Record<keyof PaymentFormValues, string>>;

/* Formulaire de paiement vide */
export const INITIAL_PAYMENT_VALUES: PaymentFormValues = {
  hours: '1',
  date: '',
  cardHolder: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
};

/* Informations affichées une fois la réservation acceptée par l'API */
export interface BookingConfirmationData {
  orderId: number;
  hours: number;
  date: string;
  total: number;
  lastDigits: string;
}