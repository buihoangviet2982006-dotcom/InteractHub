import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
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

const HashtagPage = lazy(() =>
  import('./pages/HashtagPage').then((module) => ({
    default: module.HashtagPage,
  })),
);

function App() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-600">Đang tải trang...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<FeedPage />} />
            <Route path="/hashtags" element={<HashtagPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
