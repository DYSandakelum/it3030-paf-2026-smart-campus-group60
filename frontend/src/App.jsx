import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import BookingList from "./pages/BookingList.jsx";
import CreateBooking from "./pages/CreateBooking.jsx";
import BookingDetail from "./pages/BookingDetail.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";
import AuthCallback from "./pages/AuthCallback.jsx";

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
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;