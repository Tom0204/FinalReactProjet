import { useMemo } from 'react';
import Pagination from '../components/ui/Pagination';
import AsyncContent from '../components/ui/AsyncContent';
import Button from '../components/ui/Button';
import Message from '../components/ui/Message';
import ResultsCount from '../components/services/ResultsCount';
import SearchPanel from '../components/services/SearchPanel';
import ServiceGrid from '../components/services/ServiceGrid';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useSearch } from '../hooks/useSearch';
import { useServices } from '../hooks/useServices';
import { PAGE_SIZE, filterServices, paginate } from '../utils/filterServices';

/* Page d'accueil : recherche et filtres, grille de 20 annonces par page et pagination, avec gestion des états */
export default function HomePage() {
  useDocumentTitle('Accueil');
  const { criteria, page, setPage, resetCriteria } = useSearch();
  const { services, status, reload } = useServices();

  // Le filtrage porte sur l'ensemble des annonces, pas sur la page visible
  const results = useMemo(
    () => filterServices(services, criteria),
    [services, criteria],
  );
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  return (
    <>
      <h1>Des services rendus par des particuliers près de chez vous</h1>
      <SearchPanel />

      <AsyncContent
        status={status}
        onRetry={reload}
        loadingText="Chargement des annonces…"
        errorText="Impossible de charger les annonces. Vérifiez votre connexion."
      >
        {results.length === 0 ? (
          <Message>
            <p>Aucune annonce ne correspond à votre recherche.</p>
            <Button onClick={resetCriteria}>Réinitialiser la recherche</Button>
          </Message>
        ) : (
          <>
            <ResultsCount
              count={results.length}
              noun="annonce"
              adjective="trouvée"
            />
            <ServiceGrid services={paginate(results, currentPage)} />
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </AsyncContent>
    </>
  );
}