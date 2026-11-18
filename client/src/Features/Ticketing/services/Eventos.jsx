import axiosClient from '../../../core/api/axiosClient';

export const eventService = {
  getAll: (params) => axiosClient.get('/EventsVenues', { params }),
  getById: (id) => axiosClient.get(`/Events/${id}`),
  create: (eventData) => axiosClient.post('/Events', eventData),
  update: (id, eventData) => axiosClient.put(`/Events/${id}`, eventData),
  delete: (id) => axiosClient.delete(`/Events/${id}`),
};