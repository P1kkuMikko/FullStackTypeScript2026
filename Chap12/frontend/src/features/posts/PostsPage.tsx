import { useEffect, useState, useOptimistic, useTransition } from 'react';
import { Link } from 'react-router';
import { postsApi } from '../../api/endpoints';
import { useAppSelector } from '../../store/hooks';
import type { Post } from '../../types';

export function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);

  const [optimisticPosts, removeOptimistic] = useOptimistic(
    posts,
    (current, deletedId: string | number) =>
      current.filter((p) => p.id !== deletedId)
  );
  const [, startTransition] = useTransition();

  useEffect(() => {
    postsApi
      .getAll()
      .then((res) => setPosts(Array.isArray(res) ? res : res.data))
      .finally(() => setIsLoading(false));
  }, []);

  function handleDelete(id: string | number) {
    setDeleteError(null);
    startTransition(async () => {
      removeOptimistic(id);
      try {
        await postsApi.delete(id);
        setPosts((prev) => prev.filter((p) => p.id !== id));
      } catch (e) {
        // Optimistic state reverts automatically when transition settles
        setDeleteError(
          e instanceof Error ? e.message : 'Failed to delete post'
        );
      }
    });
  }

  if (isLoading) {
    return <p>Loading posts...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Posts</h1>
        <Link to="/posts/new" className="btn-link">
          Create Post
        </Link>
      </div>
      {deleteError && <p className="error">{deleteError}</p>}
      {optimisticPosts.length === 0 ? (
        <p>No posts yet. Create the first one!</p>
      ) : (
        optimisticPosts.map((post) => {
          const canDelete =
            user?.role === 'ADMIN' ||
            (user && String(post.authorId) === String(user.id));

          return (
            <article key={post.id}>
              <div className="post-card-header">
                <div>
                  <Link to={`/posts/${post.id}`}>
                    <h2>{post.title}</h2>
                  </Link>
                  {post.author && (
                    <span className="meta">by {post.author.username}</span>
                  )}
                </div>
                {canDelete && (
                  <button
                    type="button"
                    className="btn-danger"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
              <p>
                {post.content.length > 150
                  ? `${post.content.slice(0, 150)}...`
                  : post.content}
              </p>
            </article>
          );
        })
      )}
    </div>
  );
}
