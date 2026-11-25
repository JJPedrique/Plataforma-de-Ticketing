import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CalendarDays, Lock, MapPin, Palette, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { eventsApi, eventZonePricesApi, venuesApi } from '../../../shared/api/adminApi';
import { useAuth } from '../../Auth/Context/AuthContext';
import Modal from '../../../shared/components/Modal';
import { normalizeRole, ROLES } from '../../../shared/constants/roles';
import { COLOR_CODE_MAX_LENGTH, HEX_COLOR_REGEX, ZONE_NAME_MAX_LENGTH } from '../../../shared/validation/rules';

const emptyForm = { name: '', color_code: '#F97316', is_active: true, seat_count: 20, price: '' };
const inputClassName = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors';


function formatMoney(value) {
  return `$${Number(value || 0).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function GestionZonasPrecios() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const isAdmin = normalizeRole(user?.role) === ROLES.ADMIN;

  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(searchParams.get('evento') || '');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const lockedByTickets = Boolean(editing?.has_tickets);
  const readOnlyClass = lockedByTickets ? ' bg-gray-100 cursor-not-allowed' : '';

  const venuesById = useMemo(() => Object.fromEntries(venues.map((v) => [v.id, v])), [venues]);

  const visibleEvents = useMemo(() => {
    if (isAdmin || !user?.id) return events;
    return events.filter((ev) => String(ev.organizer_id) === String(user.id));
  }, [events, isAdmin, user?.id]);

  const selectedEvent = useMemo(
    () => visibleEvents.find((ev) => String(ev.id) === String(selectedEventId)) || null,
    [visibleEvents, selectedEventId]
  );
  const selectedVenue = selectedEvent ? venuesById[selectedEvent.venue_id] : null;

  const loadBase = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [ev, vs] = await Promise.all([eventsApi.list(), venuesApi.list()]);
      setEvents(ev);
      setVenues(vs);
    } catch (e) {
      setError(e.message || 'No se pudieron cargar los eventos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBase(); }, [loadBase]);

  useEffect(() => {
    if (!selectedEventId && visibleEvents.length) {
      setSelectedEventId(String(visibleEvents[0].id));
      return;
    }
    if (selectedEventId && !visibleEvents.some((ev) => String(ev.id) === String(selectedEventId))) {
      setSelectedEventId(visibleEvents[0] ? String(visibleEvents[0].id) : '');
    }
  }, [visibleEvents, selectedEventId]);

  const loadDetail = useCallback(async () => {
    if (!selectedEvent) {
      setRows([]);
      return;
    }
    try {
      setDetailLoading(true);
      setError('');
      setRows(await eventZonePricesApi.list(selectedEvent.id));
    } catch (e) {
      setError(e.message || 'No se pudieron cargar las zonas y precios.');
    } finally {
      setDetailLoading(false);
    }
  }, [selectedEvent]);

  useEffect(() => { loadDetail(); }, [loadDetail]);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || '',
      color_code: row.color_code || '',
      is_active: row.is_active !== false,
      seat_count: row.seat_count ?? 0,
      price: String(row.price ?? ''),
    });
    setFormError('');
    setShowModal(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!selectedEvent) { setFormError('Seleccione un evento primero.'); return; }

    const name = form.name.trim();
    if (!name) { setFormError('El nombre de la zona es obligatorio.'); return; }
    if (name.length > 100) { setFormError('El nombre no puede superar los 100 caracteres.'); return; }

    const color = form.color_code.trim();
    if (color && !HEX_COLOR_REGEX.test(color)) {
      setFormError('El color debe ser hexadecimal, por ejemplo #F97316.');
      return;
    }

    const seatCount = Number(form.seat_count);
    if (!Number.isInteger(seatCount) || seatCount < 0 || seatCount > 500) {
      setFormError('El número de sillas debe estar entre 0 y 500.');
      return;
    }

    const normalizedPrice = String(form.price).replace(',', '.').trim();
    const price = Number(normalizedPrice);
    if (!Number.isFinite(price) || price < 0) {
      setFormError('Ingrese un precio válido mayor o igual a cero.');
      return;
    }
    if (price > 99999999.99) {
      setFormError('El precio no puede superar 99.999.999,99.');
      return;
    }

    const duplicated = rows.some(
      (r) => r.id !== editing?.id && String(r.name || '').trim().toLowerCase() === name.toLowerCase()
    );
    if (duplicated) {
      setFormError('Ya existe una zona con ese nombre en este evento.');
      return;
    }

    try {
      setSaving(true);
      setFormError('');
      const common = {
        name,
        color_code: color || null,
      };
      if (!lockedByTickets) {
        common.is_active = form.is_active;
        common.seat_count = seatCount;
        common.price = price;
      }
      const payload = editing ? common : { event_id: selectedEvent.id, ...common };
      if (editing) await eventZonePricesApi.update(editing.id, payload);
      else await eventZonePricesApi.create(payload);
      setShowModal(false);
      await loadDetail();
    } catch (e2) {
      setFormError(e2.message || 'No se pudo guardar la zona y su precio.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`¿Desactivar la zona "${row.name || `#${row.id}`}"? No aparecerá en el mapa del Ticketing.`)) return;
    try {
      setError('');
      await eventZonePricesApi.remove(row.id);
      await loadDetail();
    } catch (e) {
      setError(e.message || 'No se pudo desactivar la zona.');
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-600">Cargando gestor...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Gestor de Zonas y Precios</h1>
          <p className="text-gray-600 mt-1">
            Cada zona tiene un único precio por evento. Edite ambos en una sola fila.
          </p>
        </div>
        <button onClick={loadDetail} disabled={!selectedEvent || detailLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${detailLoading ? 'animate-spin' : ''}`} /> Actualizar
        </button>
      </div>

      {error && <div className="mb-4 border border-red-200 bg-red-50 text-red-800 rounded-lg px-4 py-3">{error}</div>}

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <label htmlFor="manager-event" className="block text-sm font-medium text-gray-700 mb-1.5">
          Evento a configurar
        </label>
        <select id="manager-event" value={selectedEventId}
          onChange={(e) => { setSelectedEventId(e.target.value); setRows([]); }}
          className={inputClassName} disabled={!visibleEvents.length}>
          {!visibleEvents.length && <option value="">No hay eventos disponibles</option>}
          {visibleEvents.map((ev) => (
            <option key={ev.id} value={String(ev.id)}>
              {ev.title} — {venuesById[ev.venue_id]?.name || `Lugar #${ev.venue_id}`}
            </option>
          ))}
        </select>
        {selectedVenue && (
          <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-orange-500" />
            Lugar del evento: <span className="font-medium text-gray-900">{selectedVenue.name}</span>
            {selectedVenue.city && <span className="text-gray-500">({selectedVenue.city})</span>}
          </p>
        )}
      </div>

      {!visibleEvents.length ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <CalendarDays className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900">No tienes eventos para configurar</h2>
          <p className="text-gray-600 mt-1">
            Crea un evento en el gestor de eventos y luego vuelve aquí para definir sus zonas y precios.
          </p>
        </div>
      ) : detailLoading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-600">Cargando zonas y precios...</div>
      ) : (
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between gap-3 p-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Zonas y precios del evento</h2>
              <p className="text-xs text-gray-500 mt-0.5">Una fila por zona, con su precio asignado.</p>
            </div>
            <button onClick={openCreate}
              className="inline-flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
              <Plus className="w-4 h-4" /> Nueva zona y precio
            </button>
          </div>

          {rows.length === 0 ? (
            <div className="p-8 text-center">
              <Palette className="w-9 h-9 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-900 font-medium">Todavía no hay zonas con precio</p>
              <p className="text-gray-600 text-sm mt-1">Cree la primera fila para definir zona, color, estado y precio.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Zona</th>
                    <th className="text-left px-4 py-3 font-semibold">Color</th>
                    <th className="text-left px-4 py-3 font-semibold">Sillas</th>
                    <th className="text-left px-4 py-3 font-semibold">Precio</th>
                    <th className="text-left px-4 py-3 font-semibold">Estado</th>
                    <th className="text-right px-4 py-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-gray-900 font-medium">
                        <span className="inline-flex items-center gap-1.5">
                          {row.name || `Zona #${row.zone_id}`}
                          {row.has_tickets && (
                            <Lock className="w-3.5 h-3.5 text-amber-600" title="Tiene reservas o ventas activas" />
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 text-gray-700">
                          <span className="w-4 h-4 rounded border border-gray-300" style={{ backgroundColor: row.color_code || '#e5e7eb' }} />
                          {row.color_code || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{row.seat_count ?? 0}</td>
                      <td className="px-4 py-3 text-gray-700 font-semibold">{formatMoney(row.price)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex px-2 py-1 rounded-md ${row.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {row.is_active !== false ? 'Activa' : 'Inactiva'}
                          </span>
                          {row.has_tickets && (
                            <span className="inline-flex px-2 py-1 rounded-md bg-amber-100 text-amber-800">Con tickets</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openEdit(row)} className="p-2 rounded-md border border-gray-200 hover:bg-gray-50" title="Editar">
                            <Pencil className="w-4 h-4" />
                          </button>
                          {row.is_active !== false && (
                            <button onClick={() => remove(row)} disabled={row.has_tickets}
                              className="p-2 rounded-md border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                              title={row.has_tickets ? 'No se puede desactivar: tiene reservas o ventas activas' : 'Desactivar'}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => !saving && setShowModal(false)}
        title={editing ? 'Editar zona y precio' : 'Nueva zona y precio'}
        footer={
          <>
            <button type="button" onClick={() => setShowModal(false)} disabled={saving}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" form="zone-price-form" disabled={saving}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </>
        }
      >
        <form id="zone-price-form" onSubmit={save} className="space-y-4" noValidate>
          {formError && <div className="border border-red-200 bg-red-50 text-red-800 rounded-lg px-3 py-2 text-sm">{formError}</div>}
          {lockedByTickets && (
            <div className="border border-amber-200 bg-amber-50 text-amber-900 rounded-lg px-3 py-2 text-sm">
              Esta zona tiene reservas o ventas activas. Solo puedes cambiar nombre y color; precio, sillas, estado y desactivación están bloqueados.
            </div>
          )}
          <div>
            <label htmlFor="zone-name" className="block text-sm font-medium text-gray-700 mb-1.5">Nombre de la zona</label>
            <input id="zone-name" value={form.name} maxLength={ZONE_NAME_MAX_LENGTH}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej. Platea" className={inputClassName} />
          </div>
          <div>
            <label htmlFor="zone-color" className="block text-sm font-medium text-gray-700 mb-1.5">Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={HEX_COLOR_REGEX.test(form.color_code) ? form.color_code : '#F97316'}
                onChange={(e) => setForm({ ...form, color_code: e.target.value })}
                className="w-12 h-10 p-1 border border-gray-200 rounded-lg bg-white cursor-pointer" aria-label="Selector de color" />
              <input id="zone-color" value={form.color_code} maxLength={COLOR_CODE_MAX_LENGTH}
                onChange={(e) => setForm({ ...form, color_code: e.target.value })}
                placeholder="#F97316" className={inputClassName} />
            </div>
          </div>
          <div>
            <label htmlFor="zone-seats" className="block text-sm font-medium text-gray-700 mb-1.5">Número de sillas</label>
            <input id="zone-seats" type="number" min="0" max="500" step="1" value={form.seat_count}
              onChange={(e) => setForm({ ...form, seat_count: e.target.value })}
              placeholder="20" disabled={lockedByTickets} className={`${inputClassName}${readOnlyClass}`} />
            <p className="mt-1 text-xs text-gray-500">Se distribuyen automáticamente en el mapa. Si las últimas tienen reserva, la reducción se rechaza.</p>
          </div>
          <div>
            <label htmlFor="zone-price" className="block text-sm font-medium text-gray-700 mb-1.5">Precio</label>
            <input id="zone-price" type="number" step="0.01" min="0" max="99999999.99" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="0.00" disabled={lockedByTickets} className={`${inputClassName}${readOnlyClass}`} />
          </div>
          <div>
            <label htmlFor="zone-status" className="block text-sm font-medium text-gray-700 mb-1.5">Estado</label>
            <select id="zone-status" value={String(form.is_active)}
              onChange={(e) => setForm({ ...form, is_active: e.target.value === 'true' })}
              disabled={lockedByTickets} className={`${inputClassName}${readOnlyClass}`}>
              <option value="true">Activa</option>
              <option value="false">Inactiva</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
}
