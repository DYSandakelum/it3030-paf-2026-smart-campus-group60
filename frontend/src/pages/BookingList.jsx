import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBooking, getAllBookings, updateStatus } from "../services/bookingService.js";

const STATUS_OPTIONS = ["", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

const statusClassName = (status) =>
  `status-badge status-${String(status || "").toLowerCase() || "pending"}`;

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getAllBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) {
      return;
    }

    setActionMessage("");

    try {
      await deleteBooking(id);
      setActionMessage("Booking deleted successfully.");
      await loadBookings();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleCancel = async (id) => {
    setActionMessage("");

    try {
      await updateStatus(id, "CANCELLED");
      setActionMessage("Booking cancelled successfully.");
      await loadBookings();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = statusFilter ? booking.status === statusFilter : true;
    const matchesUser = userIdFilter
      ? String(booking.userId || "")
          .toLowerCase()
          .includes(userIdFilter.toLowerCase())
      : true;

    return matchesStatus && matchesUser;
  });

  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Bookings</h1>
          <p className="page-subtitle">Review, cancel, or remove bookings you no longer need.</p>
        </div>
        <Link className="button" to="/create">
          Create Booking
        </Link>
      </div>

      <div className="toolbar">
        <div className="field">
          <label htmlFor="statusFilter">Status</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status || "all"} value={status}>
                {status || "All statuses"}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="userIdFilter">User ID</label>
          <input
            id="userIdFilter"
            type="text"
            value={userIdFilter}
            onChange={(event) => setUserIdFilter(event.target.value)}
            placeholder="Filter by userId"
          />
        </div>
        <div className="field" style={{ display: "flex", justifyContent: "flex-end", alignItems: "end" }}>
          <button className="button-secondary" type="button" onClick={loadBookings}>
            Refresh
          </button>
        </div>
      </div>

      {actionMessage ? <div className="alert alert-success">{actionMessage}</div> : null}
      {error ? <div className="alert alert-error">{error}</div> : null}

      {loading ? (
        <div className="empty-state">Loading bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="empty-state">
          <strong>No bookings found.</strong>
          <span className="muted">Try widening your filters or create a new booking.</span>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Resource</th>
                <th>User</th>
                <th>Schedule</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <div className="stack">
                      <strong>{booking.resourceName || "Unnamed resource"}</strong>
                      <span className="muted">{booking.resourceId}</span>
                    </div>
                  </td>
                  <td>
                    <div className="stack">
                      <strong>{booking.userName || "Unnamed user"}</strong>
                      <span className="muted">{booking.userId}</span>
                    </div>
                  </td>
                  <td>
                    <div className="stack">
                      <span>{formatDateTime(booking.startTime)}</span>
                      <span className="muted">to {formatDateTime(booking.endTime)}</span>
                    </div>
                  </td>
                  <td>{booking.purpose || "-"}</td>
                  <td>
                    <span className={statusClassName(booking.status)}>{booking.status}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link className="button-soft" to={`/booking/${booking.id}`}>
                        View
                      </Link>
                      <button className="button-danger" type="button" onClick={() => handleDelete(booking.id)}>
                        Delete
                      </button>
                      {booking.status === "APPROVED" ? (
                        <button className="button-secondary" type="button" onClick={() => handleCancel(booking.id)}>
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default BookingList;