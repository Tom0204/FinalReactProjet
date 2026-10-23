import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/* Accède au thème, doit être utilisé sous ThemeProvider */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  }
  return context;
}