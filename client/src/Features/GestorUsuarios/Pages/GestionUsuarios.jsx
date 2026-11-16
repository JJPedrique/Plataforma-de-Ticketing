import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Users, Search, X, Eye, EyeOff } from 'lucide-react';
import { usersApi } from '../../../shared/api/adminApi';
import { authService } from '../../Auth/services/authService';

const emptyForm = { first_name: '', last_name: '', email: '', password: '', role: 'user', is_active: true };

const inputClassName = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors';

export default function GestionUsuarios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setItems(await usersApi.list());
    } catch (e) {
      setError(e.message || 'No se pudieron cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowPassword(false); setModalError(''); setShowForm(true); };
  const openEdit = (u) => {
    setEditing(u);
    setForm({ first_name: u.first_name || '', last_name: u.last_name || '', email: u.email || '', password: '', role: u.role || 'user', is_active: u.is_active !== false });
    setShowPassword(false);
    setModalError('');
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const payloadBase = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
      is_active: form.is_active,
    };
    if (!payloadBase.first_name || !payloadBase.last_name || !payloadBase.email) {
      setModalError('Complete todos los campos obligatorios.');
      return;
    }
    if (!editing && !form.password) {
      setModalError('La contraseña es obligatoria para crear un usuario.');
      return;
    }
    if (form.password) {
      try {
        authService.validatePassword(form.password);
      } catch (err) {
        setModalError(err.message || 'La contraseña no cumple con los requisitos.');
        return;
      }
    }
    try {
      setSaving(true);
      setModalError('');
      if (editing) {
        const payload = { ...payloadBase };
        if (form.password) payload.password = form.password;
        await usersApi.update(editing.id, payload);
      } else {
        await usersApi.create({ ...payloadBase, password: form.password });
      }
      setShowForm(false);
      await load();
    } catch (e2) {
      setModalError(e2.message || 'No se pudo guardar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`¿Eliminar al usuario "${u.email}"?`)) return;
    try {
      setError('');
      await usersApi.remove(u.id);
      await load();
    } catch (e) {
      setError(e.message || 'No se pudo desactivar el usuario.');
    }
  };

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((u) => {
      const fullName = [u.first_name, u.last_name].filter(Boolean).join(' ').toLowerCase();
      const role = String(u.role || '').toLowerCase();
      const status = u.is_active ? 'activo' : 'inactivo';
      return [fullName, u.email, role, status].some((v) => String(v || '').toLowerCase().includes(q));
    });
  }, [items, search]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Roles de Usuarios</h1>
          <p className="text-gray-600 mt-1">Administra usuarios, roles y estado de acceso.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
          <Plus className="w-4 h-4" /> Nuevo usuario
        </button>
      </div>

      {error && <div className="mb-4 border border-red-200 bg-red-50 text-red-800 rounded-lg px-4 py-3">{error}</div>}

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-600">Cargando usuarios...</div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <Users className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900">No hay usuarios registrados</h2>
          <p className="text-gray-600 mt-1 mb-4">Crea el primer usuario para comenzar a gestionar roles y accesos.</p>
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
            <Plus className="w-4 h-4" /> Crear usuario
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por nombre, correo, rol o estado..."
                  className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                {search && (
                  <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 text-gray-500" aria-label="Limpiar búsqueda">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Mostrando <span className="font-medium text-gray-900">{filteredItems.length}</span> de <span className="font-medium text-gray-900">{items.length}</span>
              </p>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <p className="text-gray-900 font-medium">No se encontraron resultados</p>
              <p className="text-gray-600 mt-1">Prueba con otro término de búsqueda o limpia el filtro.</p>
            </div>
          ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                  <th className="text-left px-4 py-3 font-semibold">Correo</th>
                  <th className="text-left px-4 py-3 font-semibold">Rol</th>
                  <th className="text-left px-4 py-3 font-semibold">Estado</th>
                  <th className="text-right px-4 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((u) => (
                  <tr key={u.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-gray-900">{[u.first_name, u.last_name].filter(Boolean).join(' ') || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{u.email}</td>
                    <td className="px-4 py-3"><span className="inline-flex px-2 py-1 rounded-md bg-gray-100 text-gray-800 capitalize">{u.role}</span></td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 rounded-md ${u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {u.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(u)} className="p-2 rounded-md border border-gray-200 hover:bg-gray-50" title="Editar"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => remove(u)} className="p-2 rounded-md border border-red-200 text-red-700 hover:bg-red-50" title="Desactivar/Eliminar"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => !saving && (setShowForm(false), setModalError(''))}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="usuario-modal-title">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 id="usuario-modal-title" className="text-xl font-semibold text-gray-900">{editing ? 'Editar usuario' : 'Crear usuario'}</h2>
                <p className="text-sm text-gray-600 mt-1">Completa la información para gestionar el acceso y rol del usuario.</p>
              </div>
              <button type="button" onClick={() => !saving && (setShowForm(false), setModalError(''))} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700" aria-label="Cerrar modal">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={save} className="space-y-4" noValidate>
              {modalError && (
                <div className="border border-red-200 bg-red-50 text-red-800 rounded-lg px-4 py-3 text-sm" role="alert">
                  {modalError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user-first-name" className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                  <input id="user-first-name" name="first_name" required aria-required="true" aria-label="Nombre" autoComplete="given-name" placeholder="Ej. Ana" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className={inputClassName} />
                </div>
                <div>
                  <label htmlFor="user-last-name" className="block text-sm font-medium text-gray-700 mb-1.5">Apellido</label>
                  <input id="user-last-name" name="last_name" required aria-required="true" aria-label="Apellido" autoComplete="family-name" placeholder="Ej. Pérez" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className={inputClassName} />
                </div>
              </div>
              <div>
                <label htmlFor="user-email" className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
                <input id="user-email" name="email" required aria-required="true" aria-label="Correo electrónico" type="email" autoComplete="email" placeholder="usuario@correo.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClassName} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="user-role" className="block text-sm font-medium text-gray-700 mb-1.5">Rol</label>
                  <select id="user-role" name="role" aria-label="Rol del usuario" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClassName}>
                    <option value="user">Usuario (cliente)</option>
                    <option value="organizer">Organizador</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="user-status" className="block text-sm font-medium text-gray-700 mb-1.5">Estado</label>
                  <select id="user-status" name="is_active" aria-label="Estado del usuario" value={String(form.is_active)} onChange={(e) => setForm({ ...form, is_active: e.target.value === 'true' })} className={inputClassName}>
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="user-password" className="block text-sm font-medium text-gray-700 mb-1.5">{editing ? 'Nueva contraseña (opcional)' : 'Contraseña'}</label>
                <div className="relative">
                  <input
                    id="user-password"
                    name="password"
                    required={!editing}
                    aria-required={!editing}
                    aria-label={editing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={128}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className={`${inputClassName} pr-10`}
                    placeholder={editing ? 'Dejar vacío para no cambiar (mín. 8, mayúscula, minúscula, número y símbolo)' : 'Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => !saving && (setShowForm(false), setModalError(''))} disabled={saving} className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-60 font-medium">{saving ? 'Guardando...' : (editing ? 'Guardar cambios' : 'Crear usuario')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
