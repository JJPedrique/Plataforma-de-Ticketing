import { useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Calendar, MapPin, Search, X } from 'lucide-react';
import { eventsApi, usersApi, venuesApi } from '../../../shared/api/adminApi';

const emptyForm = { title: '', description: '', organizer_id: '', venue_id: '', start_date: '', end_date: '', is_active: true };

const inputClassName = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors';

// Roles permitidos para ser asignados como organizador de un evento.
// Modificar este arreglo para ampliar o restringir el filtro (ej. ['organizer', 'admin']).
const EVENT_ORGANIZER_ROLES = ['organizer'];

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
  const [modalError, setModalError] = useState('');
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

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalError(''); setShowForm(true); };
  const openEdit = (ev) => {
    setEditing(ev);
    setForm({
      title: ev.title || '', description: ev.description || '', organizer_id: ev.organizer_id || '', venue_id: ev.venue_id || '',
      start_date: toInputDateTime(ev.start_date), end_date: toInputDateTime(ev.end_date), is_active: ev.is_active !== false,
    });
    setModalError('');
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setModalError('El título del evento es obligatorio.');
      return;
    }
    if (!form.venue_id || !form.organizer_id) {
      setModalError('Seleccione un organizador y un lugar. Si no existen, créelos primero en sus gestores.');
      return;
    }
    if (form.start_date && form.end_date && new Date(form.start_date) >= new Date(form.end_date)) {
      setModalError('La fecha y hora de inicio debe ser anterior a la fecha y hora de fin.');
      return;
    }
    try {
      setSaving(true); setModalError('');
      const payload = {
        title,
        description: form.description.trim(),
        organizer_id: Number(form.organizer_id),
        venue_id: Number(form.venue_id),
        start_date: form.start_date ? new Date(form.start_date).toISOString() : null,
        end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
        is_active: form.is_active,
      };
      if (editing) await eventsApi.update(editing.id, payload); else await eventsApi.create(payload);
      setShowForm(false); await load();
    } catch (e2) { setModalError(e2.message || 'No se pudo guardar el evento.'); }
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
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto" onClick={() => !saving && (setShowForm(false), setModalError(''))}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 my-4" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="evento-modal-title">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 id="evento-modal-title" className="text-xl font-semibold text-gray-900">{editing ? 'Editar evento' : 'Crear evento'}</h2>
                <p className="text-sm text-gray-600 mt-1">Configura la información del evento, su organizador, lugar y horario.</p>
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
                <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-1.5">Título del evento</label>
                <input id="event-title" name="title" required aria-required="true" aria-label="Título del evento" placeholder="Ej. Concierto de verano" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClassName} />
              </div>
              <div>
                <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                <textarea id="event-description" name="description" aria-label="Descripción del evento" placeholder="Describe brevemente el evento, artistas, actividades o detalles relevantes" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClassName} rows={3} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="event-organizer" className="block text-sm font-medium text-gray-700 mb-1.5">Organizador</label>
                  <select id="event-organizer" name="organizer_id" required aria-required="true" aria-label="Organizador del evento" value={form.organizer_id} onChange={(e) => setForm({ ...form, organizer_id: e.target.value })} className={inputClassName}>
                    <option value="">Selecciona un organizador</option>
                    {users
                      .filter((u) => {
                        const role = String(u.role || '').toLowerCase();
                        const allowedRoles = EVENT_ORGANIZER_ROLES.map((r) => String(r).toLowerCase());
                        const isAllowedRole = allowedRoles.includes(role);
                        const isCurrentSelection = editing && String(u.id) === String(form.organizer_id);
                        return u.is_active && (isAllowedRole || isCurrentSelection);
                      })
                      .map(u => <option key={u.id} value={u.id}>{`${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email} ({u.role})</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="event-venue" className="block text-sm font-medium text-gray-700 mb-1.5">Lugar</label>
                  <select id="event-venue" name="venue_id" required aria-required="true" aria-label="Lugar del evento" value={form.venue_id} onChange={(e) => setForm({ ...form, venue_id: e.target.value })} className={inputClassName}>
                    <option value="">Selecciona un lugar</option>
                    {venues.filter(v => v.is_active).map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="event-start" className="block text-sm font-medium text-gray-700 mb-1.5">Fecha y hora de inicio</label>
                  <input id="event-start" name="start_date" type="datetime-local" aria-label="Fecha y hora de inicio" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className={inputClassName} />
                </div>
                <div>
                  <label htmlFor="event-end" className="block text-sm font-medium text-gray-700 mb-1.5">Fecha y hora de fin</label>
                  <input id="event-end" name="end_date" type="datetime-local" aria-label="Fecha y hora de fin" min={form.start_date || undefined} value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className={inputClassName} />
                </div>
              </div>
              <div>
                <label htmlFor="event-status" className="block text-sm font-medium text-gray-700 mb-1.5">Estado</label>
                <select id="event-status" name="is_active" aria-label="Estado del evento" value={String(form.is_active)} onChange={(e) => setForm({ ...form, is_active: e.target.value === 'true' })} className={inputClassName}>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={() => !saving && (setShowForm(false), setModalError(''))} disabled={saving} className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700">Cancelar</button>
                <button type="submit" disabled={saving || !canCreate} className="px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-60 font-medium">{saving ? 'Guardando...' : (editing ? 'Guardar cambios' : 'Crear evento')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
