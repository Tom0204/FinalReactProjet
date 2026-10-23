import BackLink from '../components/ui/BackLink';
import Message from '../components/ui/Message';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

/* Page affichée pour une URL qui ne correspond à aucune route */
export default function NotFoundPage() {
  useDocumentTitle('Page introuvable');

  return (
    <>
      <h1>Page introuvable</h1>
      <Message>
        <p>Cette page n’existe pas.</p>
      </Message>
      <BackLink to="/">Retour aux annonces</BackLink>
    </>
  );
}