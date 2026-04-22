import { BrowserRouter, Routes, Route, Navigate }
  from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import AuthCallbackPage from './pages/auth/AuthCallbackPage';
import DashboardPage from './pages/admin/DashboardPage';
import NotificationsPage
  from './pages/notifications/NotificationsPage';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback"
            element={<AuthCallbackPage />} />

          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard"
              element={<DashboardPage />} />
            <Route path="/notifications"
              element={<NotificationsPage />} />
            <Route path="/"
              element={<Navigate to="/dashboard" replace />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;