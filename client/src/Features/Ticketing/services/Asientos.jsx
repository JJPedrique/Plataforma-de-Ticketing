import { BDD } from "../../../Data/Mock_v2";
import axiosClient from '../../../core/api/axiosClient';

export const zoneService = {
  getAll: (params) => axiosClient.get('/ZonesPrices', { params }),
  getById: (id) => axiosClient.get(`/Zones/${id}`),
  create: (eventData) => axiosClient.post('/Zones', eventData),
  update: (id, eventData) => axiosClient.put(`/Zones/${id}`, eventData),
  delete: (id) => axiosClient.delete(`/Zones/${id}`),
};



export function GetSeatsById(eventId) {
    // 1. Buscar el evento por su ID
    const event = BDD.events.find(e => e.id === eventId);
    if (!event) return null; // Retorna null si el evento no existe

    // 2. Buscar el venue asociado al evento
    const venue = BDD.venues.find(v => v.id === event.venue_id);
    if (!venue) return null;

    // 3. Retornar el venue construyendo sus zonas y sillas
    return {
        ...venue,
        zones: BDD.zones
            .filter(zone => zone.venue_id === venue.id)
            .map(zone => ({
                ...zone,
                price: BDD.eventsPricing.find(price => price.zone_id == zone.id).price,
                seats: BDD.seats.filter(seat => seat.zone_id === zone.id)
            }))
    };
}

export function GetReservedSeats(eventId) {
  // 1. Obtener todos los tickets asociados al evento X
  const eventTickets = BDD.tickets.filter(ticket => ticket.event_id === eventId);

  // 2. Filtrar los tickets cuyas órdenes estén "pending" o "completed"
  const validTickets = eventTickets.filter(ticket => {
    const order = BDD.orders.find(o => o.id === ticket.order_id);
    return order && (order.status === 'pending' || order.status === 'completed');
  });

  // 3. Mapear los tickets válidos para obtener la información de las sillas
  const reservedSeats = validTickets
    .map(ticket => BDD.seats.find(seat => seat.id === ticket.seat_id))
    .filter(seat => seat !== undefined); // Elimina posibles nulos si hay inconsistencias en los mocks

  return reservedSeats;
}