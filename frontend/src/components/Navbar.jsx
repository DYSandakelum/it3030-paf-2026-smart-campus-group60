import React from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClassName = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

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
        </nav>
      </div>
    </header>
  );
}

export default Navbar;