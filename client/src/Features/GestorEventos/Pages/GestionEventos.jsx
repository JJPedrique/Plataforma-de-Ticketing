import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Calendar, MapPin, Search, X } from 'lucide-react';
import { eventsApi, usersApi, venuesApi } from '../../../shared/api/adminApi';

const emptyForm = { title: '', description: '', organizer_id: '', venue_id: '', start_date: '', end_date: '', is_active: true };

function toInputDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function GestionEventos() {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const venuesById = useMemo(() => Object.fromEntries(venues.map(v => [v.id, v])), [venues]);
  const usersById = useMemo(() => Object.fromEntries(users.map(u => [u.id, u])), [users]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((ev) => {
      const venue = venuesById[ev.venue_id];
      const org = usersById[ev.organizer_id];
      const orgName = org ? `${org.first_name || ''} ${org.last_name || ''}`.trim() || org.email : '';
      const status = ev.is_active ? 'activo' : 'inactivo';
      return [ev.title, venue?.name, orgName, status].some((val) => String(val || '').toLowerCase().includes(q));
    });
  }, [items, search, venuesById, usersById]);

  const load = async () => {
    try {
      setLoading(true); setError('');
      const [ev, us, vs] = await Promise.all([eventsApi.list(), usersApi.list(), venuesApi.list()]);
      setItems(ev); setUsers(us); setVenues(vs);
    } catch (e) { setError(e.message || 'No se pudieron cargar los eventos.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (ev) => {
    setEditing(ev);
    setForm({
      title: ev.title || '', description: ev.description || '', organizer_id: ev.organizer_id || '', venue_id: ev.venue_id || '',
      start_date: toInputDateTime(ev.start_date), end_date: toInputDateTime(ev.end_date), is_active: ev.is_active !== false,
    });
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.venue_id || !form.organizer_id) {
      setError('Debes seleccionar un organizador y un lugar. Si no existen, créalos primero en sus gestores.');
      return;
    }
    try {
      setSaving(true); setError('');
      const payload = {
        ...form,
        organizer_id: Number(form.organizer_id),
        venue_id: Number(form.venue_id),
        start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
        end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
      };
      if (editing) await eventsApi.update(editing.id, payload); else await eventsApi.create(payload);
      setShowForm(false); await load();
    } catch (e2) { setError(e2.message || 'No se pudo guardar el evento.'); }
    finally { setSaving(false); }
  };

  const remove = async (ev) => {
    if (!window.confirm(`¿Eliminar el evento "${ev.title}"? Si tiene datos relacionados, se desactivará.`)) return;
    try { setError(''); await eventsApi.remove(ev.id); await load(); }
    catch (e) { setError(e.message || 'No se pudo eliminar el evento.'); }
  };

  const canCreate = users.length > 0 && venues.length > 0;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestión de Eventos</h1>
          <p className="text-gray-600 mt-1">Administra eventos conectados a la base de datos (requiere organizador y lugar).</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"><Plus className="w-4 h-4" /> Nuevo evento</button>
      </div>

      {error && <div className="mb-4 border border-red-200 bg-red-50 text-red-800 rounded-lg px-4 py-3">{error}</div>}

      {!loading && !canCreate && (
        <div className="mb-4 border border-amber-200 bg-amber-50 text-amber-900 rounded-lg px-4 py-3">
          Para crear eventos necesitas al menos un <strong>usuario/organizador</strong> y un <strong>lugar</strong> registrados. Si faltan, créalos primero en sus gestores.
        </div>
      )}

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-600">Cargando eventos...</div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900">No hay eventos registrados</h2>
          <p className="text-gray-600 mt-1 mb-4">Crea tu primer evento. Recuerda que debe estar asociado a un organizador y a un lugar existente.</p>
          <button onClick={openCreate} disabled={!canCreate} className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"><Plus className="w-4 h-4" /> Crear evento</button>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por título, lugar, organizador o estado..." className="w-full pl-9 pr-9 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
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
                <th className="text-left px-4 py-3 font-semibold">Título</th>
                <th className="text-left px-4 py-3 font-semibold">Lugar</th>
                <th className="text-left px-4 py-3 font-semibold">Organizador</th>
                <th className="text-left px-4 py-3 font-semibold">Inicio</th>
                <th className="text-left px-4 py-3 font-semibold">Estado</th>
                <th className="text-right px-4 py-3 font-semibold">Acciones</th>
              </tr></thead>
              <tbody>
                {filteredItems.map((ev) => {
                  const venue = venuesById[ev.venue_id];
                  const org = usersById[ev.organizer_id];
                  return (
                    <tr key={ev.id} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-gray-900 font-medium">{ev.title}</td>
                      <td className="px-4 py-3 text-gray-700"><span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{venue?.name || `Lugar #${ev.venue_id}`}</span></td>
                      <td className="px-4 py-3 text-gray-700">{org ? `${org.first_name || ''} ${org.last_name || ''}`.trim() || org.email : `Usuario #${ev.organizer_id}`}</td>
                      <td className="px-4 py-3 text-gray-700">{ev.start_date ? new Date(ev.start_date).toLocaleString() : '-'}</td>
                      <td className="px-4 py-3"><span className={`inline-flex px-2 py-1 rounded-md ${ev.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{ev.is_active ? 'Activo' : 'Inactivo'}</span></td>
                      <td className="px-4 py-3"><div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(ev)} className="p-2 rounded-md border border-gray-200 hover:bg-gray-50" title="Editar"><Pencil className="w-4 h-4" /></button>
                        <button onClick={() => remove(ev)} className="p-2 rounded-md border border-red-200 text-red-700 hover:bg-red-50" title="Eliminar/Desactivar"><Trash2 className="w-4 h-4" /></button>
                      </div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto" onClick={() => !saving && setShowForm(false)}>
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 my-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{editing ? 'Editar evento' : 'Crear evento'}</h2>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" rows={3} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organizador</label>
                  <select required value={form.organizer_id} onChange={(e) => setForm({ ...form, organizer_id: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Selecciona un organizador</option>
                    {users.filter(u => u.is_active).map(u => <option key={u.id} value={u.id}>{`${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email} ({u.role})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lugar</label>
                  <select required value={form.venue_id} onChange={(e) => setForm({ ...form, venue_id: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option value="">Selecciona un lugar</option>
                    {venues.filter(v => v.is_active).map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
                  <input type="datetime-local" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
                  <input type="datetime-local" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select value={String(form.is_active)} onChange={(e) => setForm({ ...form, is_active: e.target.value === 'true' })} className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option value="true">Activo</option><option value="false">Inactivo</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} disabled={saving} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-60">{saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
