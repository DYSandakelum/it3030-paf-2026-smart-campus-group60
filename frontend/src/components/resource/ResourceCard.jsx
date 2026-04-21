import React from 'react';
import ResourceStatusBadge from './ResourceStatusBadge';

function labelizeType(type) {
  if (!type) return '';
  return String(type)
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ResourceCard({ resource, onView, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="card-title">{resource.name}</div>
      <div className="card-meta">Type: {labelizeType(resource.type)}</div>
      <div className="card-meta">Capacity: {resource.capacity}</div>
      <div className="card-meta">Location: {resource.location}</div>
      <div className="card-meta">
        Status: <ResourceStatusBadge status={resource.status} />
      </div>
      {resource.availabilityWindow ? (
        <div className="card-meta">Availability: {resource.availabilityWindow}</div>
      ) : null}
      {resource.allocatedBy ? <div className="card-meta">Allocated by: {resource.allocatedBy}</div> : null}
      {resource.description ? (
        <div className="card-meta">Description: {resource.description}</div>
      ) : null}

      <div className="row-actions" style={{ marginTop: 10 }}>
        <button className="btn btn-outline" type="button" onClick={() => onView?.(resource)}>
          View
        </button>
        <button className="btn btn-outline" type="button" onClick={() => onEdit?.(resource)}>
          Edit
        </button>
        <button className="btn btn-danger-outline" type="button" onClick={() => onDelete?.(resource)}>
          Delete
        </button>
      </div>
    </div>
  );
}
