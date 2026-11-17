import { apiClient } from './client';
import type { User, Post, LoginResponse, PostList } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  register: (email: string, password: string, username: string) =>
    apiClient<LoginResponse>('/auth/register', {
      method: 'POST',
      body: { email, password, username },
    }),

  refresh: () =>
    apiClient<{ accessToken: string }>('/auth/refresh', {
      method: 'POST',
    }),

  logout: () =>
    apiClient<void>('/auth/logout', { method: 'POST' }),
};

export const postsApi = {
  getAll: () => apiClient<PostList>('/v1/posts'),

  getById: (id: string | number) => apiClient<Post>(`/v1/posts/${id}`),

  create: (data: { title: string; content: string; published?: boolean }) =>
    apiClient<Post>('/v1/posts', {
      method: 'POST',
      body: { published: true, ...data },
    }),

  update: (id: string | number, data: { title?: string; content?: string }) =>
    apiClient<Post>(`/v1/posts/${id}`, { method: 'PUT', body: data }),

  delete: (id: string | number) =>
    apiClient<void>(`/v1/posts/${id}`, { method: 'DELETE' }),
};

export const usersApi = {
  getProfile: () => apiClient<User>('/v1/users/me'),
  getAll: () => apiClient<User[]>('/v1/users'),
  delete: (id: string | number) =>
    apiClient<void>(`/v1/users/${id}`, { method: 'DELETE' }),
};
