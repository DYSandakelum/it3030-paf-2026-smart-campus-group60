import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import AuthCallbackPage from './pages/auth/AuthCallbackPage';
import ProfilePage from './pages/auth/ProfilePage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminPage from './pages/admin/AdminPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import Resources from './pages/Resources';
import BookingList from './pages/BookingList';
import CreateBooking from './pages/CreateBooking';
import BookingDetail from './pages/BookingDetail';
import AdminBookings from './pages/AdminBookings';

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
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/bookings" element={<BookingList />} />
            <Route path="/create" element={<CreateBooking />} />
            <Route path="/booking/:id" element={<BookingDetail />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminBookings />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
