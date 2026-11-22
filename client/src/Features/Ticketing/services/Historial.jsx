import axiosClient from '../../../core/api/axiosClient';

export const HistoryService = {
  getAllById: (id) => axiosClient.get(`/Orders/${id}/purchases`),
  getOrderById: (user_id,order_id) => axiosClient.get(`/Orders/${user_id}/purchases/${order_id}`),
};
