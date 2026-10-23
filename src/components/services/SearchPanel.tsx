import { useState, type FormEvent } from 'react';
import { useSearch } from '../../hooks/useSearch';
import Button from '../ui/Button';
import ServiceFilters from './ServiceFilters';
import './SearchPanel.css';

/* Formulaire de recherche : champ de texte contrôlé (appliqué à la soumission) et filtres
 * Le texte saisi est gardé en local (brouillon) et n'est envoyé au contexte qu'à la soumission
*/
export default function SearchPanel() {
  const { criteria, updateCriteria, resetCriteria } = useSearch();
  const [draft, setDraft] = useState(criteria.query);

  /* Valide le texte saisi : met à jour le contexte (et revient à la page 1) */
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateCriteria({ query: draft });
  }

  /* Efface le texte et les deux filtres */
  function handleReset() {
    setDraft('');
    resetCriteria();
  }

  return (
    <form className="search" role="search" onSubmit={handleSubmit}>
      <label htmlFor="search-input" className="search__label">
        Rechercher une annonce
      </label>
      <div className="search__row">
        <input
          id="search-input"
          type="search"
          className="search__input"
          placeholder="Ex : jardinage, couture, Emily…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <Button type="submit">Rechercher</Button>
      </div>
      <ServiceFilters onReset={handleReset} />
    </form>
  );
}