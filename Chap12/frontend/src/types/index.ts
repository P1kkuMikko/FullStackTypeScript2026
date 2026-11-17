export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN' | string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  published?: boolean;
  authorId?: string;
  createdAt?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export type PostList = { data: Post[] } | Post[];
