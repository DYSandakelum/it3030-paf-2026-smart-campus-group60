import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import BookingList from "./pages/BookingList.jsx";
import CreateBooking from "./pages/CreateBooking.jsx";
import BookingDetail from "./pages/BookingDetail.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<BookingList />} />
            <Route path="/create" element={<CreateBooking />} />
            <Route path="/booking/:id" element={<BookingDetail />} />
            <Route path="/admin" element={<AdminBookings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route, Navigate }
  from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute
  from './components/common/ProtectedRoute';
import MainLayout
  from './components/layout/MainLayout';
import LoginPage
  from './pages/auth/LoginPage';
import AuthCallbackPage
  from './pages/auth/AuthCallbackPage';
import ProfilePage
  from './pages/auth/ProfilePage';
import DashboardPage
  from './pages/admin/DashboardPage';
import AdminPage
  from './pages/admin/AdminPage';
import UserManagementPage
  from './pages/admin/UserManagementPage';
import NotificationsPage
  from './pages/notifications/NotificationsPage';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>

          <Route path="/login"
            element={<LoginPage />} />
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
            <Route path="/profile"
              element={<ProfilePage />} />

            <Route path="/admin"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminPage />
                </ProtectedRoute>
              }/>
            <Route path="/admin/users"
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <UserManagementPage />
                </ProtectedRoute>
              }/>

            <Route path="/"
              element={
                <Navigate to="/dashboard" replace />
              }/>
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;