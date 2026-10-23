import type { ReactNode } from 'react';
import Button from './Button';
import Message from './Message';

interface AsyncContentProps {
  status: 'loading' | 'error' | 'notfound' | 'success';
  onRetry: () => void;
  loadingText: string;
  errorText: string;
  notFoundText?: string;
  children: ReactNode;
}

/* Affiche le message adapté à l'état d'une requête (chargement, erreur avec bouton "Réessayer", introuvable) ou le contenu 
 * en cas de succès
*/
export default function AsyncContent({
  status,
  onRetry,
  loadingText,
  errorText,
  notFoundText = 'Cette annonce n’existe pas.',
  children,
}: AsyncContentProps) {
  if (status === 'loading') {
    return <Message role="status">{loadingText}</Message>;
  }
  if (status === 'error') {
    return (
      <Message variant="error" role="alert">
        <p>{errorText}</p>
        <Button onClick={onRetry}>Réessayer</Button>
      </Message>
    );
  }
  if (status === 'notfound') {
    return <Message>{notFoundText}</Message>;
  }
  return <>{children}</>;
}