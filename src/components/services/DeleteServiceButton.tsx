import { useState } from 'react';
import { deleteService } from '../../api/services';
import { useSaved } from '../../hooks/useSaved';
import { useServices } from '../../hooks/useServices';
import type { Service } from '../../types/service';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';

type DeleteStatus = 'idle' | 'deleting' | 'error';

interface DeleteServiceButtonProps {
  service: Service;
  onDeleted: () => void;
}

/* Bouton "Supprimer" avec confirmation : appelle l'API (DELETE), puis met à jour la liste et les sauvegardes
 * Gère les états d'envoi et d'erreur
*/
export default function DeleteServiceButton({
  service,
  onDeleted,
}: DeleteServiceButtonProps) {
  const { removeService } = useServices();
  const { removeSaved } = useSaved();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<DeleteStatus>('idle');

  /* Supprime l'annonce via l'API puis met à jour l'interface */
  async function handleConfirm() {
    setStatus('deleting');
    try {
      await deleteService(service);
      removeService(service.id);
      removeSaved(service.id);
      setOpen(false);
      onDeleted();
    } catch {
      setStatus('error');
    }
  }

  /* Ferme la boîte de confirmation et efface l'erreur éventuelle */
  function handleCancel() {
    setOpen(false);
    setStatus('idle');
  }

  return (
    <>
      <Button size="sm" variant="danger" onClick={() => setOpen(true)}>
        Supprimer
      </Button>
      <ConfirmDialog
        open={open}
        title="Supprimer cette annonce ?"
        message="Cette action retire l’annonce de la liste et de vos sauvegardes."
        confirmLabel="Oui, supprimer"
        busy={status === 'deleting'}
        error={
          status === 'error'
            ? 'La suppression a échoué. Vérifiez votre connexion puis réessayez.'
            : null
        }
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}