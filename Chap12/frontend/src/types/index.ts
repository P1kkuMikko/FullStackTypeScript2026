export interface User {
  id: string | number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN' | string;
  name?: string | null;
  profile?: {
    id: number;
    bio: string | null;
  } | null;
  posts?: Post[];
}

export interface Post {
  id: string | number;
  title: string;
  content: string;
  published?: boolean;
  authorId?: string | number;
  author?: {
    id: string | number;
    username: string;
    email?: string;
  };
  createdAt?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export type PostList = { data: Post[] } | Post[];
