import { Fragment, type ReactNode } from 'react';
import './DescriptionList.css';

export interface DescriptionItem {
  label: string;
  value: ReactNode;
}

/* Liste de descriptions (<dl>) : une ligne "libellé / valeur" par élément */
export default function DescriptionList({
  items,
}: {
  items: DescriptionItem[];
}) {
  return (
    <dl className="description-list">
      {items.map((item) => (
        <Fragment key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </Fragment>
      ))}
    </dl>
  );
}