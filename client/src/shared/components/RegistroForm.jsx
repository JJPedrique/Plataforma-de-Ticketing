import { useState } from 'react';
import TextInput from './TextInput';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import CedulaInput from './CedulaInput';
import { authService } from '../../Features/Auth/services/authService';
import { EMAIL_REGEX, sanitizeEmail } from '../validation/rules';

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'ORGANIZER', label: 'Organizador' },
  { value: 'USER', label: 'Usuario (cliente)' },
];

const selectClassName = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors';

/**
 * Formulario extraído de la página de Registro y reutilizado por el gestor de usuarios.
 * En modo registro muestra solo los datos de la cuenta; en modo administración
 * añade rol, estado y contraseña opcional al editar.
 */
export default function RegistroForm({
  initialValues = {},
  onSubmit,
  onError,
  onCancel,
  error = '',
  loading = false,
  isEditing = false,
  showAdminFields = false,
  submitLabel = 'Registrar Cuenta',
  loadingLabel = 'Guardando...',
  idPrefix = 'registro',
}) {
  const [firstName, setFirstName] = useState(initialValues.first_name ?? initialValues.firstName ?? '');
  const [lastName, setLastName] = useState(initialValues.last_name ?? initialValues.lastName ?? '');
  const [cedula, setCedula] = useState(initialValues.cedula ?? '');
  const [email, setEmail] = useState(initialValues.email ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(authService.normalizeRole(initialValues.role ?? 'USER'));
  const [isActive, setIsActive] = useState(initialValues.is_active !== false);

  const passwordIsOptional = showAdminFields && isEditing;
  const passwordLabel = passwordIsOptional ? 'Nueva contraseña (opcional)' : 'Contraseña';
  const confirmLabel = passwordIsOptional ? 'Confirmar nueva contraseña (opcional)' : 'Confirmar Contraseña';
  const passwordPlaceholder = passwordIsOptional
    ? 'Dejar vacío para no cambiar (mín. 8, mayúscula, minúscula, número y símbolo)'
    : 'Ingresa tu contraseña';

  const reportError = (message) => {
    if (onError) onError(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      const cleanFirstName = authService.validatePersonName(firstName, 'nombre');
      const cleanLastName = authService.validatePersonName(lastName, 'apellido');
      const cleanCedula = authService.validateCedula(cedula);
      const cleanEmail = sanitizeEmail(email).toLowerCase();

      if (!EMAIL_REGEX.test(cleanEmail)) {
        throw new Error('Ingresa un correo electrónico válido.');
      }

      let cleanPassword = '';
      if (passwordIsOptional && !password && !confirmPassword) {
        cleanPassword = '';
      } else {
        if (!password) {
          throw new Error('La contraseña es obligatoria.');
        }
        authService.validatePassword(password);
        if (password !== confirmPassword) {
          throw new Error(
            showAdminFields
              ? 'Las contraseñas no coinciden.'
              : 'Las Contraseña no coinciden.'
          );
        }
        cleanPassword = password;
      }

      await onSubmit({
        first_name: cleanFirstName,
        last_name: cleanLastName,
        cedula: cleanCedula,
        email: cleanEmail,
        role: authService.normalizeRole(role),
        is_active: isActive,
        password: cleanPassword,
      });
    } catch (err) {
      reportError(err.message || 'Ocurrió un error al registrar.');
    }
  };

  const buttonClassName = showAdminFields
    ? 'px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-60 font-medium'
    : 'w-full bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="border border-red-200 bg-red-50 text-red-800 rounded-lg px-4 py-3 text-sm" role="alert">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          label="Nombre"
          setValue={setFirstName}
          initialValue={firstName}
          id={`${idPrefix}-first-name`}
          name="first_name"
        />
        <TextInput
          label="Apellido"
          setValue={setLastName}
          initialValue={lastName}
          id={`${idPrefix}-last-name`}
          name="last_name"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CedulaInput
          label="Cedula"
          setValue={setCedula}
          initialValue={cedula}
          id={`${idPrefix}-cedula`}
          name="cedula"
        />
        <EmailInput
          label="Correo electrónico"
          setValue={setEmail}
          initialValue={email}
          id={`${idPrefix}-email`}
          name="email"
        />
      </div>

      {showAdminFields && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${idPrefix}-role`} className="block text-sm font-medium text-gray-700 mb-1.5">
              Rol
            </label>
            <select
              id={`${idPrefix}-role`}
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={selectClassName}
              aria-label="Rol del usuario"
              required
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${idPrefix}-status`} className="block text-sm font-medium text-gray-700 mb-1.5">
              Estado
            </label>
            <select
              id={`${idPrefix}-status`}
              name="is_active"
              value={String(isActive)}
              onChange={(e) => setIsActive(e.target.value === 'true')}
              className={selectClassName}
              aria-label="Estado del usuario"
              required
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </div>
      )}

      <PasswordInput
        label={passwordLabel}
        setValue={setPassword}
        id={`${idPrefix}-password`}
        name="password"
        placeholder={passwordPlaceholder}
        required={!passwordIsOptional}
      />
      <PasswordInput
        label={confirmLabel}
        setValue={setConfirmPassword}
        id={`${idPrefix}-confirm-password`}
        name="confirm_password"
        placeholder={passwordPlaceholder}
        required={!passwordIsOptional}
      />

      <div className={`flex gap-3 pt-2 border-t border-gray-100 ${showAdminFields ? 'justify-end' : 'block'}`}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 disabled:opacity-60"
          >
            Cancelar
          </button>
        )}
        <button type="submit" disabled={loading} className={buttonClassName}>
          {loading ? loadingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
