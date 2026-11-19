import axiosClient from '../../../core/api/axiosClient';

export const HistoryService = {
  getAllById: (id) => axiosClient.get(`/Orders/${id}/purchases`),
};
