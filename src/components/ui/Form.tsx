import type { FormHTMLAttributes, ReactNode } from 'react';
import './Form.css';

/* Formulaire sans validation native du navigateur (les messages sont gérés par React) */
export default function Form({
  children,
  ...props
}: Omit<FormHTMLAttributes<HTMLFormElement>, 'className' | 'noValidate'>) {
  return (
    <form className="form" noValidate {...props}>
      {children}
    </form>
  );
}

/* Grille de champs : 1 colonne sur mobile, 2 sur écran large */
export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="form__grid">{children}</div>;
}