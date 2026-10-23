import type { ReactNode } from 'react';
import { Link } from 'react-router';
import './BackLink.css';

/* Lien de retour en haut de page ("← Retour ...") */
export default function BackLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link to={to} className="back-link">
      ← {children}
    </Link>
  );
}