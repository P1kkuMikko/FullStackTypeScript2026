import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from '../components/Layout';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { PostsPage } from '../features/posts/PostsPage';
import { CreatePostPage } from '../features/posts/CreatePostPage';
import { PostDetailPage } from '../features/posts/PostDetailPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { AdminPage } from '../features/admin/AdminPage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<PostsPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="/posts/new" element={<CreatePostPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
