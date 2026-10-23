import type { Service } from '../../types/service';
import LinkButton from '../ui/LinkButton';
import DeleteServiceButton from './DeleteServiceButton';
import SaveButton from './SaveButton';

interface ServiceActionsProps {
  service: Service;
  onDeleted: () => void;
}

/* Actions disponibles sur une fiche : réserver, sauvegarder, modifier, supprimer */
export default function ServiceActions({
  service,
  onDeleted,
}: ServiceActionsProps) {
  return (
    <div className="detail__actions">
      <LinkButton to={`/services/${service.id}/book`}>
        Réserver et payer
      </LinkButton>
      <SaveButton service={service} />
      <LinkButton
        to={`/services/${service.id}/edit`}
        size="sm"
        variant="secondary"
      >
        Modifier
      </LinkButton>
      <DeleteServiceButton service={service} onDeleted={onDeleted} />
    </div>
  );
}