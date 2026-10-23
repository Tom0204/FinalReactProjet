/* Adresse d'un utilisateur DummyJSON */
export interface ApiAddress {
  city: string;
  state: string;
  country: string;
}

/* Entreprise d'un utilisateur DummyJSON : sert de profession */
export interface ApiCompany {
  title: string;
}

/* Utilisateur DummyJSON : il joue le rôle du prestataire */
export interface ApiUser {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  address: ApiAddress;
  company: ApiCompany;
}

/* Recette DummyJSON : elle devient une annonce de cuisine à domicile */
export interface ApiRecipe {
  id: number;
  name: string;
  userId: number;
  cuisine: string;
  difficulty: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  image: string;
  rating: number;
  reviewCount: number;
}

/* Réactions (j'aime / je n'aime pas) à une publication */
export interface ApiReactions {
  likes: number;
  dislikes: number;
}

/* Publication DummyJSON : ses réactions servent à calculer la note */
export interface ApiPost {
  id: number;
  userId: number;
  reactions: ApiReactions;
}

/* Réponse paginée de GET /users */
export interface UsersResponse {
  users: ApiUser[];
}

/* Réponse paginée de GET /recipes */
export interface RecipesResponse {
  recipes: ApiRecipe[];
}

/* Réponse paginée de GET /posts */
export interface PostsResponse {
  posts: ApiPost[];
}