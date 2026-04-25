import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getBookingById, updateStatus } from "../services/bookingService.js";

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

function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadBooking = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getBookingById(id);
      setBooking(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [id]);

  const handleCancel = async () => {
    setActionMessage("");

    try {
      await updateStatus(id, "CANCELLED");
      setActionMessage("Booking cancelled successfully.");
      await loadBooking();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <h1 className="page-title">Booking Details</h1>
          <p className="page-subtitle">Review the complete booking record and its current status.</p>
        </div>
        <Link className="button-secondary" to="/">
          Back to list
        </Link>
      </div>

      {actionMessage ? <div className="alert alert-success">{actionMessage}</div> : null}
      {error ? <div className="alert alert-error">{error}</div> : null}

      {loading ? (
        <div className="empty-state">Loading booking details...</div>
      ) : booking ? (
        <div className="detail-card">
          <div className="page-header" style={{ marginBottom: 0 }}>
            <div>
              <strong>{booking.resourceName || "Unnamed resource"}</strong>
              <p className="page-subtitle">Booking ID: {booking.id}</p>
            </div>
            <span className={statusClassName(booking.status)}>{booking.status}</span>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <dt>Resource ID</dt>
              <dd>{booking.resourceId || "-"}</dd>
            </div>
            <div className="detail-item">
              <dt>Resource Name</dt>
              <dd>{booking.resourceName || "-"}</dd>
            </div>
            <div className="detail-item">
              <dt>User ID</dt>
              <dd>{booking.userId || "-"}</dd>
            </div>
            <div className="detail-item">
              <dt>User Name</dt>
              <dd>{booking.userName || "-"}</dd>
            </div>
            <div className="detail-item">
              <dt>Start Time</dt>
              <dd>{formatDateTime(booking.startTime)}</dd>
            </div>
            <div className="detail-item">
              <dt>End Time</dt>
              <dd>{formatDateTime(booking.endTime)}</dd>
            </div>
            <div className="detail-item">
              <dt>Purpose</dt>
              <dd>{booking.purpose || "-"}</dd>
            </div>
            <div className="detail-item">
              <dt>Expected Attendees</dt>
              <dd>{booking.expectedAttendees ?? "-"}</dd>
            </div>
            <div className="detail-item span-2">
              <dt>Notes</dt>
              <dd>{booking.notes || "-"}</dd>
            </div>
            <div className="detail-item">
              <dt>Created At</dt>
              <dd>{formatDateTime(booking.createdAt)}</dd>
            </div>
            <div className="detail-item">
              <dt>Updated At</dt>
              <dd>{formatDateTime(booking.updatedAt)}</dd>
            </div>
          </div>

          {booking.status === "APPROVED" ? (
            <div className="action-row">
              <button className="button-secondary" type="button" onClick={handleCancel}>
                Cancel Booking
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default BookingDetail;