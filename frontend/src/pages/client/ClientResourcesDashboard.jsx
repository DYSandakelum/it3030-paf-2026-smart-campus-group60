import React, { useEffect, useMemo, useState } from 'react';
import useResources from '../../hooks/useResources';
import ResourceFilter from '../../components/resource/ResourceFilter';
import ResourceModal from '../../components/resource/ResourceModal';
import ResourceTable from '../../components/resource/ResourceTable';
import ResourceCard from '../../components/resource/ResourceCard';
import { listHallEquipmentAllocations } from '../../api/equipmentAllocationApi';
import '../../styles/resource.css';

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString();
}

export default function ClientResourcesDashboard() {
  const { resources, loading, error, filters, setFilters } = useResources();

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [allocations, setAllocations] = useState([]);
  const [allocLoading, setAllocLoading] = useState(false);
  const [allocError, setAllocError] = useState('');

  const stats = useMemo(() => {
    const total = resources.length;
    const spaces = resources.filter((r) => r.type !== 'EQUIPMENT').length;
    const equipment = resources.filter((r) => r.type === 'EQUIPMENT').length;
    const active = resources.filter((r) => r.status === 'ACTIVE').length;
    return { total, spaces, equipment, active };
  }, [resources]);

  function openView(resource) {
    setViewing(resource);
    setIsViewOpen(true);
  }

  function closeView() {
    setIsViewOpen(false);
  }

  function clearFilters() {
    setFilters({ type: '', capacity: '', location: '', status: '' });
  }

  useEffect(() => {
    if (!isViewOpen || !viewing || viewing.type === 'EQUIPMENT') return undefined;

    let cancelled = false;

    async function fetchAllocations(showLoading) {
      if (cancelled) return;
      setAllocError('');
      if (showLoading) setAllocLoading(true);

      try {
        const data = await listHallEquipmentAllocations(viewing.id);
        if (!cancelled) {
          setAllocations(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        if (!cancelled) setAllocError('Failed to load equipment allocations');
      } finally {
        if (!cancelled && showLoading) setAllocLoading(false);
      }
    }

    fetchAllocations(true);
    const interval = window.setInterval(() => fetchAllocations(false), 8000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [isViewOpen, viewing?.id, viewing?.type]);

  return (
    <div className="resources-page client-resources-page">
      <div className="client-hero">
        <div className="resources-kicker">SMART CAMPUS • CLIENT PORTAL</div>
        <div className="resources-header-row">
          <div>
            <div className="resources-title">Resource Dashboard</div>
            <div className="resources-subtitle">
              Browse campus spaces and equipment allocations in real time. This dashboard is read-only,
              designed for quick visibility and planning.
            </div>
          </div>
        </div>

        <div className="client-stats-grid">
          <div className="client-stat-card">
            <div className="detail-k">Total Resources</div>
            <div className="client-stat-value">{stats.total}</div>
          </div>
          <div className="client-stat-card">
            <div className="detail-k">Campus Spaces</div>
            <div className="client-stat-value">{stats.spaces}</div>
          </div>
          <div className="client-stat-card">
            <div className="detail-k">Equipment Items</div>
            <div className="client-stat-value">{stats.equipment}</div>
          </div>
          <div className="client-stat-card">
            <div className="detail-k">Active Now</div>
            <div className="client-stat-value">{stats.active}</div>
          </div>
        </div>
      </div>

      <div className="resources-divider" />

      {error ? <div className="notice">{error}</div> : null}

      <ResourceFilter filters={filters} onChange={setFilters} onClear={clearFilters} disabled={loading} />

      {loading ? <div className="notice">Loading resources…</div> : null}

      <ResourceTable resources={resources} onView={openView} />

      <div className="cards">
        {resources.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} onView={openView} />
        ))}
      </div>

      <ResourceModal isOpen={isViewOpen} title="Resource Snapshot" onClose={closeView}>
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
                <div className="detail-k">Status</div>
                <div className="detail-v">{viewing.status || '—'}</div>
              </div>

              <div className="detail span-2">
                <div className="detail-k">Description</div>
                <div className="detail-v">{viewing.description || '—'}</div>
              </div>
            </div>

            {viewing.type !== 'EQUIPMENT' ? (
              <>
                <div className="resources-divider" />
                <div>
                  <div className="detail-k">Allocated Equipment</div>
                  <div className="detail-v" style={{ marginTop: 8 }}>
                    Projector and speakers are available by default in every hall. Additional allocations are listed below.
                  </div>

                  {allocError ? <div className="notice">{allocError}</div> : null}
                  {allocLoading ? <div className="notice">Loading allocations…</div> : null}

                  {allocations.length === 0 && !allocLoading ? (
                    <div className="notice">No extra equipment allocations in this time frame.</div>
                  ) : null}

                  {allocations.length > 0 ? (
                    <div className="details-grid" style={{ marginTop: 12 }}>
                      {allocations.map((a) => (
                        <div key={a.id} className="detail span-2">
                          <div className="detail-k">{a.equipmentName}</div>
                          <div className="detail-v">
                            Qty {a.quantity} • {formatDateTime(a.startTime)} → {formatDateTime(a.endTime)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}

            <div className="form-footer">
              <button className="btn btn-primary" type="button" onClick={closeView}>
                Close
              </button>
            </div>
          </div>
        ) : null}
      </ResourceModal>
    </div>
  );
}
