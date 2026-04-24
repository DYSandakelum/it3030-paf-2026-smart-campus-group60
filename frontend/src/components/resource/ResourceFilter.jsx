import React, { useState } from 'react';

const RESOURCE_TYPES = ['', 'LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT'];
const RESOURCE_STATUSES = ['', 'ACTIVE', 'OUT_OF_SERVICE'];

export default function ResourceFilter({ filters, onChange, onClear, disabled }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  function update(key, value) {
    onChange?.({ ...filters, [key]: value });
  }

  return (
    <div className="filter-panel">
      <div className="filter-topbar">
        <div className="filter-search">
          <label className="label">Location or name</label>
          <input
            className="input"
            value={filters.location}
            onChange={(e) => update('location', e.target.value)}
            placeholder="Search by location or name..."
            disabled={disabled}
          />
        </div>

        <div className="filter-actions">
          <button
            className="btn btn-outline"
            type="button"
            onClick={() => setShowAdvanced((prev) => !prev)}
            disabled={disabled}
            aria-expanded={showAdvanced}
          >
            Advanced
          </button>

          <button className="btn btn-link" type="button" onClick={onClear} disabled={disabled}>
            Clear filters
          </button>
        </div>
      </div>

      {showAdvanced ? (
        <>
          <div className="filter-grid filter-advanced">
            <div>
              <label className="label">Type</label>
              <select
                className="select"
                value={filters.type}
                onChange={(e) => update('type', e.target.value)}
                disabled={disabled}
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t || 'ALL'} value={t}>
                    {t ? t.replaceAll('_', ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) : 'All types'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Min capacity</label>
              <input
                className="input"
                type="number"
                min={0}
                value={filters.capacity}
                onChange={(e) => update('capacity', e.target.value)}
                placeholder="e.g. 20"
                disabled={disabled}
              />
            </div>

            <div>
              <label className="label">Status</label>
              <select
                className="select"
                value={filters.status}
                onChange={(e) => update('status', e.target.value)}
                disabled={disabled}
              >
                {RESOURCE_STATUSES.map((s) => (
                  <option key={s || 'ALL'} value={s}>
                    {s
                      ? s === 'ACTIVE'
                        ? 'Active'
                        : s === 'OUT_OF_SERVICE'
                          ? 'Out of service'
                          : s
                      : 'Any status'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
