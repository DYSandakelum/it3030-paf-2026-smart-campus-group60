import axios from 'axios';
import { applyBasicAuth } from '../services/basicAuth';

const client = axios.create({
  baseURL:
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
    'http://localhost:8081',
});

client.interceptors.request.use(
  (config) => {
    return applyBasicAuth(config);
  },
  (error) => Promise.reject(error)
);

function unwrapApiResponse(response) {
  if (response && response.data && Object.prototype.hasOwnProperty.call(response.data, 'data')) {
    return response.data.data;
  }
  return response.data;
}

export async function listHallEquipmentAllocations(hallId) {
  const res = await client.get(`/api/equipment-allocations/hall/${hallId}`);
  return unwrapApiResponse(res);
}

export async function getEquipmentAvailability({ equipmentId, startTime, endTime }) {
  const res = await client.get('/api/equipment-allocations/availability', {
    params: { equipmentId, startTime, endTime },
  });
  return unwrapApiResponse(res);
}

export async function createEquipmentAllocation(payload) {
  const res = await client.post('/api/equipment-allocations', payload);
  return unwrapApiResponse(res);
}

export async function deleteEquipmentAllocation(allocationId) {
  const res = await client.delete(`/api/equipment-allocations/${allocationId}`);
  return unwrapApiResponse(res);
}
