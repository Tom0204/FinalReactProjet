export type ButtonVariant = 'primary' | 'secondary' | 'danger';
export type ButtonSize = 'md' | 'sm';

/* Construit les classes CSS d'un bouton (partagées par Button et LinkButton) */
export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
): string {
  return [
    'button',
    variant !== 'primary' && `button--${variant}`,
    size === 'sm' && 'button--small',
  ]
    .filter(Boolean)
    .join(' ');
}