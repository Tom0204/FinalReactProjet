import { NavLink } from 'react-router';
import ThemeToggle from './ThemeToggle';
import './Header.css';

/* En-tête de l'application : navigation principale et bascule de thème */
export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <span className="header__logo">Services entre particuliers</span>
        <div className="header__controls">
          <nav aria-label="Navigation principale" className="header__nav">
            <NavLink to="/" end>
              Accueil
            </NavLink>
            <NavLink to="/saved">Sauvegardés</NavLink>
            <NavLink to="/new">Publier une annonce</NavLink>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}