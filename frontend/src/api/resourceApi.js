import axios from 'axios';

const client = axios.create({
  baseURL:
    (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
    (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE_URL) ||
    '',
});

function unwrapApiResponse(response) {
  // Backend uses ApiResponse<T> { success, message, data }
  if (response && response.data && Object.prototype.hasOwnProperty.call(response.data, 'data')) {
    return response.data.data;
  }
  return response.data;
}

export async function getResources() {
  const res = await client.get('/api/resources');
  return unwrapApiResponse(res);
}

export async function getResourceById(id) {
  const res = await client.get(`/api/resources/${id}`);
  return unwrapApiResponse(res);
}

export async function createResource(payload) {
  const res = await client.post('/api/resources', payload);
  return unwrapApiResponse(res);
}

export async function updateResource(id, payload) {
  const res = await client.put(`/api/resources/${id}`, payload);
  return unwrapApiResponse(res);
}

export async function deleteResource(id) {
  const res = await client.delete(`/api/resources/${id}`);
  return unwrapApiResponse(res);
}

export async function searchResources(filters) {
  const res = await client.get('/api/resources/search', {
    params: filters,
  });
  return unwrapApiResponse(res);
}
