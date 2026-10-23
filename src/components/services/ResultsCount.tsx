interface ResultsCountProps {
  count: number;
  noun: string;
  adjective: string;
}

/* Nombre de résultats avec accord au pluriel ("3 annonces trouvées"), annoncé aux lecteurs d'écran */
export default function ResultsCount({
  count,
  noun,
  adjective,
}: ResultsCountProps) {
  const plural = count > 1 ? 's' : '';
  return (
    <p className="muted" aria-live="polite">
      {count} {noun}
      {plural} {adjective}
      {plural}
    </p>
  );
}