import type { ReactNode } from 'react';
import './Message.css';

interface MessageProps {
  variant?: 'info' | 'error';
  role?: 'status' | 'alert' | 'note';
  children: ReactNode;
}

/* Encadré de message (information ou erreur), annoncé par les lecteurs d'écran via `role` */
export default function Message({
  variant = 'info',
  role,
  children,
}: MessageProps) {
  return (
    <div
      role={role}
      className={variant === 'error' ? 'message message--error' : 'message'}
    >
      {children}
    </div>
  );
}