import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App';
import { SavedProvider } from './context/SavedProvider';
import { SearchProvider } from './context/SearchProvider';
import { ServicesProvider } from './context/ServicesProvider';
import { ThemeProvider } from './context/ThemeProvider';
import './styles/theme.css';
import './styles/base.css';

// Les providers sont placés au-dessus des routes pour que le thème, la recherche, les annonces et les sauvegardes survivent 
// à la navigation
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <SearchProvider>
          <ServicesProvider>
            <SavedProvider>
              <App />
            </SavedProvider>
          </ServicesProvider>
        </SearchProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);