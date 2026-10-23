import type { PaymentErrors, PaymentFormValues } from '../types/payment';

/* Date du jour au format AAAA-MM-JJ */
export function todayISO(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/* Vérifie un numéro de carte avec l'algorithme de Luhn : on double un chiffre sur deux en partant de la droite, 
 * puis la somme doit être un multiple de 10
*/
function isValidLuhn(digits: string): boolean {
  let sum = 0;
  let doubleNext = false;
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);
    if (doubleNext) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    doubleNext = !doubleNext;
  }
  return sum % 10 === 0;
}

/* Valide le formulaire de paiement fictif et renvoie un message d'erreur compréhensible par champ invalide */
export function validatePayment(values: PaymentFormValues): PaymentErrors {
  const errors: PaymentErrors = {};

  const hours = Number(values.hours);
  if (!Number.isInteger(hours) || hours < 1 || hours > 12) {
    errors.hours = 'Choisissez une durée entière entre 1 et 12 heures.';
  }

  if (values.date === '') {
    errors.date = 'La date de la prestation est obligatoire.';
  } else if (values.date < todayISO()) {
    errors.date = 'La date ne peut pas être dans le passé.';
  }

  if (values.cardHolder.trim().length < 3) {
    errors.cardHolder = 'Saisissez le nom inscrit sur la carte.';
  }

  const digits = values.cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(digits) || !isValidLuhn(digits)) {
    errors.cardNumber = 'Numéro de carte invalide (13 à 19 chiffres).';
  }

  const expiryMatch = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(values.expiry);
  if (!expiryMatch) {
    errors.expiry = 'Saisissez la date au format MM/AA.';
  } else {
    // Une carte est valable jusqu'à la fin du mois indiqué
    const endOfValidity = new Date(
      2000 + Number(expiryMatch[2]),
      Number(expiryMatch[1]),
      1,
    );
    if (endOfValidity <= new Date()) {
      errors.expiry = 'Cette carte est expirée.';
    }
  }

  if (!/^\d{3,4}$/.test(values.cvc)) {
    errors.cvc = 'Le code de sécurité comporte 3 ou 4 chiffres.';
  }

  return errors;
}