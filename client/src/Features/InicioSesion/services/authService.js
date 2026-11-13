import { getUsuarioByEmail, usuarios } from '../data/usuarios';

const SESSION_KEY = 'ticketing_session';

export const authService = {
  validatePassword: (password) => {
    if (!password || password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres.');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('La contraseña debe contener al menos una letra mayúscula.');
    }
    if (!/[a-z]/.test(password)) {
      throw new Error('La contraseña debe contener al menos una letra minúscula.');
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('La contraseña debe contener al menos un número.');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      throw new Error('La contraseña debe contener al menos un símbolo (!@#$%^&*...).');
    }
    return true;
  },

  login: (email, password) => {
    const user = getUsuarioByEmail(email);
    if (!user || user.is_active === false) {
      throw new Error('Credenciales inválidas');
    }
    if (!password || password.length < 4) {
      throw new Error('Credenciales inválidas');
    }
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      is_active: user.is_active !== false,
      token: `mock-token-${user.id}-${Date.now()}`,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 horas
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  register: ({ name, email, password }) => {
    if (!name || !email || !password) {
      throw new Error('Todos los campos son obligatorios');
    }
    authService.validatePassword(password);
    const existing = getUsuarioByEmail(email);
    if (existing) {
      throw new Error('El correo electrónico ya está registrado.');
    }
    const newUser = {
      id: usuarios.length + 1,
      name,
      email,
      password_hash: `hash_${Date.now()}`,
      role: 'client',
      is_active: true,
      created_at: new Date().toISOString(),
    };
    usuarios.push(newUser);
    const session = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      is_active: true,
      token: `mock-token-${newUser.id}-${Date.now()}`,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  requestPasswordRecovery: (email) => {
    const user = getUsuarioByEmail(email);
    if (!user) {
      return { success: true, message: 'Si el correo está registrado, recibirás un enlace de recuperación.' };
    }
    const recoveryToken = `recovery-${user.id}-${Date.now()}`;
    localStorage.setItem(`recovery_${recoveryToken}`, JSON.stringify({ userId: user.id, expiresAt: Date.now() + 1000 * 60 * 15 }));
    return { success: true, message: 'Se ha enviado un enlace de recuperación a tu correo electrónico.', token: recoveryToken };
  },

  resetPassword: (token, newPassword) => {
    if (!token || !newPassword) {
      throw new Error('El token y la nueva contraseña son obligatorios.');
    }
    authService.validatePassword(newPassword);
    const data = localStorage.getItem(`recovery_${token}`);
    if (!data) {
      throw new Error('Token inválido o expirado.');
    }
    const parsed = JSON.parse(data);
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(`recovery_${token}`);
      throw new Error('El token ha expirado.');
    }
    const user = usuarios.find((u) => u.id === parsed.userId);
    if (user) {
      user.password_hash = `hash_${Date.now()}`;
    }
    localStorage.removeItem(`recovery_${token}`);
    return { success: true, message: 'Contraseña restablecida correctamente.' };
  },

  getSession: () => {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;
    const parsed = JSON.parse(session);
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    const user = usuarios.find((u) => u.id === parsed.id);
    if (user && user.is_active === false) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  },

  updateProfile: ({ name }) => {
    const session = authService.getSession();
    if (!session) throw new Error('No hay sesión activa');
    const trimmedName = (name || '').trim();
    if (!trimmedName) throw new Error('El nombre es obligatorio');

    const user = usuarios.find((u) => u.id === session.id);
    if (user) {
      user.name = trimmedName;
    }

    const updatedSession = { ...session, name: trimmedName };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
    return updatedSession;
  },

  deactivateAccount: () => {
    const session = authService.getSession();
    if (!session) throw new Error('No hay sesión activa');
    const user = usuarios.find((u) => u.id === session.id);
    if (user) {
      user.is_active = false;
    }
    localStorage.removeItem(SESSION_KEY);
    return { success: true };
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  hasRole: (session, roles) => {
    if (!session) return false;
    return roles.includes(session.role);
  },
};
