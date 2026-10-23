import type { FormErrors, ServiceFormValues } from '../types/serviceForm';

/* Vérifie qu'une chaîne est une URL http(s) valide. */
function isHttpUrl(text: string): boolean {
  try {
    const url = new URL(text);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/* Valide formulaire création d'annonce et renvoie message d'erreur compréhensible par champ invalide */
export function validateServiceForm(values: ServiceFormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.firstName.trim().length < 2) {
    errors.firstName = 'Le prénom est obligatoire (2 caractères minimum).';
  }
  if (values.lastName.trim().length < 2) {
    errors.lastName = 'Le nom est obligatoire (2 caractères minimum).';
  }
  if (values.email.trim() === '') {
    errors.email = 'L’e-mail est obligatoire.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Saisissez un e-mail valide, par exemple nom@exemple.fr.';
  }
  if (values.city.trim().length < 2) {
    errors.city = 'La localisation (ville) est obligatoire.';
  }
  if (values.serviceType === '') {
    errors.serviceType = 'Choisissez un type de service.';
  }
  if (values.title.trim().length < 5 || values.title.trim().length > 80) {
    errors.title = 'Le titre doit contenir entre 5 et 80 caractères.';
  }

  const price = Number(values.price);
  if (values.price.trim() === '') {
    errors.price = 'Le prix est obligatoire.';
  } else if (!Number.isFinite(price) || price <= 0 || price > 500) {
    errors.price = 'Saisissez un tarif horaire entre 1 et 500 €.';
  }

  if (
    values.description.trim().length < 20 ||
    values.description.trim().length > 500
  ) {
    errors.description =
      'La description doit contenir entre 20 et 500 caractères.';
  }
  if (values.imageUrl.trim() !== '' && !isHttpUrl(values.imageUrl.trim())) {
    errors.imageUrl = 'Saisissez une URL valide commençant par http(s)://.';
  }

  return errors;
}