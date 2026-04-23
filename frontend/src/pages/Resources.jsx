import React, { useEffect, useMemo, useState } from 'react';
import useResources from '../hooks/useResources';
import ResourceFilter from '../components/resource/ResourceFilter';
import ResourceModal from '../components/resource/ResourceModal';
import ResourceForm from '../components/resource/ResourceForm';
import ResourceTable from '../components/resource/ResourceTable';
import ResourceCard from '../components/resource/ResourceCard';
import {
  createEquipmentAllocation,
  getEquipmentAvailability,
  listHallEquipmentAllocations,
} from '../api/equipmentAllocationApi';
import '../styles/resource.css';

export default function Resources() {
  const { resources, loading, error, filters, setFilters, create, update, remove } = useResources();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState('create'); // 'create' | 'edit'
  const [selected, setSelected] = useState(null);
  const [modalError, setModalError] = useState('');

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewing, setViewing] = useState(null);

  const [allocations, setAllocations] = useState([]);
  const [allocLoading, setAllocLoading] = useState(false);
  const [allocError, setAllocError] = useState('');
  const [allocSearch, setAllocSearch] = useState('');
  const [allocForm, setAllocForm] = useState({ equipmentId: '', quantity: 1, startTime: '', endTime: '' });
  const [allocAvailability, setAllocAvailability] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);

  const modalTitle = useMemo(() => (mode === 'edit' ? 'Edit Resource' : 'Create Resource'), [mode]);

  function openCreate() {
    setMode('create');
    setSelected(null);
    setIsViewOpen(false);
    setModalError('');
    setIsModalOpen(true);
  }

  function openEdit(resource) {
    setMode('edit');
    setSelected(resource);
    setIsViewOpen(false);
    setModalError('');
    setIsModalOpen(true);
  }

  function openView(resource) {
    setViewing(resource);
    setIsModalOpen(false);
    setIsViewOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setModalError('');
  }

  function closeView() {
    setIsViewOpen(false);
  }

  function toLocalInputValue(date) {
    if (!date) return '';
    const pad2 = (n) => String(n).padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad2(date.getMonth() + 1);
    const dd = pad2(date.getDate());
    const hh = pad2(date.getHours());
    const min = pad2(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  }

  const formatDateTime = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    // If backend returns an ISO string, this will format nicely.
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
  };

  const equipmentOptions = useMemo(
    () => resources.filter((r) => r.type === 'EQUIPMENT' && r.status === 'ACTIVE'),
    [resources]
  );

  const filteredEquipmentOptions = useMemo(() => {
    const q = String(allocSearch || '').trim().toLowerCase();
    if (!q) return equipmentOptions;
    return equipmentOptions.filter((e) => {
      const name = String(e?.name || '').toLowerCase();
      const location = String(e?.location || '').toLowerCase();
      return name.includes(q) || location.includes(q);
    });
  }, [allocSearch, equipmentOptions]);

  const selectedAllocEquipment = useMemo(() => {
    const id = Number(allocForm.equipmentId);
    if (!id) return null;
    return equipmentOptions.find((e) => Number(e.id) === id) || null;
  }, [allocForm.equipmentId, equipmentOptions]);

  useEffect(() => {
    if (!isViewOpen || !viewing || viewing.type === 'EQUIPMENT') return undefined;

    let cancelled = false;

    async function fetchAllocations({ showLoading }) {
      if (cancelled) return;
      setAllocError('');
      if (showLoading) setAllocLoading(true);
      try {
        const data = await listHallEquipmentAllocations(viewing.id);
        if (!cancelled) setAllocations(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setAllocError('Failed to load equipment allocations');
      } finally {
        if (showLoading && !cancelled) setAllocLoading(false);
      }
    }

    fetchAllocations({ showLoading: true });
    const interval = window.setInterval(() => {
      fetchAllocations({ showLoading: false });
    }, 5000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [isViewOpen, viewing?.id, viewing?.type]);

  useEffect(() => {
    if (!isViewOpen || !viewing || viewing.type === 'EQUIPMENT') return;

    const now = new Date();
    const start = new Date(now);
    start.setSeconds(0, 0);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    setAllocForm((prev) => ({
      ...prev,
      quantity: prev.quantity || 1,
      startTime: prev.startTime || toLocalInputValue(start),
      endTime: prev.endTime || toLocalInputValue(end),
    }));
  }, [isViewOpen, viewing?.id, viewing?.type]);

  useEffect(() => {
    async function loadAvailability() {
      if (!isViewOpen || !viewing || viewing.type === 'EQUIPMENT') return;
      if (!allocForm.equipmentId || !allocForm.startTime || !allocForm.endTime) {
        setAllocAvailability(null);
        return;
      }

      setAvailabilityLoading(true);
      try {
        const data = await getEquipmentAvailability({
          equipmentId: Number(allocForm.equipmentId),
          startTime: new Date(allocForm.startTime).toISOString(),
          endTime: new Date(allocForm.endTime).toISOString(),
        });
        setAllocAvailability(data || null);
      } catch (e) {
        setAllocAvailability(null);
      } finally {
        setAvailabilityLoading(false);
      }
    }

    loadAvailability();
  }, [isViewOpen, viewing?.id, viewing?.type, allocForm.equipmentId, allocForm.startTime, allocForm.endTime]);

  async function handleAllocateEquipment(e) {
    e.preventDefault();
    if (!viewing) return;

    setAllocError('');

    try {
      const payload = {
        hallId: viewing.id,
        equipmentId: Number(allocForm.equipmentId),
        quantity: Number(allocForm.quantity),
        startTime: new Date(allocForm.startTime).toISOString(),
        endTime: new Date(allocForm.endTime).toISOString(),
      };

      await createEquipmentAllocation(payload);

      const data = await listHallEquipmentAllocations(viewing.id);
      setAllocations(Array.isArray(data) ? data : []);
    } catch (err) {
      const api = err?.response?.data;
      const message = api?.message || err?.message || 'Allocation failed';
      const hint = api?.data;
      if (hint?.nextAvailableAt) {
        setAllocError(`${message}. Available after ${formatDateTime(hint.nextAvailableAt)}`);
      } else {
        setAllocError(message);
      }
    }
  }

  async function handleSubmit(value) {
    const resourcePayload = value?.payload ? value.payload : value;
    const equipmentAllocation = value?.payload ? value.equipmentAllocation : null;

    if (mode === 'edit' && selected?.id != null) {
      const ok = await update(selected.id, resourcePayload);
      if (ok) closeModal();
      return;
    }

    if (equipmentAllocation) {
      try {
        const availability = await getEquipmentAvailability({
          equipmentId: Number(equipmentAllocation.equipmentId),
          startTime: equipmentAllocation.startTime,
          endTime: equipmentAllocation.endTime,
        });

        if (availability?.availableQuantity != null && Number(equipmentAllocation.quantity) > availability.availableQuantity) {
          const hint = availability?.nextAvailableAt ? ` Available after ${formatDateTime(availability.nextAvailableAt)}.` : '';
          setModalError(`Not enough equipment available for that time window.${hint}`);
          return;
        }
      } catch (e) {
        setModalError('Unable to check equipment availability. Please try again.');
        return;
      }
    }

    const created = await create(resourcePayload);
    if (!created) return;

    if (equipmentAllocation) {
      try {
        await createEquipmentAllocation({
          hallId: created.id,
          equipmentId: Number(equipmentAllocation.equipmentId),
          quantity: Number(equipmentAllocation.quantity),
          startTime: equipmentAllocation.startTime,
          endTime: equipmentAllocation.endTime,
        });
      } catch (err) {
        const api = err?.response?.data;
        const message = api?.message || err?.message || 'Equipment allocation failed';
        const hint = api?.data?.nextAvailableAt ? `\nAvailable after ${formatDateTime(api.data.nextAvailableAt)}` : '';
        window.alert(`Resource created, but allocation failed: ${message}${hint}`);
      }
    }

    closeModal();
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
        {modalError ? <div className="notice">{modalError}</div> : null}
        <ResourceForm
          mode={mode}
          initialValues={selected}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={loading}
          equipmentOptions={equipmentOptions}
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
                <div className="detail-k">{viewing.type === 'EQUIPMENT' ? 'Quantity' : 'Capacity'}</div>
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

            {viewing.type !== 'EQUIPMENT' ? (
              <>
                <div className="resources-divider" />

                <div className="details-grid">
                  <div className="detail span-2">
                    <div className="detail-k">Equipment Allocation</div>
                    <div className="detail-v">
                      Default in every hall: 1 projector + built-in speakers. Use this section to allocate extra
                      equipment with quantities and a time window.
                    </div>
                  </div>

                  <div className="detail span-2">
                    {allocError ? <div className="notice">{allocError}</div> : null}
                    {allocLoading ? <div className="notice">Loading allocations…</div> : null}

                    <form onSubmit={handleAllocateEquipment} className="resource-form">
                      <div className="form-grid">
                        <div className="span-2">
                          <label className="label">Search equipment</label>
                          <input
                            className="input"
                            value={allocSearch}
                            onChange={(e) => setAllocSearch(e.target.value)}
                            placeholder="Type to search by name or location…"
                          />
                        </div>

                        <div>
                          <label className="label">Equipment</label>
                          <select
                            className="select"
                            value={allocForm.equipmentId}
                            onChange={(e) => setAllocForm((p) => ({ ...p, equipmentId: e.target.value }))}
                            required
                          >
                            <option value="" disabled>
                              Select…
                            </option>
                            {filteredEquipmentOptions.map((eq) => (
                              <option key={eq.id} value={eq.id}>
                                {eq.name} (qty {eq.capacity ?? 0})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="label">Quantity</label>
                          <input
                            className="input"
                            type="number"
                            min={1}
                            max={selectedAllocEquipment?.capacity ?? undefined}
                            value={allocForm.quantity}
                            onChange={(e) => setAllocForm((p) => ({ ...p, quantity: e.target.value }))}
                            required
                          />
                        </div>

                        <div>
                          <label className="label">Start</label>
                          <input
                            className="input"
                            type="datetime-local"
                            value={allocForm.startTime}
                            onChange={(e) => setAllocForm((p) => ({ ...p, startTime: e.target.value }))}
                            required
                          />
                        </div>

                        <div>
                          <label className="label">End</label>
                          <input
                            className="input"
                            type="datetime-local"
                            value={allocForm.endTime}
                            onChange={(e) => setAllocForm((p) => ({ ...p, endTime: e.target.value }))}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-footer">
                        <button className="btn btn-primary" type="submit" disabled={loading || allocLoading}>
                          Allocate
                        </button>
                      </div>
                    </form>

                    {availabilityLoading ? <div className="notice">Checking availability…</div> : null}
                    {allocAvailability ? (
                      <div className="notice">
                        Available: {allocAvailability.availableQuantity} of {allocAvailability.totalQuantity}{' '}
                        (peak allocated: {allocAvailability.allocatedQuantity}).
                        {Number(allocForm.quantity) > Number(allocAvailability.availableQuantity)
                          ? ` Not enough for requested quantity.`
                          : ''}
                        {allocAvailability.nextAvailableAt
                          ? ` Next release: ${formatDateTime(allocAvailability.nextAvailableAt)}.`
                          : ''}
                      </div>
                    ) : null}

                    <div className="resources-divider" />

                    <div className="detail-k">Current Allocations</div>
                    {allocations.length === 0 ? (
                      <div className="detail-v">—</div>
                    ) : (
                      <div className="details-grid">
                        {allocations.map((a) => (
                          <div key={a.id} className="detail span-2">
                            <div className="detail-k">{a.equipmentName}</div>
                            <div className="detail-v">
                              Qty {a.quantity} • {formatDateTime(a.startTime)} → {formatDateTime(a.endTime)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : null}

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
