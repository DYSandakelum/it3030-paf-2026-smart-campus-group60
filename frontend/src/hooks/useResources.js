import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createResource,
  deleteResource,
  getResources,
  searchResources,
  updateResource,
} from '../api/resourceApi';

function normalizeFilters(filters) {
  const next = { ...filters };

  Object.keys(next).forEach((key) => {
    const value = next[key];
    if (value === '' || value === undefined) {
      delete next[key];
    }
  });

  return next;
}

export default function useResources(initialFilters) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(
    initialFilters || { type: '', capacity: '', location: '', status: '' }
  );

  const effectiveFilters = useMemo(() => normalizeFilters(filters), [filters]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const hasFilters = Object.keys(effectiveFilters).length > 0;
      const data = hasFilters ? await searchResources(effectiveFilters) : await getResources();
      setResources(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  }, [effectiveFilters]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      await createResource(payload);
      await refresh();
      return true;
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to create resource');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const update = useCallback(async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      await updateResource(id, payload);
      await refresh();
      return true;
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to update resource');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const remove = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteResource(id);
      await refresh();
      return true;
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to delete resource');
      return false;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  return {
    resources,
    loading,
    error,
    filters,
    setFilters,
    refresh,
    create,
    update,
    remove,
  };
}
