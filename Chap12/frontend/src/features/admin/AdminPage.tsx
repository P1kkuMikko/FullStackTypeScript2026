import { useEffect, useState } from 'react';
import { usersApi } from '../../api/endpoints';
import { useAppSelector } from '../../store/hooks';
import type { User } from '../../types';

export function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    usersApi
      .getAll()
      .then(setUsers)
      .catch((e) =>
        setError(e instanceof Error ? e.message : 'Failed to load users')
      )
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDeleteUser(id: string | number) {
    setError(null);
    try {
      await usersApi.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete user');
    }
  }

  if (isLoading) {
    return <p>Loading admin panel...</p>;
  }

  return (
    <div>
      <h1>Admin Panel — Users ({users.length})</h1>
      {error && <p className="error">{error}</p>}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>
                  <span className="badge">{u.role}</span>
                </td>
                <td>
                  {String(u.id) !== String(currentUser?.id) && (
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDeleteUser(u.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
