import { useEffect } from 'react';

/* Met à jour le titre de l'onglet pour la page affichée */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · Services entre particuliers`;
  }, [title]);
}