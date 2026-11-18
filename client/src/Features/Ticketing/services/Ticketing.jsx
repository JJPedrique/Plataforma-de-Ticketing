import axiosClient from '../../../core/api/axiosClient';

export const ticketingService = {
  getAll: (params) => axiosClient.get('/Orders', { params }),
  getById: (id) => axiosClient.get(`/Orders/${id}`),
  create: (eventData) => axiosClient.post('/Orders', eventData),
  update: (id, eventData) => axiosClient.put(`/Orders/${id}`, eventData),
  delete: (id) => axiosClient.delete(`/Orders/${id}`),
};
