import React, { useMemo, useState } from 'react';
import { BUILDINGS, buildLocationString, getBuilding, parseLocationString } from './locationCatalog';

const RESOURCE_TYPES = ['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT'];
const RESOURCE_STATUSES = ['ACTIVE', 'OUT_OF_SERVICE'];

function parseAvailabilityWindow(value) {
  const raw = (value || '').trim();
  if (!raw) return { start: '', end: '' };

  const match = raw.match(/(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
  if (!match) return { start: '', end: '' };
  return { start: match[1], end: match[2] };
}

function labelize(value) {
  if (!value) return '';
  return String(value)
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function withDefault(values) {
  const parsedLocation = parseLocationString(values?.location);
  const parsedAvailability = parseAvailabilityWindow(values?.availabilityWindow);

  return {
    name: '',
    type: 'LECTURE_HALL',
    capacity: 0,
    // Location selectors
    buildingKey: parsedLocation.buildingKey || '',
    floor: parsedLocation.floor || '',
    hall: parsedLocation.hall || '',
    manualLocation: parsedLocation.manualLocation || '',
    availabilityStart: parsedAvailability.start,
    availabilityEnd: parsedAvailability.end,
    status: 'ACTIVE',
    description: '',
    allocatedBy: '',
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

  function updateBuilding(nextKey) {
    setForm((prev) => {
      if (nextKey === prev.buildingKey) return prev;
      return {
        ...prev,
        buildingKey: nextKey,
        floor: '',
        hall: '',
        manualLocation: nextKey === 'OTHER' ? prev.manualLocation : '',
      };
    });
  }

  function updateFloor(nextFloor) {
    setForm((prev) => ({ ...prev, floor: nextFloor, hall: '' }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const location = buildLocationString({
      buildingKey: form.buildingKey,
      floor: form.floor,
      hall: form.hall,
      manualLocation: form.manualLocation,
    });

    const availabilityStart = String(form.availabilityStart || '').trim();
    const availabilityEnd = String(form.availabilityEnd || '').trim();
    const availabilityWindow =
      availabilityStart && availabilityEnd ? `${availabilityStart}-${availabilityEnd}` : null;

    const payload = {
      name: form.name.trim(),
      type: form.type,
      capacity: Number(form.capacity),
      location,
      availabilityWindow,
      status: form.status,
      description: form.description?.trim() || null,
      allocatedBy: form.allocatedBy.trim(),
    };

    onSubmit?.(payload);
  }

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
          <label className="label">Building</label>
          <select
            className="select"
            value={form.buildingKey}
            onChange={(e) => updateBuilding(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a building…
            </option>
            {BUILDINGS.map((b) => (
              <option key={b.key} value={b.key}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {form.buildingKey === 'OTHER' ? (
          <div className="span-2">
            <label className="label">Location (custom)</label>
            <input
              className="input"
              value={form.manualLocation}
              onChange={(e) => updateField('manualLocation', e.target.value)}
              placeholder="e.g., Block A, Floor 2"
              required
            />
          </div>
        ) : (
          <>
            <div>
              <label className="label">Floor</label>
              <select
                className="select"
                value={form.floor}
                onChange={(e) => updateFloor(e.target.value)}
                disabled={!form.buildingKey}
                required
              >
                <option value="" disabled>
                  Select…
                </option>
                {(getBuilding(form.buildingKey)?.floors || []).map((f) => (
                  <option key={String(f)} value={String(f)}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Hall</label>
              <select
                className="select"
                value={form.hall}
                onChange={(e) => updateField('hall', e.target.value)}
                disabled={!form.buildingKey || !form.floor}
                required
              >
                <option value="" disabled>
                  Select…
                </option>
                {(getBuilding(form.buildingKey)?.halls?.(form.floor) || []).map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label className="label">Available From</label>
          <input
            className="input"
            type="time"
            value={form.availabilityStart}
            onChange={(e) => updateField('availabilityStart', e.target.value)}
          />
        </div>

        <div>
          <label className="label">Available To</label>
          <input
            className="input"
            type="time"
            value={form.availabilityEnd}
            onChange={(e) => updateField('availabilityEnd', e.target.value)}
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
          <label className="label">Allocated By</label>
          <input
            className="input"
            value={form.allocatedBy}
            onChange={(e) => updateField('allocatedBy', e.target.value)}
            placeholder="e.g., Mr. Perera"
            required
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
          {mode === 'edit' ? 'Save Changes' : 'Create Resource'}
        </button>
      </div>
    </form>
  );
}
