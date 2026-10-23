import { useCallback, useEffect, useMemo, useState, type ReactNode, } from 'react';
import { ThemeContext, type Theme } from './ThemeContext';

const STORAGE_KEY = 'theme';

/* Détermine le thème initial : celui enregistré dans le localStorage, sinon la préférence du système */
function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch {
    // Stockage indisponible : on se rabat sur la préférence du système
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/* Fournit le thème à toute l'application. Le thème est appliqué via l'attribut data-theme de <html> (utilisé par le CSS)
 * et sauvegardé dans le localStorage pour être restauré à la prochaine ouverture
*/
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Stockage indisponible : le thème reste valable pour la session
    }
  }, [theme]);

  /* Bascule entre thème clair et thème sombre */
  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext value={value}>{children}</ThemeContext>;
}