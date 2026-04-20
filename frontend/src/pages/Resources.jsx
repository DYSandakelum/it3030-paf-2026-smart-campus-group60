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

  const modalTitle = useMemo(() => (mode === 'edit' ? 'Edit Resource' : 'Create Resource'), [mode]);

  function openCreate() {
    setMode('create');
    setSelected(null);
    setIsModalOpen(true);
  }

  function openEdit(resource) {
    setMode('edit');
    setSelected(resource);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

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

      <ResourceTable resources={resources} onEdit={openEdit} onDelete={handleDelete} />

      <div className="cards">
        {resources.map((r) => (
          <ResourceCard key={r.id} resource={r} onEdit={openEdit} onDelete={handleDelete} />
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
    </div>
  );
}
