import { createContext } from 'react';

export type Theme = 'light' | 'dark';

/* Thème courant et fonction pour en changer */
export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

/* Contexte React du thème (null hors du provider) */
export const ThemeContext = createContext<ThemeContextValue | null>(null);