import { Link, type LinkProps } from 'react-router';
import {
  buttonClass,
  type ButtonSize,
  type ButtonVariant,
} from './buttonClass';
import './Button.css';

interface LinkButtonProps extends Omit<LinkProps, 'className'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/* Lien de navigation présenté comme un bouton */
export default function LinkButton({
  variant,
  size,
  ...props
}: LinkButtonProps) {
  return <Link className={buttonClass(variant, size)} {...props} />;
}