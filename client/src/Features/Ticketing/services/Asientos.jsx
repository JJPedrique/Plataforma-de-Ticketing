import axiosClient from '../../../core/api/axiosClient';

export const zoneService = {
  getAll: (params) => axiosClient.get('/ZonesPrices', { params }),
  getById: (id) => axiosClient.get(`/Zones/${id}`),
  create: (eventData) => axiosClient.post('/Zones', eventData),
  update: (id, eventData) => axiosClient.put(`/Zones/${id}`, eventData),
  delete: (id) => axiosClient.delete(`/Zones/${id}`),
};


export const ticketService = {
  getAll: (params) => axiosClient.get('/Tickets', { params }),
  getById: (id) => axiosClient.get(`/Tickets/${id}`),
  create: (eventData) => axiosClient.post('/Ticket', eventData),
  update: (id, eventData) => axiosClient.put(`/Tickets/${id}`, eventData),

  delete: (id) => axiosClient.delete(`/Tickets/${id}`),
  reservar: (seat) => axiosClient.post('BookTicket', seat),
};