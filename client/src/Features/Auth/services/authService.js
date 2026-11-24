import { apiRequest } from '../../../shared/api/http';
import axiosClient from '../../../core/api/axiosClient';
import { normalizeRole } from '../../../shared/constants/roles';
import {
  CEDULA_REGEX,
  DIGIT_REGEX,
  EMAIL_REGEX,
  LOWERCASE_REGEX,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  NAME_REGEX,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_SPACE_REGEX,
  SYMBOL_REGEX,
  sanitizeEmail,
  UPPERCASE_REGEX,
} from '../../../shared/validation/rules';

export const userService = {
  login: (loginData) => axiosClient.post('/Users/login', loginData),
  register: (registerData) => axiosClient.post('/Users/register',registerData),
  newPassword: (newPasswordData) => axiosClient.post('/Users/newPassword',newPasswordData),
  update: (id, userData) => axiosClient.put(`/Users/${id}`, userData),
  delete: (id) => axiosClient.delete(`/Users/${id}`)
};

const SESSION_KEY = 'ticketing_session';

function toDisplayName(user) {
  const full = [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim();
  return full || user?.email || 'Usuario';
}

function toSession(user) {
  if (!user) return null;
  const role = String(user.role || '').toLowerCase();
  return {
    ...user,
    id: user.id,
    email: user.email,
    role,
    is_active: user.is_active !== false,
    name: toDisplayName(user),
  };
}

function saveSession(session) {
  if (!session) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export const authService = {
  validatePassword: (password) => {
    if (!password || password.length < PASSWORD_MIN_LENGTH) {
      throw new Error(`La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`);
    }
    if (password.length > PASSWORD_MAX_LENGTH) {
      throw new Error(`La contraseña no puede exceder ${PASSWORD_MAX_LENGTH} caracteres.`);
    }
    if (PASSWORD_SPACE_REGEX.test(password)) {
      throw new Error('La contraseña no puede contener espacios.');
    }
    if (!UPPERCASE_REGEX.test(password)) {
      throw new Error('La contraseña debe contener al menos una letra mayúscula.');
    }
    if (!LOWERCASE_REGEX.test(password)) {
      throw new Error('La contraseña debe contener al menos una letra minúscula.');
    }
    if (!DIGIT_REGEX.test(password)) {
      throw new Error('La contraseña debe contener al menos un número.');
    }
    if (!SYMBOL_REGEX.test(password)) {
      throw new Error('La contraseña debe contener al menos un símbolo (!@#$%^&*...).');
    }
    return true;
  },

  normalizeCedula: (value) => {
    const raw = String(value ?? "").toUpperCase().replace(/\s+/g, "").replace(/[^VE0-9-]/g, "");
    const match = CEDULA_REGEX.exec(raw);
    return match ? `${match[1]}-${match[2]}` : raw;
  },

  validateCedula: (value) => {
    const normalized = authService.normalizeCedula(value);
    if (!normalized) {
      throw new Error("La cédula es obligatoria.");
    }
    if (!CEDULA_REGEX.test(normalized)) {
      throw new Error("Formato válido: V-12345678 o E-12345678 (entre 6 y 8 dígitos).");
    }
    return normalized;
  },

  normalizeRole,

  toSession,

  login: async (email, password) => {
    const cleanEmail = sanitizeEmail(email).toLowerCase();
    if (!cleanEmail || !password) {
      throw new Error('Correo y contraseña son obligatorios.');
    }
    const user = await apiRequest('/Users/login', {
      method: 'POST',
      body: JSON.stringify({ email: cleanEmail, password }),
    });
    return saveSession(toSession(user));
  },

  normalizePersonName: (value) => String(value ?? '').replace(/\s+/g, ' ').trim(),

  validatePersonName: (value, fieldLabel) => {
    const cleaned = authService.normalizePersonName(value);
    if (!cleaned) {
      throw new Error(`El ${fieldLabel} es obligatorio.`);
    }
    if (cleaned.length < NAME_MIN_LENGTH) {
      throw new Error(`El ${fieldLabel} debe tener al menos ${NAME_MIN_LENGTH} caracteres.`);
    }
    if (cleaned.length > NAME_MAX_LENGTH) {
      throw new Error(`El ${fieldLabel} no puede exceder ${NAME_MAX_LENGTH} caracteres.`);
    }
    if (!NAME_REGEX.test(cleaned)) {
      throw new Error(`El ${fieldLabel} solo puede contener letras, espacios, apóstrofes y guiones.`);
    }
    return cleaned;
  },

  register: async ({ firstName, lastName, cedula, email, password }) => {
    const cleanFirstName = authService.validatePersonName(firstName, 'nombre');
    const cleanLastName = authService.validatePersonName(lastName, 'apellido');
    const cleanCedula = authService.validateCedula(cedula);
    const cleanEmail = sanitizeEmail(email).toLowerCase();

    if (!cleanEmail || !password) {
      throw new Error('Todos los campos son obligatorios.');
    }
    if (!EMAIL_REGEX.test(cleanEmail)) {
      throw new Error('Ingresa un correo electrónico válido.');
    }

    authService.validatePassword(password);

    const user = await apiRequest('/Users/register', {
      method: 'POST',
      body: JSON.stringify({
        email: cleanEmail,
        first_name: cleanFirstName,
        last_name: cleanLastName,
        cedula: cleanCedula,
        password,
      }),
    });
    return saveSession(toSession(user));
  },

  requestPasswordRecovery: async () => {
    return {
      success: true,
      message: 'La recuperación de contraseña con base de datos aún no está configurada. Contacta al administrador si necesitas ayuda.',
    };
  },

  resetPassword: async () => {
    throw new Error('El restablecimiento de contraseña con base de datos aún no está configurado.');
  },

  getSession: () => {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;
    try {
      const parsed = JSON.parse(session);
      if (!parsed?.id) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      if (parsed.is_active === false) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return parsed;
    } catch {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  },

  refreshSession: async () => {
    const session = authService.getSession();
    if (!session?.id) return null;
    const user = await apiRequest(`/Users/${session.id}`);
    if (user?.is_active === false) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return saveSession(toSession(user));
  },

  updateProfile: async ({ firstName, lastName, name }) => {
    const session = authService.getSession();
    if (!session?.id) throw new Error('No hay sesión activa');

    let cleanFirstName = firstName;
    let cleanLastName = lastName;

    if (name && (!cleanFirstName || !cleanLastName)) {
      const trimmedName = authService.normalizePersonName(name);
      const parts = trimmedName.split(/\s+/).filter(Boolean);
      cleanFirstName = cleanFirstName || parts.shift() || '';
      cleanLastName = cleanLastName || parts.join(' ');
    }

    cleanFirstName = authService.validatePersonName(cleanFirstName, 'nombre');
    cleanLastName = authService.validatePersonName(cleanLastName, 'apellido');

    const user = await apiRequest(`/Users/${session.id}`, {
      method: 'PUT',
      body: JSON.stringify({ first_name: cleanFirstName, last_name: cleanLastName }),
    });
    return saveSession(toSession(user));
  },

  deactivateAccount: async () => {
    const session = authService.getSession();
    if (!session?.id) throw new Error('No hay sesión activa');
    await apiRequest(`/Users/${session.id}`, { method: 'DELETE' });
    localStorage.removeItem(SESSION_KEY);
    return { success: true };
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  hasRole: (session, roles = []) => {
    if (!session?.role) return false;
    const current = String(session.role).toLowerCase();
    return roles.map((r) => String(r).toLowerCase()).includes(current);
  },
};
