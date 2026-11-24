import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, MapPin, Search, X } from 'lucide-react';
import { venuesApi } from '../../../shared/api/adminApi';
import TextInput from '../../../shared/components/TextInput';
import SelectInput from '../../../shared/components/SelectInput';
import {
  VENUE_ADDRESS_MAX_LENGTH,
  VENUE_CITY_MAX_LENGTH,
  VENUE_IMG_URL_MAX_LENGTH,
  VENUE_NAME_MAX_LENGTH,
} from '../../../shared/validation/rules';

const emptyForm = { name: '', address: '', city: '', img_url: '', is_active: true };

export default function GestionLugares() {
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
    return items.filter((v) => {
      const status = v.is_active ? 'activo' : 'inactivo';
      return [v.name, v.city, v.address, status].some((val) => String(val || '').toLowerCase().includes(q));
    });
  }, [items, search]);

  const load = async () => {
    try {
      setLoading(true); setError('');
      setItems(await venuesApi.list());
    } catch (e) { setError(e.message || 'No se pudieron cargar los lugares.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalError(''); setShowForm(true); };
  const openEdit = (v) => { setEditing(v); setForm({ name: v.name || '', address: v.address || '', city: v.city || '', img_url: v.img_url || '', is_active: v.is_active !== false }); setModalError(''); setShowForm(true); };

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      img_url: form.img_url.trim(),
      is_active: form.is_active,
    };
    if (!payload.name) {
      setModalError('El nombre del lugar es obligatorio.');
      return;
    }
    try {
      setSaving(true); setModalError('');
      if (editing) await venuesApi.update(editing.id, payload); else await venuesApi.create(payload);
      setShowForm(false); await load();
    } catch (e2) { setModalError(e2.message || 'No se pudo guardar el lugar.'); }
    finally { setSaving(false); }
  };

  const remove = async (v) => {
    if (!window.confirm(`¿Eliminar el lugar "${v.name}"? Si tiene eventos o zonas relacionadas, se desactivará.`)) return;
    try { setError(''); await venuesApi.remove(v.id); await load(); }
    catch (e) { setError(e.message || 'No se pudo eliminar el lugar.'); }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Lugares</h1>
          <p className="text-gray-600 mt-1">Administra recintos y sedes donde se realizan eventos.</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"><Plus className="w-4 h-4" /> Nuevo lugar</button>
      </div>

      {error && <div className="mb-4 border border-red-200 bg-red-50 text-red-800 rounded-lg px-4 py-3">{error}</div>}

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-600">Cargando lugares...</div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <MapPin className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900">No hay lugares registrados</h2>
          <p className="text-gray-600 mt-1 mb-4">Crea un lugar para poder asociarlo a eventos. Los eventos dependen de un recinto existente.</p>
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"><Plus className="w-4 h-4" /> Crear lugar</button>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, ciudad, dirección o estado..." className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                {search && (<button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 text-gray-500" aria-label="Limpiar búsqueda"><X className="w-4 h-4" /></button>)}
              </div>
              <p className="text-sm text-gray-600">Mostrando <span className="font-medium text-gray-900">{filteredItems.length}</span> de <span className="font-medium text-gray-900">{items.length}</span></p>
            </div>
          </div>
          {filteredItems.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center"><p className="text-gray-900 font-medium">No se encontraron resultados</p><p className="text-gray-600 mt-1">Prueba con otro término de búsqueda o limpia el filtro.</p></div>
          ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700"><tr>
                <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                <th className="text-left px-4 py-3 font-semibold">Ciudad</th>
                <th className="text-left px-4 py-3 font-semibold">Dirección</th>
                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                <th className="text-right px-4 py-3 font-semibold">Acciones</th>
              </tr></thead>
              <tbody>
                {filteredItems.map((v) => (
                  <tr key={v.id} className="border-t border-gray-100">
                    <td className="px-4 py-3 text-gray-900 font-medium">{v.name}</td>
                    <td className="px-4 py-3 text-gray-700">{v.city || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{v.address || '-'}</td>
                    <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 rounded-md ${v.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{v.is_active ? 'Activo' : 'Inactivo'}</span></td>
                    <td className="px-4 py-3"><div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(v)} className="p-2 rounded-md border border-gray-200 hover:bg-gray-50" title="Editar"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => remove(v)} className="p-2 rounded-md border border-red-200 text-red-700 hover:bg-red-50" title="Eliminar/Desactivar"><Trash2 className="w-4 h-4" /></button>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="lugar-modal-title">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 id="lugar-modal-title" className="text-xl font-semibold text-gray-900">{editing ? 'Editar lugar' : 'Crear lugar'}</h2>
                <p className="text-sm text-gray-600 mt-1">Ingresa los datos del recinto o sede para asociarlo a eventos.</p>
              </div>
              <button type="button" onClick={() => !saving && (setShowForm(false), setModalError(''))} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700" aria-label="Cerrar modal">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form key={editing?.id ?? 'new'} onSubmit={save} className="space-y-4">
              {modalError && (
                <div className="border border-red-200 bg-red-50 text-red-800 rounded-lg px-4 py-3 text-sm" role="alert">
                  {modalError}
                </div>
              )}
              <TextInput
                label="Nombre del lugar"
                setValue={(value) => setForm((prev) => ({ ...prev, name: value }))}
                initialValue={form.name}
                id="venue-name"
                name="name"
                placeholder="Ej. Teatro Nacional"
                maxLengthOnly
                maxLength={VENUE_NAME_MAX_LENGTH}
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  label="Ciudad"
                  setValue={(value) => setForm((prev) => ({ ...prev, city: value }))}
                  initialValue={form.city}
                  id="venue-city"
                  name="city"
                  placeholder="Ej. San José"
                  maxLengthOnly
                  maxLength={VENUE_CITY_MAX_LENGTH}
                  required={false}
                />
                <SelectInput
                  label="Estado"
                  values={['Activo', 'Inactivo']}
                  initialValue={form.is_active ? 'Activo' : 'Inactivo'}
                  setValue={(value) => setForm((prev) => ({ ...prev, is_active: value === 'Activo' }))}
                />
              </div>
              <TextInput
                label="Dirección"
                setValue={(value) => setForm((prev) => ({ ...prev, address: value }))}
                initialValue={form.address}
                id="venue-address"
                name="address"
                placeholder="Ej. Avenida Central, Calle 3"
                maxLengthOnly
                maxLength={VENUE_ADDRESS_MAX_LENGTH}
                required={false}
              />
              <TextInput
                label="URL de imagen"
                setValue={(value) => setForm((prev) => ({ ...prev, img_url: value }))}
                initialValue={form.img_url}
                id="venue-img"
                name="img_url"
                placeholder="https://ejemplo.com/lugar.jpg"
                maxLengthOnly
                maxLength={VENUE_IMG_URL_MAX_LENGTH}
                required={false}
              />
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => !saving && (setShowForm(false), setModalError(''))} disabled={saving} className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-60 font-medium">{saving ? 'Guardando...' : (editing ? 'Guardar cambios' : 'Crear lugar')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
