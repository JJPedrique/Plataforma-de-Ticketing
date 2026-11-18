-- =======================================================
-- 1. USUARIOS (3 Admins, 4 Organizers, 5 Users)
-- Nota: el enum role_type del modelo usa valores 'admin', 'organizer', 'user'
-- =======================================================
INSERT INTO users (role, first_name, last_name, email, password_hash, created_at, is_active) VALUES
( 'ADMIN', 'Carlos', 'Mendoza', 'cmendoza@eventplatform.com', 'hashed_password_123', CURRENT_TIMESTAMP - INTERVAL '120 days', true),
( 'ADMIN', 'Valeria', 'Ríos', 'vrios@eventplatform.com', 'hashed_password_123', CURRENT_TIMESTAMP - INTERVAL '95 days', true),
( 'ADMIN', 'Andrés', 'Salazar', 'asalazar@eventplatform.com', 'hashed_password_123', CURRENT_TIMESTAMP - INTERVAL '60 days', true),
( 'ORGANIZER', 'Mariana', 'Urdaneta', 'murdaneta@zulialive.com', 'hashed_password_123', CURRENT_TIMESTAMP - INTERVAL '50 days', true),
( 'ORGANIZER', 'Javier', 'Briceño', 'jbriceno@techcaribe.io', 'hashed_password_123', CURRENT_TIMESTAMP - INTERVAL '45 days', true),
( 'ORGANIZER', 'Sofía', 'Castellanos', 'scastellanos@sonoraproducciones.com', 'hashed_password_123', CURRENT_TIMESTAMP - INTERVAL '30 days', true),
( 'ORGANIZER', 'Diego', 'Fuenmayor', 'dfuenmayor@arenagaming.ve', 'hashed_password_123', CURRENT_TIMESTAMP - INTERVAL '25 days', true),
( 'USER', 'Camila', 'Pirela', 'camila.pirela@correo.com', 'hashed_password_123', CURRENT_TIMESTAMP - INTERVAL '20 days', true),
( 'USER', 'Luis', 'Quintero', 'luis.quintero89@correo.com', 'hashed_password_123', CURRENT_TIMESTAMP - INTERVAL '15 days', true),
( 'USER', 'Gabriela', 'Morales', 'gaby.morales@correo.com', 'hashed_password_123', CURRENT_TIMESTAMP - INTERVAL '10 days', true),
( 'USER', 'Ricardo', 'Chacín', 'rchacin@correo.com', 'hashed_password_123', CURRENT_TIMESTAMP - INTERVAL '4 days', true),
( 'USER', 'Elena', 'Villalobos', 'elena.villa@correo.com', 'hashed_password_123', CURRENT_TIMESTAMP - INTERVAL '2 days', false);

-- =======================================================
-- 2. LUGARES (4 recintos en distintas ciudades)
-- =======================================================
INSERT INTO venues (id, name, address, city, img_url, is_active) VALUES
(1, 'Teatro Baralt', 'Av. 5 con Calle 95, Casco Central', 'Maracaibo', 'https://midominio.com/layouts/teatro_baralt.png', true),
(2, 'Aula Magna URU', 'Av. 2 El Milagro, Sector Vereda del Lago', 'Maracaibo', 'https://midominio.com/layouts/aula_magna_uru.png', true),
(3, 'Concha Acústica de Bello Monte', 'Av. Caurimare, Colinas de Bello Monte', 'Caracas', 'https://midominio.com/layouts/concha_acustica.png', true),
(4, 'Forum de Valencia', 'Autopista del Este, Distribuidor El Trigal', 'Valencia', 'https://midominio.com/layouts/forum_valencia.png', true);

-- =======================================================
-- 3. EVENTOS (Temáticas, horarios y estados variados)
-- =======================================================
INSERT INTO events (id, organizer_id, venue_id, title, description, start_date, end_date, is_active) VALUES
(1, 4, 1, 'Gala Sinfónica y Gaitas del Zulia', 'Ensamble de la orquesta sinfónica regional junto a agrupaciones tradicionales en una noche de gala.', '2026-11-21 19:30:00', '2026-11-21 22:30:00', true),
(2, 5, 2, 'Cumbre Tech & IA Caribe 2026', 'Conferencias magistrales, talleres prácticos de inteligencia artificial y rueda de networking.', '2026-11-25 08:30:00', '2026-11-25 17:30:00', true),
(3, 6, 3, 'Festival Indie & Rock Bajo las Estrellas', 'Más de 6 horas de música en vivo al aire libre con bandas nacionales e invitados internacionales.', '2026-12-05 17:00:00', '2026-12-05 23:30:00', true),
(4, 7, 4, 'Final Nacional Copa Esports & Gaming', 'Gran final presencial con pantalla gigante, zona de experiencia gamer y premios en vivo.', '2026-12-12 14:00:00', '2026-12-12 21:00:00', true),
(5, 4, 1, 'Noche de Stand-Up Comedy: Sin Filtro', 'Especial de comedia en vivo con tres de los comediantes más destacados del circuito nacional.', '2026-12-18 20:00:00', '2026-12-18 22:15:00', false);

