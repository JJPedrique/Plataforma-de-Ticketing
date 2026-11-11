const generateMockDB = () => {
  const users = [];
  const roles = ['admin', 'organizer', 'customer'];
  let userId = 1;

  // 3 usuarios de cada rol
  roles.forEach((role) => {
    for (let i = 1; i <= 3; i++) {
      users.push({
        id: userId,
        role: role,
        first_name: `Usuario${userId}`,
        last_name: `Prueba${userId}`,
        email: `${role}${i}@ejemplo.com`,
        password_hash: 'hashed_password_123',
        created_at: new Date().toISOString(),
        is_Active: true 
      });
      userId++;
    }
  });

  const venues = [];
  // 1 Lugar por evento (3 lugares en total)
  for (let i = 1; i <= 3; i++) {
    venues.push({
      id: i,
      name: `Lugar de Eventos ${i}`,
      address: `Avenida Principal ${i}`,
      city: 'Maracaibo',
      img_url: `https://midominio.com/layouts/venue_${i}.png`,
      is_Active: true 
    });
  }

  const events = [];
  // 3 eventos
  for (let i = 1; i <= 3; i++) {
    events.push({
      id: i,
      organizer_id: i + 3, // Asigna los IDs 4, 5 y 6 (organizers)
      venue_id: i, // 1 Lugar por evento
      title: `Gran Evento ${i}`,
      description: `Descripción detallada para el evento ${i}`,
      start_date: new Date(Date.now() + 86400000 * i).toISOString(),
      end_date: new Date(Date.now() + 86400000 * i + 10800000).toISOString(),
      is_Active: true 
    });
  }

  const zones = [];
  const zoneNames = ['Zona 1', 'Zona 2', 'Zona 3'];
  const zoneColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
  let zoneId = 1;

  // 3 Zonas por lugar
  venues.forEach((venue) => {
    for (let z = 0; z < 3; z++) {
      zones.push({
        id: zoneId++,
        venue_id: venue.id,
        name: zoneNames[z],
        color_code: zoneColors[z],
        is_Active: true 
      });
    }
  });

  const eventsPricing = [];
  const prices = [100.0, 50.0, 25.0];
  let pricingId = 1;

  // Zona 1 a 100$, Zona 2 a 50$, Zona 3 a 25$
  events.forEach((event) => {
    // Filtramos las zonas que pertenecen al lugar de este evento
    const venueZones = zones.filter((z) => z.venue_id === event.venue_id);
    venueZones.forEach((zone, index) => {
      eventsPricing.push({
        id: pricingId++,
        event_id: event.id,
        zone_id: zone.id,
        price: prices[index]
      });
    });
  });

  const seats = [];
  let seatId = 1;

  // 25x10 sillas por zona (10 filas de 25 asientos = 250 asientos por zona)
  zones.forEach((zone) => {
    for (let row = 0; row < 10; row++) {
      const rowLabel = String.fromCharCode(65 + row); // Filas de la A a la J
      for (let num = 1; num <= 25; num++) {
        seats.push({
          id: seatId++,
          zone_id: zone.id,
          row_label: rowLabel,
          seat_number: num.toString(),
          coord_x: num,
          coord_y: row,
          is_Active: true 
        });
      }
    }
  });

  // Los IDs de los métodos de pago pasan a ser enteros para cumplir con el 'serial'
  const payMethods = [
    { id: 1, name: 'Tarjetas de Crédito y Débito', description: 'Visa, Mastercard, American Express', is_Active: true },
    { id: 2, name: 'Criptomonedas y Monedas Estables (Stablecoins)', description: 'Binance Pay o similares', is_Active: true },
    { id: 3, name: 'Monederos Digitales y Billeteras (e-Wallets)', description: 'Cuenta PayPal o saldo', is_Active: true },
  ];

  return {
    users, events, eventsPricing, venues, zones, seats, payMethods,
    orders: [], // Vacío según el requerimiento
    tickets: [], // Vacío según el requerimiento
  };
};

export const BDD = generateMockDB();