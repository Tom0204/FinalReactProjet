import { Route, Routes } from 'react-router';
import Layout from './components/layout/Layout';
import CreateServicePage from './pages/CreateServicePage';
import EditServicePage from './pages/EditServicePage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import PaymentPage from './pages/PaymentPage';
import SavedPage from './pages/SavedPage';
import ServiceDetailPage from './pages/ServiceDetailPage';

/* Composant racine : toutes les pages partagent le même Layout (en-tête + zone principale) */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="services/:id" element={<ServiceDetailPage />} />
        <Route path="services/:id/edit" element={<EditServicePage />} />
        <Route path="services/:id/book" element={<PaymentPage />} />
        <Route path="saved" element={<SavedPage />} />
        <Route path="new" element={<CreateServicePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}