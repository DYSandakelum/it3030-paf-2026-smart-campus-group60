import React from 'react';

export default function ResourceStatusBadge({ status }) {
  const normalized = status || 'UNKNOWN';
  const isActive = normalized === 'ACTIVE';
  const isOut = normalized === 'OUT_OF_SERVICE';
  const label = isActive ? 'Active' : isOut ? 'Out of service' : normalized;
  const className = isActive ? 'badge badge-active' : isOut ? 'badge badge-out' : 'badge';

  return (
    <span className={className}>
      <span className="badge-dot" aria-hidden="true" />
      {label}
    </span>
  );
}
