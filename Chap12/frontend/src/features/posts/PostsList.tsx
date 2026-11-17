import { useState, useOptimistic, useTransition } from 'react';
import { postsApi } from '../../api/endpoints';
import type { Post } from '../../types';

export function PostsList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [optimisticPosts, removeOptimistic] = useOptimistic(
    posts,
    (current, deletedId: string | number) =>
      current.filter((p) => p.id !== deletedId)
  );
  const [, startTransition] = useTransition();

  async function handleDelete(id: string | number) {
    startTransition(async () => {
      removeOptimistic(id);
      try {
        await postsApi.delete(id);
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } catch {
        // Optimistic state reverts automatically when transition settles
        // Show an error toast to the user
      }
    });
  }

  return (
    <ul>
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          {post.title}
          <button onClick={() => handleDelete(post.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
