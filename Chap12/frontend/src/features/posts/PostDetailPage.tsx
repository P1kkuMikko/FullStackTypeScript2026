import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { postsApi } from '../../api/endpoints';
import { useAppSelector } from '../../store/hooks';
import type { Post } from '../../types';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    postsApi
      .getById(id)
      .then(setPost)
      .catch((e) =>
        setError(e instanceof Error ? e.message : 'Post not found')
      )
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!post) return;
    try {
      await postsApi.delete(post.id);
      navigate('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete post');
    }
  }

  if (isLoading) {
    return <p>Loading post...</p>;
  }

  if (error || !post) {
    return (
      <div>
        <p className="error">{error ?? 'Post not found'}</p>
        <Link to="/">← Back to Posts</Link>
      </div>
    );
  }

  const canDelete =
    user?.role === 'ADMIN' ||
    (user && String(post.authorId) === String(user.id));

  return (
    <div>
      <Link to="/">← Back to Posts</Link>
      <article>
        <div className="post-card-header">
          <div>
            <h1>{post.title}</h1>
            {post.author && (
              <span className="meta">by {post.author.username}</span>
            )}
          </div>
          {canDelete && (
            <button
              type="button"
              className="btn-danger"
              onClick={handleDelete}
            >
              Delete Post
            </button>
          )}
        </div>
        <p style={{ whiteSpace: 'pre-wrap', marginTop: '16px' }}>
          {post.content}
        </p>
      </article>
    </div>
  );
}
