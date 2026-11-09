import { CreditCard, Wallet, Building2, Coins } from 'lucide-react';

export const seedData = {
  users: [
    { id: 1, name: "Alice Admin", email: "alice@example.com", password_hash: "hash_123", role: "admin", created_at: "2026-01-10T08:00:00Z" },
    { id: 2, name: "Bob Operator", email: "bob@example.com", password_hash: "hash_123", role: "admin", created_at: "2026-01-11T09:15:00Z" },
    { id: 3, name: "Charlie User", email: "charlie@example.com", password_hash: "hash_123", role: "client", created_at: "2026-01-12T10:30:00Z" },
    { id: 4, name: "Diana User", email: "diana@example.com", password_hash: "hash_123", role: "client", created_at: "2026-01-13T11:45:00Z" },
    { id: 5, name: "Eve User", email: "eve@example.com", password_hash: "hash_123", role: "client", created_at: "2026-01-14T14:20:00Z" },
    { id: 6, name: "Frank User", email: "frank@example.com", password_hash: "hash_123", role: "client", created_at: "2026-01-15T16:10:00Z" },
    { id: 7, name: "Grace User", email: "grace@example.com", password_hash: "hash_123", role: "client", created_at: "2026-01-16T18:05:00Z" },
    { id: 8, name: "Heidi User", email: "heidi@example.com", password_hash: "hash_123", role: "client", created_at: "2026-01-17T19:50:00Z" },
    { id: 9, name: "Ivan User", email: "ivan@example.com", password_hash: "hash_123", role: "client", created_at: "2026-01-18T21:30:00Z" },
    { id: 10, name: "Judy User", email: "judy@example.com", password_hash: "hash_123", role: "client", created_at: "2026-01-19T23:15:00Z" }
  ],
  venues: [
    { id: 1, name: "Estadio Nacional", location: "Capital City", svg_layout_url: "/maps/estadio_nacional.svg" },
    { id: 2, name: "Teatro Principal", location: "Downtown", svg_layout_url: "/maps/teatro_principal.svg" },
    { id: 3, name: "Arena Monterrey", location: "North District", svg_layout_url: "/maps/arena_mty.svg" },
    { id: 4, name: "Foro Sol", location: "East Side", svg_layout_url: "/maps/foro_sol.svg" },
    { id: 5, name: "Auditorio Cívico", location: "West Side", svg_layout_url: "/maps/auditorio_civico.svg" },
    { id: 6, name: "Palacio de los Deportes", location: "South District", svg_layout_url: "/maps/palacio.svg" },
    { id: 7, name: "Centro de Convenciones", location: "Business Park", svg_layout_url: "/maps/convenciones.svg" },
    { id: 8, name: "Teatro al Aire Libre", location: "City Park", svg_layout_url: "/maps/aire_libre.svg" },
    { id: 9, name: "Cineplex Premier", location: "Mall Avenue", svg_layout_url: "/maps/cineplex.svg" },
    { id: 10, name: "Sala Sinfónica", location: "Arts District", svg_layout_url: "/maps/sinfonica.svg" }
  ],
  sections: [
    { id: 1, venue_id: 1, name: "VIP Centro", capacity: 500 },
    { id: 2, venue_id: 2, name: "Platea Baja", capacity: 300 },
    { id: 3, venue_id: 3, name: "Grada Norte", capacity: 1500 },
    { id: 4, venue_id: 4, name: "General de Pie", capacity: 5000 },
    { id: 5, venue_id: 5, name: "Balcón 1", capacity: 200 },
    { id: 6, venue_id: 6, name: "Anillo Inferior", capacity: 2500 },
    { id: 7, venue_id: 7, name: "Sala A", capacity: 800 },
    { id: 8, venue_id: 8, name: "Jardín Central", capacity: 1000 },
    { id: 9, venue_id: 9, name: "Sala IMAX", capacity: 400 },
    { id: 10, venue_id: 10, name: "Palcos VIP", capacity: 50 }
  ],
  physical_seats: [
    { id: 1, section_id: 1, row_identifier: "A", seat_number: "1", svg_element_id: "sec1-rowA-s1" },
    { id: 2, section_id: 2, row_identifier: "B", seat_number: "12", svg_element_id: "sec2-rowB-s12" },
    { id: 3, section_id: 3, row_identifier: "C", seat_number: "33", svg_element_id: "sec3-rowC-s33" },
    { id: 4, section_id: 4, row_identifier: "GEN", seat_number: "001", svg_element_id: "sec4-gen-001" },
    { id: 5, section_id: 5, row_identifier: "D", seat_number: "5", svg_element_id: "sec5-rowD-s5" },
    { id: 6, section_id: 6, row_identifier: "E", seat_number: "8", svg_element_id: "sec6-rowE-s8" },
    { id: 7, section_id: 7, row_identifier: "F", seat_number: "10", svg_element_id: "sec7-rowF-s10" },
    { id: 8, section_id: 8, row_identifier: "G", seat_number: "15", svg_element_id: "sec8-rowG-s15" },
    { id: 9, section_id: 9, row_identifier: "H", seat_number: "20", svg_element_id: "sec9-rowH-s20" },
    { id: 10, section_id: 10, row_identifier: "I", seat_number: "2", svg_element_id: "sec10-rowI-s2" }
  ],
  events: [
    { id: 1, venue_id: 1, title: "Final de Campeonato", description: "Fútbol Primera División", event_date: "2026-11-20T20:00:00Z", is_active: true },
    { id: 2, venue_id: 2, title: "El Fantasma de la Ópera", description: "Musical clásico", event_date: "2026-12-05T19:30:00Z", is_active: true },
    { id: 3, venue_id: 3, title: "Rock Fest 2026", description: "Festival de rock internacional", event_date: "2026-11-15T16:00:00Z", is_active: true },
    { id: 4, venue_id: 4, title: "Concierto Pop", description: "Gira mundial artista pop", event_date: "2026-10-31T21:00:00Z", is_active: true },
    { id: 5, venue_id: 5, title: "Orquesta Nacional", description: "Sinfonía de Beethoven", event_date: "2026-11-10T18:00:00Z", is_active: true },
    { id: 6, venue_id: 6, title: "Torneo de eSports", description: "Final regional", event_date: "2026-12-12T14:00:00Z", is_active: true },
    { id: 7, venue_id: 7, title: "Expo Tecnología", description: "Conferencia de IA y Desarrollo", event_date: "2026-11-25T09:00:00Z", is_active: true },
    { id: 8, venue_id: 8, title: "Cine al Aire Libre", description: "Clásicos del cine", event_date: "2026-10-28T20:00:00Z", is_active: true },
    { id: 9, venue_id: 9, title: "Premiere Película", description: "Estreno de ciencia ficción", event_date: "2026-11-01T22:00:00Z", is_active: true },
    { id: 10, venue_id: 10, title: "Gala Benéfica", description: "Recaudación de fondos anual", event_date: "2026-12-20T19:00:00Z", is_active: true }
  ],
  event_seats: [
    { id: 1, event_id: 1, physical_seat_id: 1, price: 150.00, status: "SOLD", locked_until: null, version: 1 },
    { id: 2, event_id: 2, physical_seat_id: 2, price: 80.50, status: "RESERVED", locked_until: "2026-10-25T10:15:00Z", version: 2 },
    { id: 3, event_id: 3, physical_seat_id: 3, price: 120.00, status: "AVAILABLE", locked_until: null, version: 1 },
    { id: 4, event_id: 4, physical_seat_id: 4, price: 50.00, status: "SOLD", locked_until: null, version: 1 },
    { id: 5, event_id: 5, physical_seat_id: 5, price: 65.00, status: "AVAILABLE", locked_until: null, version: 1 },
    { id: 6, event_id: 6, physical_seat_id: 6, price: 90.00, status: "SOLD", locked_until: null, version: 1 },
    { id: 7, event_id: 7, physical_seat_id: 7, price: 40.00, status: "AVAILABLE", locked_until: null, version: 1 },
    { id: 8, event_id: 8, physical_seat_id: 8, price: 25.00, status: "SOLD", locked_until: null, version: 1 },
    { id: 9, event_id: 9, physical_seat_id: 9, price: 15.00, status: "AVAILABLE", locked_until: null, version: 1 },
    { id: 10, event_id: 10, physical_seat_id: 10, price: 250.00, status: "RESERVED", locked_until: "2026-10-25T10:20:00Z", version: 3 }
  ],
  reservations: [
    { id: 1, user_id: 1, event_id: 1, total_amount: 150.00, status: "PAID", created_at: "2026-10-01T10:00:00Z", expires_at: "2026-10-01T10:15:00Z" },
    { id: 2, user_id: 2, event_id: 2, total_amount: 80.50, status: "PENDING", created_at: "2026-10-25T10:00:00Z", expires_at: "2026-10-25T10:15:00Z" },
    { id: 3, user_id: 3, event_id: 3, total_amount: 120.00, status: "CANCELLED", created_at: "2026-09-15T14:00:00Z", expires_at: "2026-09-15T14:15:00Z" },
    { id: 4, user_id: 4, event_id: 4, total_amount: 50.00, status: "PAID", created_at: "2026-10-05T11:30:00Z", expires_at: "2026-10-05T11:45:00Z" },
    { id: 5, user_id: 5, event_id: 5, total_amount: 65.00, status: "EXPIRED", created_at: "2026-10-10T16:00:00Z", expires_at: "2026-10-10T16:15:00Z" },
    { id: 6, user_id: 6, event_id: 6, total_amount: 90.00, status: "PAID", created_at: "2026-10-12T09:20:00Z", expires_at: "2026-10-12T09:35:00Z" },
    { id: 7, user_id: 7, event_id: 7, total_amount: 40.00, status: "EXPIRED", created_at: "2026-10-14T13:45:00Z", expires_at: "2026-10-14T14:00:00Z" },
    { id: 8, user_id: 8, event_id: 8, total_amount: 25.00, status: "PAID", created_at: "2026-10-20T18:10:00Z", expires_at: "2026-10-20T18:25:00Z" },
    { id: 9, user_id: 9, event_id: 9, total_amount: 15.00, status: "CANCELLED", created_at: "2026-10-22T21:00:00Z", expires_at: "2026-10-22T21:15:00Z" },
    { id: 10, user_id: 10, event_id: 10, total_amount: 250.00, status: "PENDING", created_at: "2026-10-25T10:05:00Z", expires_at: "2026-10-25T10:20:00Z" }
  ],
  reservation_items: [
    { id: 1, reservation_id: 1, event_seat_id: 1 },
    { id: 2, reservation_id: 2, event_seat_id: 2 },
    { id: 3, reservation_id: 3, event_seat_id: 3 },
    { id: 4, reservation_id: 4, event_seat_id: 4 },
    { id: 5, reservation_id: 5, event_seat_id: 5 },
    { id: 6, reservation_id: 6, event_seat_id: 6 },
    { id: 7, reservation_id: 7, event_seat_id: 7 },
    { id: 8, reservation_id: 8, event_seat_id: 8 },
    { id: 9, reservation_id: 9, event_seat_id: 9 },
    { id: 10, reservation_id: 10, event_seat_id: 10 }
  ],
  metodosPago: [
  { id: 'tarjeta', nombre: 'Tarjeta de crédito/débito', icon: CreditCard, descripcion: 'Visa, Mastercard, American Express' },
  { id: 'zelle', nombre: 'Zelle', icon: Wallet, descripcion: 'Transferencia inmediata' },
  { id: 'pagomovil', nombre: 'Pago Móvil', icon: Building2, descripcion: 'Banco venezolano' },
  { id: 'binance', nombre: 'Binance Pay', icon: Coins, descripcion: 'Criptomonedas' },
  { id: 'paypal', nombre: 'PayPal', icon: Wallet, descripcion: 'Cuenta PayPal o saldo' },
  ]
};

export const seedData2 = {
  
};