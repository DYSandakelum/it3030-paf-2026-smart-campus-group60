import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createBooking } from "../services/bookingService.js";

const initialForm = {
  resourceId: "",
  resourceName: "",
  userId: "",
  userName: "",
  startTime: "",
  endTime: "",
  purpose: "",
  expectedAttendees: "",
  notes: "",
};

const normalizeDateTime = (value) => (value && value.length === 16 ? `${value}:00` : value);

function CreateBooking() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createdBookingId, setCreatedBookingId] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setCreatedBookingId("");

    if (!form.startTime || !form.endTime) {
      setError("Start time and end time are required.");
      return;
    }

    if (new Date(form.endTime) <= new Date(form.startTime)) {
      setError("End time must be after start time.");
      return;
    }

    setLoading(true);

    try {
      const createdBooking = await createBooking({
        resourceId: form.resourceId.trim(),
        resourceName: form.resourceName.trim(),
        userId: form.userId.trim(),
        userName: form.userName.trim(),
        startTime: normalizeDateTime(form.startTime),
        endTime: normalizeDateTime(form.endTime),
        purpose: form.purpose.trim(),
        expectedAttendees: form.expectedAttendees === "" ? null : Number(form.expectedAttendees),
        notes: form.notes.trim(),
        status: "PENDING",
      });

      setSuccess("Booking created successfully.");
      setCreatedBookingId(createdBooking?.id || "");
      setForm(initialForm);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-card">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create Booking</h1>
          <p className="page-subtitle">Fill in the booking details and submit a new request.</p>
        </div>
      </div>

      {success ? (
        <div className="alert alert-success">
          <div>{success}</div>
          {createdBookingId ? (
            <div style={{ marginTop: "0.75rem" }}>
              <Link className="button-soft" to={`/booking/${createdBookingId}`}>
                View created booking
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
      {error ? <div className="alert alert-error">{error}</div> : null}

      <form onSubmit={handleSubmit} className="form-grid">
        <div className="field">
          <label htmlFor="resourceId">Resource ID</label>
          <input id="resourceId" name="resourceId" type="text" value={form.resourceId} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="resourceName">Resource Name</label>
          <input id="resourceName" name="resourceName" type="text" value={form.resourceName} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="userId">User ID</label>
          <input id="userId" name="userId" type="text" value={form.userId} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="userName">User Name</label>
          <input id="userName" name="userName" type="text" value={form.userName} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="startTime">Start Time</label>
          <input id="startTime" name="startTime" type="datetime-local" step="1" value={form.startTime} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="endTime">End Time</label>
          <input id="endTime" name="endTime" type="datetime-local" step="1" value={form.endTime} onChange={handleChange} required />
        </div>
        <div className="field span-2">
          <label htmlFor="purpose">Purpose</label>
          <input id="purpose" name="purpose" type="text" value={form.purpose} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="expectedAttendees">Expected Attendees</label>
          <input id="expectedAttendees" name="expectedAttendees" type="number" min="0" value={form.expectedAttendees} onChange={handleChange} />
        </div>
        <div className="field">
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} />
        </div>
        <div className="span-2 action-row">
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Booking"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreateBooking;