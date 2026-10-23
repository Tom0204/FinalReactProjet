import type { Service } from '../../types/service';
import { formatRating } from '../../utils/format';
import DescriptionList, { type DescriptionItem } from '../ui/DescriptionList';

/* Informations détaillées d'une annonce. Les lignes dépendent des données disponibles : profession, plat proposé et
 * téléphone n'existent pas pour une annonce créée par formulaire
*/
export default function ServiceInfoList({ service }: { service: Service }) {
  const location = [service.city, service.region].filter(Boolean).join(', ');

  const items: DescriptionItem[] = [
    {
      label: 'Prestataire',
      value: `${service.firstName} ${service.lastName}${
        service.age !== undefined ? `, ${service.age} ans` : ''
      }`,
    },
  ];
  if (service.profession) {
    items.push({ label: 'Profession', value: service.profession });
  }
  items.push({
    label: 'Localisation',
    value: service.country ? `${location} (${service.country})` : location,
  });
  if (service.dish) {
    items.push(
      { label: 'Cuisine', value: service.dish.cuisine },
      { label: 'Difficulté', value: service.dish.difficulty },
      {
        label: 'Temps',
        value: `${service.dish.prepMinutes} min de préparation, ${service.dish.cookMinutes} min de cuisson`,
      },
      { label: 'Portions', value: `${service.dish.servings} personne(s)` },
    );
  }
  items.push(
    { label: 'Note', value: formatRating(service, true) },
    {
      label: 'E-mail',
      value: <a href={`mailto:${service.email}`}>{service.email}</a>,
    },
  );
  if (service.phone) {
    items.push({ label: 'Téléphone', value: service.phone });
  }

  return <DescriptionList items={items} />;
}