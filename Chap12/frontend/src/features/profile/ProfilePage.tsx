import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { usersApi } from '../../api/endpoints';
import type { User } from '../../types';

export function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    usersApi
      .getProfile()
      .then(setProfile)
      .catch((e) =>
        setError(e instanceof Error ? e.message : 'Failed to load profile')
      )
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (error || !profile) {
    return <p className="error">{error ?? 'Profile not found'}</p>;
  }

  return (
    <div>
      <h1>My Profile</h1>
      <article>
        <h2>{profile.username}</h2>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Role:</strong> <span className="badge">{profile.role}</span>
        </p>
        {profile.profile?.bio && (
          <p>
            <strong>Bio:</strong> {profile.profile.bio}
          </p>
        )}
      </article>

      <h2>My Posts ({profile.posts?.length ?? 0})</h2>
      {profile.posts && profile.posts.length > 0 ? (
        profile.posts.map((post) => (
          <article key={post.id}>
            <Link to={`/posts/${post.id}`}>
              <h2>{post.title}</h2>
            </Link>
            <p>{post.content.slice(0, 150)}</p>
          </article>
        ))
      ) : (
        <p>You have not created any posts yet.</p>
      )}
    </div>
  );
}
