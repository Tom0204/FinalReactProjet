import { useMemo } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useServices } from '../../hooks/useServices';
import { getPriceSteps, getServiceTypes } from '../../utils/serviceOptions';
import Button from '../ui/Button';
import Field from '../ui/Field';

/* Les deux filtres de la liste : type de service et tarif maximum. Leurs options sont calculées à partir des annonces
 * chargées, et chaque changement est appliqué tout de suite (retour à la page 1)
*/
export default function ServiceFilters({ onReset }: { onReset: () => void }) {
  const { criteria, updateCriteria } = useSearch();
  const { services } = useServices();

  const typeOptions = useMemo(
    () =>
      getServiceTypes(services).map((type) => ({ value: type, label: type })),
    [services],
  );
  const priceOptions = useMemo(
    () =>
      getPriceSteps(services).map((price) => ({
        value: String(price),
        label: `${price} € / h maximum`,
      })),
    [services],
  );

  return (
    <div className="search__filters">
      <Field
        id="filter-type"
        label="Type de service"
        control="select"
        emptyOptionLabel="Tous les types"
        options={typeOptions}
        value={criteria.serviceType}
        onChange={(serviceType) => updateCriteria({ serviceType })}
      />
      <Field
        id="filter-price"
        label="Tarif maximum"
        control="select"
        emptyOptionLabel="Sans limite"
        options={priceOptions}
        value={criteria.maxPrice === null ? '' : String(criteria.maxPrice)}
        onChange={(price) =>
          updateCriteria({ maxPrice: price === '' ? null : Number(price) })
        }
      />
      <Button variant="secondary" onClick={onReset}>
        Réinitialiser
      </Button>
    </div>
  );
}