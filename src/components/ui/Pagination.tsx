import Button from './Button';
import './Pagination.css';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/* Commandes de pagination avec indication de la page courante */
export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <Button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Précédent
      </Button>
      <span aria-current="page">
        Page {page} sur {totalPages}
      </span>
      <Button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Suivant
      </Button>
    </nav>
  );
}