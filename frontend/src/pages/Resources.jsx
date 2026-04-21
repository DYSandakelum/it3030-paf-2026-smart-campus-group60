import React, { useMemo, useState } from 'react';
import useResources from '../hooks/useResources';
import ResourceFilter from '../components/resource/ResourceFilter';
import ResourceModal from '../components/resource/ResourceModal';
import ResourceForm from '../components/resource/ResourceForm';
import ResourceTable from '../components/resource/ResourceTable';
import ResourceCard from '../components/resource/ResourceCard';
import '../styles/resource.css';

export default function Resources() {
  const { resources, loading, error, filters, setFilters, create, update, remove } = useResources();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('create'); // 'create' | 'edit'
  const [selected, setSelected] = useState(null);

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewing, setViewing] = useState(null);

  const modalTitle = useMemo(() => (mode === 'edit' ? 'Edit Resource' : 'Create Resource'), [mode]);

  function openCreate() {
    setMode('create');
    setSelected(null);
    setIsViewOpen(false);
    setIsModalOpen(true);
  }

  function openEdit(resource) {
    setMode('edit');
    setSelected(resource);
    setIsViewOpen(false);
    setIsModalOpen(true);
  }

  function openView(resource) {
    setViewing(resource);
    setIsModalOpen(false);
    setIsViewOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function closeView() {
    setIsViewOpen(false);
  }

  const formatDateTime = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    // If backend returns an ISO string, this will format nicely.
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  };

  async function handleSubmit(payload) {
    if (mode === 'edit' && selected?.id != null) {
      const ok = await update(selected.id, payload);
      if (ok) closeModal();
      return;
    }

    const ok = await create(payload);
    if (ok) closeModal();
  }

  async function handleDelete(resource) {
    const confirmed = window.confirm(`Delete resource "${resource.name}"?`);
    if (!confirmed) return;

    await remove(resource.id);
  }

  function clearFilters() {
    setFilters({ type: '', capacity: '', location: '', status: '' });
  }

  return (
    <div className="resources-page">
      <div className="resources-header">
        <div className="resources-kicker">SMART CAMPUS • CATALOGUE</div>
        <div className="resources-header-row">
          <div>
            <div className="resources-title">Resources</div>
            <div className="resources-subtitle">
              Manage lecture halls, laboratories, meeting rooms and equipment across the campus.
            </div>
          </div>

          <div className="resources-actions">
            <button className="btn btn-primary" type="button" onClick={openCreate} disabled={loading}>
              + New resource
            </button>
          </div>
        </div>
      </div>

      <div className="resources-divider" />

      {error ? <div className="notice">{error}</div> : null}

      <ResourceFilter filters={filters} onChange={setFilters} onClear={clearFilters} disabled={loading} />

      {loading ? <div className="notice">Loading…</div> : null}

      <ResourceTable resources={resources} onView={openView} onEdit={openEdit} onDelete={handleDelete} />

      <div className="cards">
        {resources.map((r) => (
          <ResourceCard key={r.id} resource={r} onView={openView} onEdit={openEdit} onDelete={handleDelete} />
        ))}
      </div>

      <ResourceModal isOpen={isModalOpen} title={modalTitle} onClose={closeModal}>
        <ResourceForm
          mode={mode}
          initialValues={selected}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={loading}
        />
      </ResourceModal>

      <ResourceModal isOpen={isViewOpen} title="Resource Details" onClose={closeView}>
        {viewing ? (
          <div className="resource-details">
            <div className="details-grid">
              <div className="detail">
                <div className="detail-k">Name</div>
                <div className="detail-v">{viewing.name || '—'}</div>
              </div>

              <div className="detail">
                <div className="detail-k">Type</div>
                <div className="detail-v">{viewing.type || '—'}</div>
              </div>

              <div className="detail">
                <div className="detail-k">Location</div>
                <div className="detail-v">{viewing.location || '—'}</div>
              </div>

              <div className="detail">
                <div className="detail-k">Capacity</div>
                <div className="detail-v">{viewing.capacity ?? '—'}</div>
              </div>

              <div className="detail">
                <div className="detail-k">Availability Window</div>
                <div className="detail-v">{viewing.availabilityWindow || '—'}</div>
              </div>

              <div className="detail">
                <div className="detail-k">Allocated By</div>
                <div className="detail-v">{viewing.allocatedBy || '—'}</div>
              </div>

              <div className="detail">
                <div className="detail-k">Status</div>
                <div className="detail-v">{viewing.status || '—'}</div>
              </div>

              <div className="detail span-2">
                <div className="detail-k">Description</div>
                <div className="detail-v">{viewing.description || '—'}</div>
              </div>

              <div className="detail">
                <div className="detail-k">Created By</div>
                <div className="detail-v">{viewing.createdByUserId || '—'}</div>
              </div>

              <div className="detail">
                <div className="detail-k">Created At</div>
                <div className="detail-v">{formatDateTime(viewing.createdAt)}</div>
              </div>

              <div className="detail">
                <div className="detail-k">Updated At</div>
                <div className="detail-v">{formatDateTime(viewing.updatedAt)}</div>
              </div>
            </div>

            <div className="form-footer">
              <button className="btn btn-link" type="button" onClick={closeView}>
                Close
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  closeView();
                  openEdit(viewing);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ) : null}
      </ResourceModal>
    </div>
  );
}
