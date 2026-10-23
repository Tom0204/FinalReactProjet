import { useEffect, useRef } from 'react';
import Button from './Button';
import './ConfirmDialog.css';
import './Field.css';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  busy: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

/* Boîte de dialogue de confirmation basée sur l'élément natif <dialog> : focus piégé dans la boîte et fermeture avec
 * Échap gérés par le navigateur
*/
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  busy,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Synchronise l'état React `open` avec l'état réel de l'élément <dialog>
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby="dialog-title"
      onCancel={(event) => {
        // Échap : React pilote la fermeture (impossible pendant l'envoi)
        event.preventDefault();
        if (!busy) {
          onCancel();
        }
      }}
    >
      <h2 id="dialog-title">{title}</h2>
      <p>{message}</p>
      {error && (
        <p role="alert" className="field__error">
          {error}
        </p>
      )}
      <div className="dialog__actions">
        <Button variant="secondary" disabled={busy} onClick={onCancel}>
          Annuler
        </Button>
        <Button variant="danger" disabled={busy} onClick={onConfirm}>
          {busy ? 'Suppression…' : confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}