import type { ButtonHTMLAttributes } from 'react';
import {
  buttonClass,
  type ButtonSize,
  type ButtonVariant,
} from './buttonClass';
import './Button.css';

interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className'
> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/* Bouton de l'application ; `type="button"` par défaut (jamais d'envoi involontaire) */
export default function Button({
  variant,
  size,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClass(variant, size)} {...props} />
  );
}