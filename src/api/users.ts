import type { ApiUser, UsersResponse } from '../types/api';
import { request } from './client';

const FIELDS = 'firstName,lastName,age,email,phone,address,company';

/* Récupère tous les utilisateurs (limit=0), allégés grâce à `select` */
export async function fetchUsers(signal?: AbortSignal): Promise<ApiUser[]> {
  const data = await request<UsersResponse>(`/users?limit=0&select=${FIELDS}`, {
    signal,
  });
  return data.users;
}