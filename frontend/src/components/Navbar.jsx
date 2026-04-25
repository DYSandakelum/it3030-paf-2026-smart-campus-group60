import React from "react";
import { NavLink } from "react-router-dom";
import { clearAuthToken, getAuthToken } from "../auth/token.js";

function Navbar() {
  const linkClassName = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  const isAuthenticated = Boolean(getAuthToken());

  const handleLogout = () => {
    clearAuthToken();
    window.location.href = "/";
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <strong>Smart Campus</strong>
          <span>Booking Management</span>
        </div>
        <nav className="nav-links" aria-label="Booking navigation">
          <NavLink className={linkClassName} to="/">
            My Bookings
          </NavLink>
          <NavLink className={linkClassName} to="/create">
            Create Booking
          </NavLink>
          <NavLink className={linkClassName} to="/admin">
            Admin Panel
          </NavLink>
          {isAuthenticated ? (
            <button className="nav-action" type="button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <a className="nav-action" href="http://localhost:8081/oauth2/authorization/google">
              Sign in with Google
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;