-- =======================================================
-- 4. ZONAS (Adaptadas a la arquitectura de cada recinto)
-- =======================================================
INSERT INTO zones (id, venue_id, name, color_code, is_active) VALUES
-- Teatro Baralt (Venue 1)
(1, 1, 'Platea VIP', '#D4AF37', true),
(2, 1, 'Patio Central', '#2563EB', true),
(3, 1, 'Balcón Preferencial', '#7C3AED', true),
(4, 1, 'Galería General', '#64748B', true),
-- Aula Magna URU (Venue 2)
(5, 2, 'Ejecutivo + Networking', '#DC2626', true),
(6, 2, 'Auditorio Central', '#0284C7', true),
(7, 2, 'Zona Estudiantil', '#059669', true),
-- Concha Acústica de Bello Monte (Venue 3)
(8, 3, 'Diamante Frente Escenario', '#F59E0B', true),
(9, 3, 'Oro Central', '#EA580C', true),
(10, 3, 'Grada General', '#4F46E5', true),
-- Forum de Valencia (Venue 4)
(11, 4, 'Arena Floor VIP', '#10B981', true),
(12, 4, 'Tribuna Baja', '#06B6D4', true),
(13, 4, 'Tribuna Alta', '#8B5CF6', true);

-- =======================================================
-- 5. PRECIOS POR ZONA Y EVENTO
-- =======================================================
INSERT INTO event_pricings (id, event_id, zone_id, price) VALUES
-- Evento 1: Gala Sinfónica (Venue 1)
(1, 1, 1, 120.00), (2, 1, 2, 75.00), (3, 1, 3, 45.00), (4, 1, 4, 20.00),
-- Evento 2: Cumbre Tech & IA (Venue 2)
(5, 2, 5, 150.00), (6, 2, 6, 65.00), (7, 2, 7, 15.00),
-- Evento 3: Festival Indie & Rock (Venue 3)
(8, 3, 8, 180.00), (9, 3, 9, 95.00), (10, 3, 10, 35.00),
-- Evento 4: Final Esports (Venue 4)
(11, 4, 11, 90.00), (12, 4, 12, 40.00), (13, 4, 13, 18.00),
-- Evento 5: Stand-Up Comedy en el mismo Teatro Baralt (Venue 1) con tarifas distintas
(14, 5, 1, 55.00), (15, 5, 2, 35.00), (16, 5, 3, 25.00), (17, 5, 4, 12.00);

-- =======================================================
-- 6. MÉTODOS DE PAGO
-- =======================================================
INSERT INTO pay_methods (id, name, description, is_active) VALUES
(1, 'Tarjetas de Crédito y Débito', 'Visa, Mastercard, American Express (Nacional e Internacional)', true),
(2, 'Pago Móvil y Transferencia Bancaria', 'Transferencias inmediatas en moneda local', true),
(3, 'Criptomonedas y Monedas Estables (Stablecoins)', 'USDT / USDC vía Binance Pay o red TRC20', true),
(4, 'Billeteras Digitales y Zelle', 'PayPal, Zelle y Zinli', true),
(5, 'Efectivo en Taquilla', 'Pago presencial sujeto a disponibilidad (temporalmente inactivo)', false);

-- =======================================================
-- 7. GENERACIÓN DE ASIENTOS VARIADOS POR TIPO DE ZONA (2,080 filas)
-- VIP: 5 filas x 14 asientos (70)
-- Intermedia: 8 filas x 20 asientos (160)
-- General: 10 filas x 25 asientos (250) + bloque técnico inactivo
-- =======================================================
INSERT INTO seats (zone_id, row_label, seat_number, coord_x, coord_y, is_active)
SELECT 
    z.id AS zone_id,
    r.row_label,
    CAST(n.num AS VARCHAR) AS seat_number,
    n.num AS coord_x,
    r.coord_y,
    CASE 
        -- Simula cabina de sonido/luces bloqueada al fondo de zonas generales
        WHEN z.id IN (4, 10) AND r.row_label = 'J' AND n.num BETWEEN 11 AND 15 THEN FALSE
        ELSE TRUE
    END AS is_active
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
WHERE 
    (z.id IN (1, 5, 8, 11) AND r.coord_y < 5 AND n.num <= 14) OR
    (z.id IN (2, 3, 6, 9, 12) AND r.coord_y < 8 AND n.num <= 20) OR
    (z.id IN (4, 7, 10, 13) AND r.coord_y < 10 AND n.num <= 25)
ORDER BY z.id, r.coord_y, n.num;

-- =======================================================
-- 8. AJUSTE DE SECUENCIAS
-- =======================================================
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1), true);
SELECT setval(pg_get_serial_sequence('venues', 'id'), COALESCE((SELECT MAX(id) FROM venues), 1), true);
SELECT setval(pg_get_serial_sequence('events', 'id'), COALESCE((SELECT MAX(id) FROM events), 1), true);
SELECT setval(pg_get_serial_sequence('zones', 'id'), COALESCE((SELECT MAX(id) FROM zones), 1), true);
SELECT setval(pg_get_serial_sequence('event_pricings', 'id'), COALESCE((SELECT MAX(id) FROM event_pricings), 1), true);
SELECT setval(pg_get_serial_sequence('pay_methods', 'id'), COALESCE((SELECT MAX(id) FROM pay_methods), 1), true);