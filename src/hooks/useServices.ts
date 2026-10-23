import { useContext } from 'react';
import { ServicesContext } from '../context/ServicesContext';

/* Accède à la liste des annonces, doit être utilisé sous ServicesProvider */
export function useServices() {
  const context = useContext(ServicesContext);
  if (context === null) {
    throw new Error('useServices doit être utilisé dans un ServicesProvider');
  }
  return context;
}