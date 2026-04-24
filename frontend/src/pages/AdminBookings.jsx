import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllBookings, updateBooking, updateStatus } from "../services/bookingService.js";

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

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [activeRejectId, setActiveRejectId] = useState("");
  const [rejectReason, setRejectReason] = useState("");
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

  const handleApprove = async (booking) => {
    setActionMessage("");

    try {
      await updateStatus(booking.id, "APPROVED");
      setActionMessage("Booking approved successfully.");
      await loadBookings();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleReject = async (booking) => {
    setActionMessage("");

    if (!rejectReason.trim()) {
      setError("A rejection reason is required.");
      return;
    }

    try {
      const combinedNotes = [booking.notes, `Rejection reason: ${rejectReason.trim()}`]
        .filter(Boolean)
        .join("\n");

      await updateBooking(booking.id, {
        ...booking,
        status: "REJECTED",
        notes: combinedNotes,
      });

      setActionMessage("Booking rejected successfully.");
      setActiveRejectId("");
      setRejectReason("");
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
          <h1 className="page-title">Admin Panel</h1>
          <p className="page-subtitle">Review all bookings and process approvals or rejections.</p>
        </div>
        <Link className="button-secondary" to="/create">
          Create Booking
        </Link>
      </div>

      <div className="toolbar">
        <div className="field">
          <label htmlFor="adminStatusFilter">Status</label>
          <select
            id="adminStatusFilter"
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
          <label htmlFor="adminUserIdFilter">User ID</label>
          <input
            id="adminUserIdFilter"
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
          <span className="muted">Try changing the filter criteria.</span>
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
                <React.Fragment key={booking.id}>
                  <tr>
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
                        {booking.status === "PENDING" ? (
                          <button className="button" type="button" onClick={() => handleApprove(booking)}>
                            Approve
                          </button>
                        ) : null}
                        {booking.status !== "REJECTED" ? (
                          <button
                            className="button-danger"
                            type="button"
                            onClick={() => {
                              setActiveRejectId((current) => (current === booking.id ? "" : booking.id));
                              setRejectReason("");
                              setError("");
                            }}
                          >
                            Reject
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                  {activeRejectId === booking.id ? (
                    <tr>
                      <td colSpan="6">
                        <div className="rejection-panel">
                          <label htmlFor={`reason-${booking.id}`} className="filter-label">
                            Rejection Reason
                          </label>
                          <textarea
                            id={`reason-${booking.id}`}
                            value={rejectReason}
                            onChange={(event) => setRejectReason(event.target.value)}
                            placeholder="Explain why this booking is being rejected"
                          />
                          <div className="action-row">
                            <button className="button-danger" type="button" onClick={() => handleReject(booking)}>
                              Confirm Reject
                            </button>
                            <button
                              className="button-secondary"
                              type="button"
                              onClick={() => {
                                setActiveRejectId("");
                                setRejectReason("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AdminBookings;