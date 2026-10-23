import type { ReactNode } from 'react';
import './ConfirmationPanel.css';
import './Message.css';

interface ConfirmationPanelProps {
  title: string;
  actions: ReactNode;
  children: ReactNode;
}

/* Panneau de confirmation après une action réussie (titre, détails, actions) */
export default function ConfirmationPanel({
  title,
  actions,
  children,
}: ConfirmationPanelProps) {
  return (
    <div role="status" className="message confirmation">
      <h1>{title}</h1>
      {children}
      <div className="confirmation__actions">{actions}</div>
    </div>
  );
}