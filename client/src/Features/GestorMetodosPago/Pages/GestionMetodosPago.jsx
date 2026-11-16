import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, CreditCard, Search, X } from 'lucide-react';
import { payMethodsApi } from '../../../shared/api/adminApi';

const emptyForm = { name: '', description: '', is_active: true };

const inputClassName = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors';

export default function GestionMetodosPago() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalError, setModalError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((m) => {
      const status = m.is_active ? 'activo' : 'inactivo';
      return [m.name, m.description, status].some((val) => String(val || '').toLowerCase().includes(q));
    });
  }, [items, search]);

  const load = async () => {
    try { setLoading(true); setError(''); setItems(await payMethodsApi.list()); }
    catch (e) { setError(e.message || 'No se pudieron cargar los métodos de pago.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalError(''); setShowForm(true); };
  const openEdit = (m) => { setEditing(m); setForm({ name: m.name || '', description: m.description || '', is_active: m.is_active !== false }); setModalError(''); setShowForm(true); };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      is_active: form.is_active,
    };
    if (!payload.name) {
      setModalError('El nombre del método de pago es obligatorio.');
      return;
    }
    try {
      setSaving(true); setModalError('');
      if (editing) await payMethodsApi.update(editing.id, payload); else await payMethodsApi.create(payload);
      setShowForm(false); await load();
    } catch (e2) { setModalError(e2.message || 'No se pudo guardar el método de pago.'); }
    finally { setSaving(false); }
  };

  const remove = async (m) => {
    if (!window.confirm('¿Eliminar o desactivar el método de pago seleccionado? Si tiene información relacionada, se desactivará.')) return;
    try { setError(''); await payMethodsApi.remove(m.id); await load(); }
    catch (e) { setError(e.message || 'No se pudo eliminar el método de pago.'); }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Métodos de Pago</h1>
          <p className="text-gray-600 mt-1">Administra los métodos disponibles para completar órdenes de compra.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"><Plus className="w-4 h-4" /> Nuevo método</button>
      </div>

      {error && <div className="mb-4 border border-red-200 bg-red-50 text-red-800 rounded-lg px-4 py-3">{error}</div>}

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-600">Cargando métodos de pago...</div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <CreditCard className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900">No hay métodos de pago registrados</h2>
          <p className="text-gray-600 mt-1 mb-4">Crea un método de pago para habilitarlo en el flujo de compra cuando corresponda.</p>
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"><Plus className="w-4 h-4" /> Crear método de pago</button>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, descripción o estado..." className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                {search && (<button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 text-gray-500" aria-label="Limpiar búsqueda"><X className="w-4 h-4" /></button>)}
              </div>
              <p className="text-sm text-gray-600">Mostrando <span className="font-medium text-gray-900">{filteredItems.length}</span> de <span className="font-medium text-gray-900">{items.length}</span></p>
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
                  <thead className="bg-gray-50 text-gray-700"><tr>
                    <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                    <th className="text-left px-4 py-3 font-semibold">Descripción</th>
                    <th className="text-left px-4 py-3 font-semibold">Estado</th>
                    <th className="text-right px-4 py-3 font-semibold">Acciones</th>
                  </tr></thead>
                  <tbody>
                    {filteredItems.map((m) => (
                      <tr key={m.id} className="border-t border-gray-100">
                        <td className="px-4 py-3 text-gray-900 font-medium">{m.name}</td>
                        <td className="px-4 py-3 text-gray-700">{m.description || '—'}</td>
                        <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 rounded-md ${m.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{m.is_active ? 'Activo' : 'Inactivo'}</span></td>
                        <td className="px-4 py-3"><div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(m)} className="p-2 rounded-md border border-gray-200 hover:bg-gray-50" title="Editar"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => remove(m)} className="p-2 rounded-md border border-red-200 text-red-700 hover:bg-red-50" title="Eliminar/Desactivar"><Trash2 className="w-4 h-4" /></button>
                        </div></td>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="metodo-modal-title">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 id="metodo-modal-title" className="text-xl font-semibold text-gray-900">{editing ? 'Editar método de pago' : 'Crear método de pago'}</h2>
                <p className="text-sm text-gray-600 mt-1">Define los métodos disponibles para completar órdenes de compra.</p>
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
              <div>
                <label htmlFor="pay-name" className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del método</label>
                <input id="pay-name" name="name" required aria-required="true" aria-label="Nombre del método de pago" placeholder="Ej. Tarjeta de crédito" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClassName} />
              </div>
              <div>
                <label htmlFor="pay-description" className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                <textarea id="pay-description" name="description" aria-label="Descripción del método de pago" placeholder="Describe brevemente cómo se utiliza este método" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClassName} rows={3} />
              </div>
              <div>
                <label htmlFor="pay-status" className="block text-sm font-medium text-gray-700 mb-1.5">Estado</label>
                <select id="pay-status" name="is_active" aria-label="Estado del método de pago" value={String(form.is_active)} onChange={(e) => setForm({ ...form, is_active: e.target.value === 'true' })} className={inputClassName}>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => !saving && (setShowForm(false), setModalError(''))} disabled={saving} className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-60 font-medium">{saving ? 'Guardando...' : (editing ? 'Guardar cambios' : 'Crear método')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
