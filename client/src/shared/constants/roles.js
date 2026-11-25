// Valores canónicos: deben coincidir con RoleType en server/src/models/User.py.
export const ROLES = Object.freeze({
  ADMIN: 'ADMIN',
  ORGANIZER: 'ORGANIZER',
  USER: 'USER',
});

// Alias heredados de sesiones anteriores y de textos escritos a mano.
const ROLE_ALIASES = Object.freeze({
  CUSTOMER: ROLES.USER,
  CLIENT: ROLES.USER,
});

/** Devuelve siempre ADMIN | ORGANIZER | USER, venga como string, objeto o vacío. */
export function normalizeRole(value) {
  if (value && typeof value === 'object') {
    return normalizeRole(value.name ?? value.role ?? value.value ?? '');
  }

  const key = String(value ?? ROLES.USER).trim().toUpperCase();
  return ROLE_ALIASES[key] ?? (Object.values(ROLES).includes(key) ? key : ROLES.USER);
}

/** Única etiqueta visible para el rol en toda la aplicación. */
export function getRoleLabel(value) {
  const role = normalizeRole(value);

  if (role === ROLES.ADMIN) return 'Administrador';
  if (role === ROLES.ORGANIZER) return 'Organizador';
  return 'Cliente';
}
