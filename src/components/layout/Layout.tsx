import { Outlet } from 'react-router';
import Header from './Header';
import './Layout.css';

/* Structure commune toutes les pages : lien d'évitement, en-tête et zone principale unique (<main>) reçoit page 
 * courante via <Outlet /> 
*/
export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">
        Aller au contenu
      </a>
      <Header />
      <main id="main" className="container" tabIndex={-1}>
        <Outlet />
      </main>
    </>
  );
}