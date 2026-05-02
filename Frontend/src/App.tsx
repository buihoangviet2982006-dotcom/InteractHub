import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/routing/ProtectedRoute';
import './index.css';

const FeedPage = lazy(() =>
  import('./pages/FeedPage').then((module) => ({
    default: module.FeedPage,
  })),
);

const LoginPage = lazy(() =>
  import('./pages/LoginPage').then((module) => ({
    default: module.LoginPage,
  })),
);

const RegisterPage = lazy(() =>
  import('./pages/RegisterPage').then((module) => ({
    default: module.RegisterPage,
  })),
);

const HashtagPage = lazy(() =>
  import('./pages/HashtagPage').then((module) => ({
    default: module.HashtagPage,
  })),
);

const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((module) => ({
    default: module.ProfilePage,
  })),
);

const SearchPage = lazy(() =>
  import('./pages/SearchPage').then((module) => ({
    default: module.SearchPage,
  })),
);

const FriendsPage = lazy(() =>
  import('./pages/FriendsPage').then((module) => ({
    default: module.FriendsPage,
  })),
);

const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((module) => ({
    default: module.SettingsPage,
  })),
);

const AdminReportsPage = lazy(() =>
  import('./pages/AdminReportsPage').then((module) => ({
    default: module.AdminReportsPage,
  })),
);

const AdminPostsPage = lazy(() =>
  import('./pages/AdminPostsPage').then((module) => ({
    default: module.AdminPostsPage,
  })),
);

function App() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-600">Đang tải trang...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<FeedPage />} />
            <Route path="/hashtags" element={<HashtagPage />} />
            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          
          <Route element={<AdminLayout />}>
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/posts" element={<AdminPostsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
