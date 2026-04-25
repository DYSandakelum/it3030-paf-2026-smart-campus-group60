import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import AuthCallbackPage from './pages/auth/AuthCallbackPage';
import DashboardPage from './pages/admin/DashboardPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import Resources from './pages/Resources';
import ClientResourcesDashboard from './pages/client/ClientResourcesDashboard';
import useAuth from './hooks/useAuth';

function RoleDashboard() {
  const { isAdmin } = useAuth();
  return isAdmin() ? <DashboardPage /> : <ClientResourcesDashboard />;
}

function HomeRedirect() {
  const { isAdmin } = useAuth();
  return <Navigate to={isAdmin() ? '/resources' : '/client/dashboard'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<RoleDashboard />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route
              path="/resources"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <Resources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/dashboard"
              element={
                <ProtectedRoute roles={['USER', 'TECHNICIAN', 'ADMIN']}>
                  <ClientResourcesDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<HomeRedirect />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
