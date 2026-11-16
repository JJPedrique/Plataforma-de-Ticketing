import { apiRequest } from './http';

export const usersApi = {
  list: () => apiRequest('/Users'),
  get: (id) => apiRequest(`/Users/${id}`),
  create: (data) => apiRequest('/Users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/Users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiRequest(`/Users/${id}`, { method: 'DELETE' }),
};

export const venuesApi = {
  list: () => apiRequest('/Venues'),
  get: (id) => apiRequest(`/Venues/${id}`),
  create: (data) => apiRequest('/Venues', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/Venues/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiRequest(`/Venues/${id}`, { method: 'DELETE' }),
};

export const payMethodsApi = {
  list: () => apiRequest('/PayMethods'),
  get: (id) => apiRequest(`/PayMethods/${id}`),
  create: (data) => apiRequest('/PayMethods', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/PayMethods/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiRequest(`/PayMethods/${id}`, { method: 'DELETE' }),
};

export const eventsApi = {
  list: () => apiRequest('/Events'),
  get: (id) => apiRequest(`/Events/${id}`),
  create: (data) => apiRequest('/Events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/Events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiRequest(`/Events/${id}`, { method: 'DELETE' }),
};
