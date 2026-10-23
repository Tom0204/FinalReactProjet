import type { ApiRecipe, RecipesResponse } from '../types/api';
import { request } from './client';

const FIELDS =
  'name,userId,cuisine,difficulty,prepTimeMinutes,cookTimeMinutes,servings,image,rating,reviewCount';

/* Récupère toutes les recettes (limit=0) */
export async function fetchRecipes(signal?: AbortSignal): Promise<ApiRecipe[]> {
  const data = await request<RecipesResponse>(
    `/recipes?limit=0&select=${FIELDS}`,
    { signal },
  );
  return data.recipes;
}