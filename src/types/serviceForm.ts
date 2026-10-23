/* Valeurs du formulaire de création d'annonce */
export interface ServiceFormValues {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  serviceType: string;
  title: string;
  price: string;
  description: string;
  imageUrl: string;
}

/* Message d'erreur éventuel pour chaque champ */
export type FormErrors = Partial<Record<keyof ServiceFormValues, string>>;

/* Formulaire vide */
export const INITIAL_FORM_VALUES: ServiceFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  city: '',
  serviceType: '',
  title: '',
  price: '',
  description: '',
  imageUrl: '',
};