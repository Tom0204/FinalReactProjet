import {
  COOKING_TYPE,
  SERVICE_CATALOG,
  type ServiceTemplate,
} from '../config/serviceCatalog';
import type { ApiPost, ApiReactions, ApiRecipe, ApiUser } from '../types/api';
import type { Service } from '../types/service';
import { getServiceImage } from './serviceImage';

/* Traduction des niveaux de difficulté renvoyés par /recipes */
const DIFFICULTY_LABELS: Record<string, string> = {
  Easy: 'facile',
  Medium: 'moyenne',
  Difficult: 'difficile',
};

/* Tarif horaire du prestataire dans la fourchette de son type de service */
function getPrice(template: ServiceTemplate, userId: number): number {
  const span = template.maxPrice - template.minPrice + 1;
  return template.minPrice + ((userId * 13) % span);
}

/* Note sur 5 = part de réactions positives (j'aime) aux publications du prestataire ; le nombre d'avis est le nombre total 
 * de réactions. Sans publication, l'annonce est "nouvelle" (0 avis)
*/
function getPopularity(reactions: ApiReactions | undefined) {
  const total = reactions ? reactions.likes + reactions.dislikes : 0;
  if (!reactions || total === 0) {
    return { rating: 0, reviewsCount: 0 };
  }
  return {
    rating: Number(((reactions.likes / total) * 5).toFixed(1)),
    reviewsCount: total,
  };
}

/* Description française d'un plat, composée à partir des données de la recette */
function describeRecipe(recipe: ApiRecipe): string {
  const difficulty = DIFFICULTY_LABELS[recipe.difficulty] ?? recipe.difficulty;
  return (
    `Je prépare « ${recipe.name} » chez vous ou à emporter (cuisine ${recipe.cuisine}, ` +
    `difficulté ${difficulty}). Préparation : ${recipe.prepTimeMinutes} min, ` +
    `cuisson : ${recipe.cookTimeMinutes} min, pour ${recipe.servings} personne(s).`
  );
}

/* Croise les ressources DummyJSON pour produire les annonces :
 * - chaque utilisateur est un prestataire (identité, profession, ville)
 * - un utilisateur auteur d'une recette propose une annonce de cuisine avec le plat, sa photo, sa note et son nombre d'avis
 * - les autres reçoivent un type de service du catalogue, choisi de façon déterministe à partir de leur id 
 *    (la liste et la fiche restent donc cohérentes), et une note calculée à partir de leurs publications
*/
export function buildServices(
  users: ApiUser[],
  recipes: ApiRecipe[],
  posts: ApiPost[],
): Service[] {
  const recipeByUser = new Map<number, ApiRecipe>();
  for (const recipe of recipes) {
    if (!recipeByUser.has(recipe.userId)) {
      recipeByUser.set(recipe.userId, recipe);
    }
  }

  const reactionsByUser = new Map<number, ApiReactions>();
  for (const post of posts) {
    const current = reactionsByUser.get(post.userId) ?? {
      likes: 0,
      dislikes: 0,
    };
    reactionsByUser.set(post.userId, {
      likes: current.likes + post.reactions.likes,
      dislikes: current.dislikes + post.reactions.dislikes,
    });
  }

  // Si les recettes sont indisponibles, la cuisine redevient un type ordinaire
  const cooking = SERVICE_CATALOG.find((item) => item.type === COOKING_TYPE);
  const pool =
    recipes.length > 0
      ? SERVICE_CATALOG.filter((item) => item.type !== COOKING_TYPE)
      : SERVICE_CATALOG;

  return users.map((user): Service => {
    const identity = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      email: user.email,
      phone: user.phone,
      city: user.address.city,
      region: user.address.state,
      country: user.address.country,
      profession: user.company.title,
    };

    const recipe = recipeByUser.get(user.id);
    if (recipe && cooking) {
      return {
        ...identity,
        serviceType: cooking.type,
        title: `Plat maison : ${recipe.name}`,
        description: describeRecipe(recipe),
        pricePerHour: getPrice(cooking, user.id),
        image: recipe.image,
        rating: Number(recipe.rating.toFixed(1)),
        reviewsCount: recipe.reviewCount,
        dish: {
          name: recipe.name,
          cuisine: recipe.cuisine,
          difficulty: DIFFICULTY_LABELS[recipe.difficulty] ?? recipe.difficulty,
          prepMinutes: recipe.prepTimeMinutes,
          cookMinutes: recipe.cookTimeMinutes,
          servings: recipe.servings,
        },
      };
    }

    // 7 est premier avec 11 et 12 : les types sont répartis uniformément
    const template = pool[(user.id * 7) % pool.length];
    const variant = Math.floor(user.id / pool.length);
    return {
      ...identity,
      serviceType: template.type,
      title: template.titles[variant % template.titles.length],
      description:
        template.descriptions[variant % template.descriptions.length],
      pricePerHour: getPrice(template, user.id),
      image: getServiceImage(template.type),
      ...getPopularity(reactionsByUser.get(user.id)),
    };
  });
}