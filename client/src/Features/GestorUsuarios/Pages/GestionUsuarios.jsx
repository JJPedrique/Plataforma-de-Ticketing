import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Users, Search, X } from 'lucide-react';
import { usersApi } from '../../../shared/api/adminApi';
import RegistroForm from '../../../shared/components/RegistroForm';

const emptyInitialValues = {
  first_name: '',
  last_name: '',
  cedula: '',
  email: '',
  role: 'USER',
  is_active: true,
};

export default function GestionUsuarios() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

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

  const closeModal = () => {
    if (saving) return;
    setShowForm(false);
    setModalError('');
  };

  const openCreate = () => {
    setEditing(null);
    setModalError('');
    setShowForm(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setModalError('');
    setShowForm(true);
  };

  const save = async (values) => {
    setSaving(true);
    setModalError('');
    try {
      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        cedula: values.cedula,
        email: values.email,
        role: values.role,
        is_active: values.is_active,
      };
      if (values.password) {
        payload.password = values.password;
      }

      if (editing) {
        await usersApi.update(editing.id, payload);
      } else {
        await usersApi.create(payload);
      }

      setShowForm(false);
      await load();
    } catch (e) {
      setModalError(e.message || 'No se pudo guardar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (user) => {
    if (!window.confirm(`¿Desactivar al usuario "${user.email}"? El registro no se eliminará de la base de datos.`)) return;
    try {
      setError('');
      await usersApi.remove(user.id);
      await load();
    } catch (e) {
      setError(e.message || 'No se pudo desactivar el usuario.');
    }
  };

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((user) => {
      const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').toLowerCase();
      const fields = [
        fullName,
        user.cedula,
        user.email,
        String(user.role || '').toLowerCase(),
        user.is_active ? 'activo' : 'inactivo',
      ];
      return fields.some((value) => String(value ?? '').toLowerCase().includes(q));
    });
  }, [items, search]);

  const initialValues = editing
    ? {
        first_name: editing.first_name || '',
        last_name: editing.last_name || '',
        cedula: editing.cedula || '',
        email: editing.email || '',
        role: String(editing.role || 'USER').toUpperCase(),
        is_active: editing.is_active !== false,
      }
    : emptyInitialValues;

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
                  placeholder="Buscar por nombre, cédula, correo, rol o estado..."
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
                      <th className="text-left px-4 py-3 font-semibold">Cédula</th>
                      <th className="text-left px-4 py-3 font-semibold">Correo</th>
                      <th className="text-left px-4 py-3 font-semibold">Rol</th>
                      <th className="text-left px-4 py-3 font-semibold">Estado</th>
                      <th className="text-right px-4 py-3 font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((user) => (
                      <tr key={user.id} className="border-t border-gray-100">
                        <td className="px-4 py-3 text-gray-900">{[user.first_name, user.last_name].filter(Boolean).join(' ') || '-'}</td>
                        <td className="px-4 py-3 text-gray-700">{user.cedula || '-'}</td>
                        <td className="px-4 py-3 text-gray-700">{user.email}</td>
                        <td className="px-4 py-3"><span className="inline-flex px-2 py-1 rounded-md bg-gray-100 text-gray-800 capitalize">{user.role}</span></td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 rounded-md ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openEdit(user)} className="p-2 rounded-md border border-gray-200 hover:bg-gray-50" title="Editar"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => remove(user)} className="p-2 rounded-md border border-red-200 text-red-700 hover:bg-red-50" title="Desactivar/Eliminar"><Trash2 className="w-4 h-4" /></button>
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
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="usuario-modal-title">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 id="usuario-modal-title" className="text-xl font-semibold text-gray-900">{editing ? 'Editar usuario' : 'Crear usuario'}</h2>
                <p className="text-sm text-gray-600 mt-1">Completa la información para gestionar el acceso y rol del usuario.</p>
              </div>
              <button type="button" onClick={closeModal} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700" aria-label="Cerrar modal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <RegistroForm
              key={editing?.id ?? 'new'}
              initialValues={initialValues}
              onSubmit={save}
              onError={setModalError}
              error={modalError}
              loading={saving}
              isEditing={Boolean(editing)}
              showAdminFields
              submitLabel={editing ? 'Guardar cambios' : 'Crear usuario'}
              loadingLabel="Guardando..."
              onCancel={closeModal}
              idPrefix="usuario"
            />
          </div>
        </div>
      )}
    </div>
  );
}
