import { Link } from 'react-router';
import ResultsCount from '../components/services/ResultsCount';
import ServiceGrid from '../components/services/ServiceGrid';
import Message from '../components/ui/Message';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSaved } from '../hooks/useSaved';

/* Page des annonces sauvegardées : accès à chaque fiche de détail et retrait de la sélection via le bouton de la carte */
export default function SavedPage() {
  useDocumentTitle('Sauvegardés');
  const { saved } = useSaved();

  return (
    <>
      <h1>Annonces sauvegardées</h1>
      {saved.length === 0 ? (
        <Message>
          <p>Vous n’avez encore sauvegardé aucune annonce.</p>
          <Link to="/">Parcourir les annonces</Link>
        </Message>
      ) : (
        <>
          <ResultsCount
            count={saved.length}
            noun="annonce"
            adjective="sauvegardée"
          />
          <ServiceGrid services={saved} />
        </>
      )}
    </>
  );
}