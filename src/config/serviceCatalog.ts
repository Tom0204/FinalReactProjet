/* Modèle d'un type de service : sert à générer les annonces */
export interface ServiceTemplate {
  type: string;
  emoji: string;
  color: string;
  titles: string[];
  descriptions: string[];
  minPrice: number;
  maxPrice: number;
}

/* Contenu éditorial : DummyJSON ne contient aucune notion de service, donc les types de services
 * (libellés, illustrations, fourchettes de tarifs, modèles de titres et de descriptions) sont définis ici
 * Tout le reste (identité, métier, localisation, plats, notes) vient de l'API
*/
export const SERVICE_CATALOG: ServiceTemplate[] = [
  {
    type: 'Jardinage',
    emoji: '🌿',
    color: '#dff3e4',
    titles: ['Tonte et entretien de jardin', 'Taille de haies et plantations'],
    descriptions: [
      'Je m’occupe de la tonte, du désherbage et de l’entretien de votre pelouse. Je viens avec mon propre matériel.',
      'Taille de haies, plantation de massifs et arrosage pendant vos vacances. Travail soigné et évacuation des déchets verts.',
    ],
    minPrice: 15,
    maxPrice: 35,
  },
  {
    type: 'Courses',
    emoji: '🛒',
    color: '#fde8c8',
    titles: ['Je fais vos courses', 'Courses et livraison à domicile'],
    descriptions: [
      'Je fais vos courses selon votre liste et je vous les livre à domicile, y compris pour les produits lourds.',
      'Courses hebdomadaires pour les personnes âgées ou à mobilité réduite. Possibilité de passage régulier.',
    ],
    minPrice: 8,
    maxPrice: 15,
  },
  {
    type: 'Couture',
    emoji: '🧵',
    color: '#f9dcec',
    titles: ['Retouches et ourlets', 'Couture sur mesure et réparations'],
    descriptions: [
      'Ourlets, fermetures éclair, reprises de vêtements : je redonne vie à vos habits rapidement.',
      'Création de rideaux, coussins et vêtements sur mesure. Réparation de tous types de tissus.',
    ],
    minPrice: 15,
    maxPrice: 30,
  },
  {
    type: 'Bricolage',
    emoji: '🔧',
    color: '#dbe7f7',
    titles: [
      'Petits travaux et montage de meubles',
      'Bricolage et réparations',
    ],
    descriptions: [
      'Montage de meubles, fixation d’étagères, petites réparations : je me déplace avec mes outils.',
      'Peinture, changement de joints, pose de luminaires. Devis gratuit avant intervention.',
    ],
    minPrice: 20,
    maxPrice: 45,
  },
  {
    type: 'Ménage',
    emoji: '🧹',
    color: '#e0f2f1',
    titles: ['Ménage à domicile', 'Grand nettoyage et repassage'],
    descriptions: [
      'Entretien régulier de votre logement : sols, sanitaires, cuisine. Produits fournis sur demande.',
      'Grand nettoyage de printemps, vitres et repassage. Je m’adapte à vos horaires.',
    ],
    minPrice: 14,
    maxPrice: 25,
  },
  {
    type: 'Cours particuliers',
    emoji: '📚',
    color: '#e8e0f7',
    titles: ['Soutien scolaire', 'Cours de langues et de maths'],
    descriptions: [
      'Aide aux devoirs et révisions du primaire au lycée, avec une méthode adaptée à chaque élève.',
      'Cours de mathématiques et de langues en visio ou à domicile, pour progresser à votre rythme.',
    ],
    minPrice: 20,
    maxPrice: 45,
  },
  {
    type: 'Garde d’animaux',
    emoji: '🐕',
    color: '#fbe3d3',
    titles: ['Promenade et garde de chiens', 'Garde de chats à domicile'],
    descriptions: [
      'Promenades quotidiennes et garde pendant vos absences. Votre compagnon est entre de bonnes mains.',
      'Visite quotidienne pour nourrir, jouer et donner les soins nécessaires à votre chat.',
    ],
    minPrice: 8,
    maxPrice: 20,
  },
  {
    type: 'Garde d’enfants',
    emoji: '🧸',
    color: '#fff3c4',
    titles: ['Baby-sitting en soirée', 'Garde d’enfants après l’école'],
    descriptions: [
      'Garde d’enfants en soirée ou le week-end, avec activités et repas. Références disponibles.',
      'Sortie d’école, goûter et aide aux devoirs jusqu’au retour des parents.',
    ],
    minPrice: 12,
    maxPrice: 22,
  },
  {
    type: 'Déménagement',
    emoji: '📦',
    color: '#e6dccb',
    titles: ['Aide au déménagement', 'Transport et manutention'],
    descriptions: [
      'Je vous aide à porter et charger vos cartons et vos meubles. Possibilité de fournir un véhicule.',
      'Manutention, démontage et remontage de meubles lors de votre déménagement.',
    ],
    minPrice: 20,
    maxPrice: 40,
  },
  {
    type: 'Informatique',
    emoji: '💻',
    color: '#d9eefc',
    titles: ['Dépannage informatique', 'Initiation et aide numérique'],
    descriptions: [
      'Installation, nettoyage d’ordinateur, suppression de virus et configuration de votre box internet.',
      'Je vous accompagne pour utiliser votre smartphone, vos mails et vos démarches en ligne.',
    ],
    minPrice: 25,
    maxPrice: 50,
  },
  {
    type: 'Cuisine',
    emoji: '🍲',
    color: '#fde0dc',
    titles: ['Repas faits maison à domicile', 'Cours de cuisine et pâtisserie'],
    descriptions: [
      'Je prépare vos repas de la semaine à partir de produits frais, pour vous ou pour vos invités.',
      'Initiation à la cuisine et à la pâtisserie, chez moi ou chez vous, pour tous les niveaux.',
    ],
    minPrice: 18,
    maxPrice: 40,
  },
  {
    type: 'Coiffure à domicile',
    emoji: '✂️',
    color: '#efe3f9',
    titles: ['Coupe et brushing à domicile', 'Coloration et soins capillaires'],
    descriptions: [
      'Coupe, brushing et coiffure de cérémonie directement chez vous, matériel professionnel fourni.',
      'Colorations, mèches et soins adaptés à votre type de cheveux, dans le confort de votre salon.',
    ],
    minPrice: 20,
    maxPrice: 50,
  },
];

/* Liste des types de services (utilisée par le formulaire de création) */
export const SERVICE_TYPES: string[] = SERVICE_CATALOG.map(
  (template) => template.type,
);

/* Type de service associé aux recettes de l'API (/recipes) */
export const COOKING_TYPE = 'Cuisine';