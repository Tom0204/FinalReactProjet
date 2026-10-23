import type { ApiPost, PostsResponse } from '../types/api';
import { request } from './client';

/* Récupère toutes les publications (limit=0), réduites à l'auteur et aux réactions */
export async function fetchPosts(signal?: AbortSignal): Promise<ApiPost[]> {
  const data = await request<PostsResponse>(
    '/posts?limit=0&select=userId,reactions',
    { signal },
  );
  return data.posts;
}