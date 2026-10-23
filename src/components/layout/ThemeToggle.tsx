import { useTheme } from '../../hooks/useTheme';

/* Bouton qui bascule entre le thème clair et le thème sombre */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme}>
      {theme === 'dark' ? '☀ Passer en mode clair' : '🌙 Passer en mode sombre'}
    </button>
  );
}