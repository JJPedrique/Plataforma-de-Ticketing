-- Usuarios (3 Admins, 3 Organizers, 3 Users)
-- Nota: el enum role_type del modelo usa valores 'admin', 'organizer', 'user'
INSERT INTO users (id, role, first_name, last_name, email, password_hash, created_at, is_active) VALUES
(1, 'ADMIN', 'Usuario1', 'Prueba1', 'admin1@ejemplo.com', 'hashed_password_123', CURRENT_TIMESTAMP, true),
(2, 'ADMIN', 'Usuario2', 'Prueba2', 'admin2@ejemplo.com', 'hashed_password_123', CURRENT_TIMESTAMP, true),
(3, 'ADMIN', 'Usuario3', 'Prueba3', 'admin3@ejemplo.com', 'hashed_password_123', CURRENT_TIMESTAMP, true),
(4, 'ORGANIZER', 'Usuario4', 'Prueba4', 'organizer1@ejemplo.com', 'hashed_password_123', CURRENT_TIMESTAMP, true),
(5, 'ORGANIZER', 'Usuario5', 'Prueba5', 'organizer2@ejemplo.com', 'hashed_password_123', CURRENT_TIMESTAMP, true),
(6, 'ORGANIZER', 'Usuario6', 'Prueba6', 'organizer3@ejemplo.com', 'hashed_password_123', CURRENT_TIMESTAMP, true),
(7, 'USER', 'Usuario7', 'Prueba7', 'customer1@ejemplo.com', 'hashed_password_123', CURRENT_TIMESTAMP, true),
(8, 'USER', 'Usuario8', 'Prueba8', 'customer2@ejemplo.com', 'hashed_password_123', CURRENT_TIMESTAMP, true),
(9, 'USER', 'Usuario9', 'Prueba9', 'customer3@ejemplo.com', 'hashed_password_123', CURRENT_TIMESTAMP, true);

-- Lugares
INSERT INTO venues (id, name, address, city, img_url, is_active) VALUES
(1, 'Lugar de Eventos 1', 'Avenida Principal 1', 'Maracaibo', 'https://midominio.com/layouts/venue_1.png', true),
(2, 'Lugar de Eventos 2', 'Avenida Principal 2', 'Maracaibo', 'https://midominio.com/layouts/venue_2.png', true),
(3, 'Lugar de Eventos 3', 'Avenida Principal 3', 'Maracaibo', 'https://midominio.com/layouts/venue_3.png', true);

-- Eventos (Fechas proyectadas)
INSERT INTO events (id, organizer_id, venue_id, title, description, start_date, end_date, is_active) VALUES
(1, 4, 1, 'Gran Evento 1', 'Descripción detallada para el evento 1', '2026-11-20 18:00:00', '2026-11-20 21:00:00', true),
(2, 5, 2, 'Gran Evento 2', 'Descripción detallada para el evento 2', '2026-11-21 18:00:00', '2026-11-21 21:00:00', true),
(3, 6, 3, 'Gran Evento 3', 'Descripción detallada para el evento 3', '2026-11-22 18:00:00', '2026-11-22 21:00:00', true);

-- Zonas
INSERT INTO zones (id, venue_id, name, color_code, is_active) VALUES
(1, 1, 'Zona 1', '#FFD700', true),
(2, 1, 'Zona 2', '#C0C0C0', true),
(3, 1, 'Zona 3', '#CD7F32', true),
(4, 2, 'Zona 1', '#FFD700', true),
(5, 2, 'Zona 2', '#C0C0C0', true),
(6, 2, 'Zona 3', '#CD7F32', true),
(7, 3, 'Zona 1', '#FFD700', true),
(8, 3, 'Zona 2', '#C0C0C0', true),
(9, 3, 'Zona 3', '#CD7F32', true);

-- Precios por Zona y Evento
INSERT INTO event_pricings (id, event_id, zone_id, price) VALUES
(1, 1, 1, 100.00), (2, 1, 2, 50.00), (3, 1, 3, 25.00),
(4, 2, 4, 100.00), (5, 2, 5, 50.00), (6, 2, 6, 25.00),
(7, 3, 7, 100.00), (8, 3, 8, 50.00), (9, 3, 9, 25.00);

-- Métodos de Pago
INSERT INTO pay_methods (id, name, description, is_active) VALUES
(1, 'Tarjetas de Crédito y Débito', 'Visa, Mastercard, American Express', true),
(2, 'Criptomonedas y Monedas Estables (Stablecoins)', 'Binance Pay o similares', true),
(3, 'Monederos Digitales y Billeteras (e-Wallets)', 'Cuenta PayPal o saldo', true);

-- =======================================================
-- GENERACIÓN DE ASIENTOS (2,250 filas)
-- (Usando un CROSS JOIN universal evitamos miles de líneas)
-- =======================================================
INSERT INTO seats (zone_id, row_label, seat_number, coord_x, coord_y, is_active)
SELECT 
    z.id AS zone_id,
    r.row_label,
    CAST(n.num AS VARCHAR) AS seat_number,
    n.num AS coord_x,
    r.coord_y,
    TRUE
FROM zones z
CROSS JOIN (
    SELECT 'A' AS row_label, 0 AS coord_y UNION ALL
    SELECT 'B', 1 UNION ALL SELECT 'C', 2 UNION ALL SELECT 'D', 3 UNION ALL
    SELECT 'E', 4 UNION ALL SELECT 'F', 5 UNION ALL SELECT 'G', 6 UNION ALL
    SELECT 'H', 7 UNION ALL SELECT 'I', 8 UNION ALL SELECT 'J', 9
) r
CROSS JOIN (
    SELECT 1 AS num UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL
    SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL
    SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL
    SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL
    SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL SELECT 25
) n
ORDER BY z.id, r.coord_y, n.num;

-- Ajustar secuencias tras insertar IDs explícitos (evita conflictos en futuros INSERT sin id)
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1), true);
SELECT setval(pg_get_serial_sequence('venues', 'id'), COALESCE((SELECT MAX(id) FROM venues), 1), true);
SELECT setval(pg_get_serial_sequence('events', 'id'), COALESCE((SELECT MAX(id) FROM events), 1), true);
SELECT setval(pg_get_serial_sequence('zones', 'id'), COALESCE((SELECT MAX(id) FROM zones), 1), true);
SELECT setval(pg_get_serial_sequence('event_pricings', 'id'), COALESCE((SELECT MAX(id) FROM event_pricings), 1), true);
SELECT setval(pg_get_serial_sequence('pay_methods', 'id'), COALESCE((SELECT MAX(id) FROM pay_methods), 1), true);