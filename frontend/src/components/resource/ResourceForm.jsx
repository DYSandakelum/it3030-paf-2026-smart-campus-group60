import React, { useMemo, useState } from 'react';

const RESOURCE_TYPES = ['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT'];
const RESOURCE_STATUSES = ['ACTIVE', 'OUT_OF_SERVICE'];

function labelize(value) {
  if (!value) return '';
  return String(value)
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function withDefault(values) {
  return {
    name: '',
    type: 'LECTURE_HALL',
    capacity: 0,
    location: '',
    availabilityWindow: '',
    status: 'ACTIVE',
    description: '',
    createdByUserId: '',
    ...values,
  };
}

export default function ResourceForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting,
  mode, // 'create' | 'edit'
}) {
  const defaults = useMemo(() => withDefault(initialValues), [initialValues]);
  const [form, setForm] = useState(defaults);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      type: form.type,
      capacity: Number(form.capacity),
      location: form.location.trim(),
      availabilityWindow: form.availabilityWindow?.trim() || null,
      status: form.status,
      description: form.description?.trim() || null,
      createdByUserId: form.createdByUserId.trim(),
    };

    onSubmit?.(payload);
  }

  const isEdit = mode === 'edit';

  return (
    <form onSubmit={handleSubmit} className="resource-form">
      <div className="form-grid">
        <div className="span-2">
          <label className="label">Name</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g., Main Lecture Hall"
            required
          />
        </div>

        <div>
          <label className="label">Type</label>
          <select
            className="select"
            value={form.type}
            onChange={(e) => updateField('type', e.target.value)}
            required
          >
            {RESOURCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {labelize(t)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Capacity</label>
          <input
            className="input"
            type="number"
            min={0}
            value={form.capacity}
            onChange={(e) => updateField('capacity', e.target.value)}
            required
          />
        </div>

        <div className="span-2">
          <label className="label">Location</label>
          <input
            className="input"
            value={form.location}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="e.g., Block A, Floor 2"
            required
          />
        </div>

        <div>
          <label className="label">Availability Window</label>
          <input
            className="input"
            value={form.availabilityWindow}
            onChange={(e) => updateField('availabilityWindow', e.target.value)}
            placeholder="e.g., Mon-Fri 08:00-17:00"
          />
        </div>

        <div>
          <label className="label">Status</label>
          <select
            className="select"
            value={form.status}
            onChange={(e) => updateField('status', e.target.value)}
            required
          >
            {RESOURCE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'ACTIVE' ? 'Active' : s === 'OUT_OF_SERVICE' ? 'Out of service' : s}
              </option>
            ))}
          </select>
        </div>

        <div className="span-2">
          <label className="label">Created by (user id)</label>
          <input
            className="input"
            value={form.createdByUserId}
            onChange={(e) => updateField('createdByUserId', e.target.value)}
            placeholder="e.g., USR001"
            required
            disabled={isEdit}
          />
        </div>

        <div className="span-2">
          <label className="label">Description</label>
          <textarea
            className="textarea"
            rows={3}
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="form-footer">
        <button className="btn btn-link" type="button" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isEdit ? 'Save Changes' : 'Create Resource'}
        </button>
      </div>
    </form>
  );
}
