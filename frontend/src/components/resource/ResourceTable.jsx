import React from 'react';
import ResourceStatusBadge from './ResourceStatusBadge';

function labelizeType(type) {
  if (!type) return '';
  const nice = String(type)
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return nice;
}

export default function ResourceTable({ resources, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Location</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((r) => (
            <tr key={r.id}>
              <td>
                <div className="cell-title">{r.name}</div>
                {r.availabilityWindow ? <div className="cell-sub">{r.availabilityWindow}</div> : null}
              </td>
              <td>
                <span className="pill">{labelizeType(r.type)}</span>
              </td>
              <td>{r.location}</td>
              <td className="cell-num">{r.capacity}</td>
              <td>
                <ResourceStatusBadge status={r.status} />
              </td>
              <td>
                <div className="row-actions">
                  <button className="btn btn-outline" type="button" onClick={() => onEdit?.(r)}>
                    Edit
                  </button>
                  <button className="btn btn-danger-outline" type="button" onClick={() => onDelete?.(r)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {resources.length === 0 && (
            <tr>
              <td colSpan={6}>
                <div className="notice">No resources found.</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
