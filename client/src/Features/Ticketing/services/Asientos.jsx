import { BDD } from "../../../Data/Mock_v2";

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
                seats: BDD.seats.filter(seat => seat.zone_id === zone.id)
            }))
    };
}