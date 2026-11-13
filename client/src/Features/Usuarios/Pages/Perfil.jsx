import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../InicioSesion/services/authService';

function getRoleLabel(role) {
  if (role === 'admin') return 'Administrador';
  if (role === 'client') return 'Cliente';
  return role || 'Usuario';
}

function Perfil() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => authService.getSession());
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session?.name || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const current = authService.getSession();
    if (!current) {
      navigate('/IniciarSesion');
      return;
    }
    setSession(current);
    setName(current.name || '');
  }, [navigate]);

  const initials = useMemo(() => {
    const base = session?.name || 'U';
    return base
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [session?.name]);

  if (!session) return null;

  const handleStartEdit = () => {
    setName(session.name || '');
    setMessage({ type: '', text: '' });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setName(session.name || '');
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    const trimmed = name.trim();
    if (!trimmed) {
      setMessage({ type: 'error', text: 'Ingresa tu nombre para continuar.' });
      return;
    }
    try {
      setSaving(true);
      const updated = authService.updateProfile({ name: trimmed });
      setSession(updated);
      setName(updated.name);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Tu información se guardó correctamente.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'No se pudo guardar la información. Inténtalo de nuevo.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = () => {
    try {
      authService.deactivateAccount();
      navigate('/Inicio');
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'No se pudo desactivar la cuenta. Inténtalo de nuevo.' });
      setConfirmDelete(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-16">
      <header className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Mi perfil</h1>
        <p className="text-gray-700 mt-2">Administra tu información personal y la configuración de tu cuenta.</p>
      </header>

      {message.text && (
        <div
          role={message.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={`mb-6 border rounded-xl px-4 py-3 ${
            message.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-green-200 bg-green-50 text-green-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-7">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-14 md:size-16 rounded-full bg-orange-600 text-white font-semibold text-lg md:text-xl shrink-0" aria-hidden="true">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xl font-semibold text-gray-900 truncate">{session.name}</p>
              <p className="text-gray-600 truncate">{session.email}</p>
              <p className="text-sm text-gray-500 mt-0.5">{getRoleLabel(session.role)}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="info-personal-title" className="bg-white border border-gray-200 rounded-xl p-6 md:p-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 id="info-personal-title" className="text-xl font-semibold text-gray-900">Información personal</h2>
              <p className="text-sm text-gray-600 mt-1">Mantén tus datos actualizados. Tu correo electrónico no se puede cambiar.</p>
            </div>
            {!isEditing && (
              <button
                type="button"
                onClick={handleStartEdit}
                className="inline-flex items-center justify-center px-4 py-2.5 bg-orange-700 text-white font-medium rounded-md hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 shrink-0"
              >
                Modificar información
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1.5">Nombre completo</label>
                {isEditing ? (
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    className="w-full px-3.5 py-3 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                    placeholder="Tu nombre completo"
                  />
                ) : (
                  <div className="w-full px-3.5 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-900">
                    {session.name}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <span className="block text-sm font-medium text-gray-900 mb-1.5">Correo electrónico</span>
                <div className="w-full px-3.5 py-3 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                  {session.email}
                </div>
                <p className="text-sm text-gray-500 mt-1.5">Usamos este correo para iniciar sesión y enviarte notificaciones importantes.</p>
              </div>
            </div>

            {isEditing && (
              <div className="pt-5 border-t border-gray-200 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-50 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-orange-700 text-white font-medium rounded-md hover:bg-orange-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            )}
          </form>
        </section>

        <section aria-labelledby="cuenta-title" className="bg-white border border-gray-200 rounded-xl p-6 md:p-7">
          <div className="flex flex-col gap-4">
            <div>
              <h2 id="cuenta-title" className="text-xl font-semibold text-gray-900">Cuenta</h2>
              <p className="text-gray-700 mt-1 max-w-2xl">
                Si desactivas tu cuenta, se cerrará tu sesión y no podrás acceder hasta solicitar ayuda para reactivarla.
              </p>
            </div>

            {!confirmDelete ? (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-white text-red-700 border border-red-300 font-medium rounded-md hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                >
                  Desactivar cuenta
                </button>
              </div>
            ) : (
              <div className="border border-red-200 bg-red-50 rounded-lg p-4 md:p-5" role="group" aria-label="Confirmación para desactivar cuenta">
                <p className="text-red-900 font-medium">¿Quieres desactivar tu cuenta?</p>
                <p className="text-sm text-red-800 mt-1">Esta acción cerrará tu sesión de inmediato.</p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleDeactivate}
                    className="inline-flex items-center justify-center px-4 py-2.5 bg-red-700 text-white font-medium rounded-md hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                  >
                    Sí, desactivar cuenta
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="inline-flex items-center justify-center px-4 py-2.5 bg-white text-gray-800 border border-gray-300 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
                  >
                    Mantener mi cuenta
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Perfil;
