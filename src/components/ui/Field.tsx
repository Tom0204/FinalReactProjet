import type { InputHTMLAttributes } from 'react';
import './Field.css';

export interface FieldOption {
  value: string;
  label: string;
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: string;
  control?: 'input' | 'textarea' | 'select';
  options?: FieldOption[];
  /* Libellé de l'option vide d'une liste déroulante */
  emptyOptionLabel?: string;
  placeholder?: string;
  /* Attributs HTML supplémentaires (autoComplete, min, inputMode...) */
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

/* Champ de formulaire contrôlé (input, textarea ou select) avec label associé, aide et message d'erreur reliés au champ
 * pour les lecteurs d'écran 
*/
export default function Field({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  required = false,
  type = 'text',
  control = 'input',
  options = [],
  emptyOptionLabel = 'Choisir…',
  placeholder,
  inputProps,
}: FieldProps) {
  const describedBy =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null]
      .filter(Boolean)
      .join(' ') || undefined;
  const common = {
    id,
    value,
    className: 'field__input',
    'aria-invalid': error ? true : undefined,
    'aria-required': required || undefined,
    'aria-describedby': describedBy,
  };

  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      {control === 'textarea' && (
        <textarea
          {...common}
          rows={5}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {control === 'select' && (
        <select {...common} onChange={(event) => onChange(event.target.value)}>
          <option value="">{emptyOptionLabel}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {control === 'input' && (
        <input
          {...common}
          {...inputProps}
          type={type}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {hint && (
        <p id={`${id}-hint`} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field__error">
          {error}
        </p>
      )}
    </div>
  );
}