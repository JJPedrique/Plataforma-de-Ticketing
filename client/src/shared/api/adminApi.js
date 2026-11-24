import { apiRequest } from './http';

const withActingUser = (path, actingUserId) =>
  actingUserId == null
    ? path
    : `${path}${path.includes('?') ? '&' : '?'}acting_user_id=${encodeURIComponent(actingUserId)}`;

export const usersApi = {
  list: () => apiRequest('/Users'),
  get: (id) => apiRequest(`/Users/${id}`),
  create: (data) => apiRequest('/Users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data, actingUserId) => apiRequest(withActingUser(`/Users/${id}`, actingUserId), {
    method: 'PUT', body: JSON.stringify(data),
  }),
  remove: (id, actingUserId) => apiRequest(withActingUser(`/Users/${id}`, actingUserId), {
    method: 'DELETE',
  }),
};

export const venuesApi = {
  list: () => apiRequest('/Venues'),
  get: (id) => apiRequest(`/Venues/${id}`),
  create: (data) => apiRequest('/Venues', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/Venues/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiRequest(`/Venues/${id}`, { method: 'DELETE' }),
};

export const payMethodsApi = {
  list: ({ includeInactive = false } = {}) => apiRequest(`/PayMethods${includeInactive ? '?include_inactive=true' : ''}`),
  get: (id) => apiRequest(`/PayMethods/${id}`),
  setStatus: (id, isActive) => apiRequest(`/PayMethods/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ is_active: isActive }),
  }),
};

export const eventsApi = {
  list: () => apiRequest('/Events'),
  get: (id) => apiRequest(`/Events/${id}`),
  create: (data) => apiRequest('/Events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/Events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiRequest(`/Events/${id}`, { method: 'DELETE' }),
};

export const zonesApi = {
  list: (venueId) => apiRequest(`/Zones${venueId ? `?venue_id=${venueId}` : ''}`),
  get: (id) => apiRequest(`/Zones/${id}`),
  create: (data) => apiRequest('/Zones', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/Zones/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiRequest(`/Zones/${id}`, { method: 'DELETE' }),
};

export const eventPricingsApi = {
  list: (eventId) => apiRequest(`/EventPricings${eventId ? `?event_id=${eventId}` : ''}`),
  get: (id) => apiRequest(`/EventPricings/${id}`),
  create: (data) => apiRequest('/EventPricings', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/EventPricings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiRequest(`/EventPricings/${id}`, { method: 'DELETE' }),
};

export const eventZonePricesApi = {
  list: (eventId) => apiRequest(`/EventZonePrices${eventId ? `?event_id=${eventId}` : ''}`),
  create: (data) => apiRequest('/EventZonePrices', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/EventZonePrices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiRequest(`/EventZonePrices/${id}`, { method: 'DELETE' }),
};
