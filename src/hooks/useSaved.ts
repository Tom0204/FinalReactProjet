import { useContext } from 'react';
import { SavedContext } from '../context/SavedContext';

/* Accède aux annonces sauvegardées, doit être utilisé sous SavedProvider */
export function useSaved() {
  const context = useContext(SavedContext);
  if (context === null) {
    throw new Error('useSaved doit être utilisé dans un SavedProvider');
  }
  return context;
}