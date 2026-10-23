import { useSaved } from '../../hooks/useSaved';
import type { Service } from '../../types/service';
import Button from '../ui/Button';

/* Bouton qui sauvegarde ou retire une annonce des éléments sauvegardés */
export default function SaveButton({ service }: { service: Service }) {
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(service.id);
  const action = saved ? 'Retirer des sauvegardes' : 'Sauvegarder';

  return (
    <Button
      size="sm"
      variant={saved ? 'primary' : 'secondary'}
      aria-label={`${action} l’annonce « ${service.title} »`}
      onClick={() => toggleSaved(service)}
    >
      {saved ? '★ ' : '☆ '}
      {action}
    </Button>
  );
}