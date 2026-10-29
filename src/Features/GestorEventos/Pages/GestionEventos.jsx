import { useState } from 'react';
import { Plus, Edit2, Trash2, Map, DollarSign, Calendar, MapPin } from 'lucide-react';
import { eventos, addEvento, updateEvento, deleteEvento } from '../data/eventos';
import { EventoForm } from '../components/EventoForm';
import { MapaRecinto } from '../components/MapaRecinto';
import { PreciosZona } from '../components/PreciosZona';

function GestionEventos() {
  const [eventosList, setEventosList] = useState([...eventos]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvento, setEditingEvento] = useState(null);
  const [showMapa, setShowMapa] = useState(false);
  const [showPrecios, setShowPrecios] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState(null);

  const handleCreate = () => {
    setEditingEvento(null);
    setShowForm(true);
  };

  const handleEdit = (evento) => {
    setEditingEvento(evento);
    setShowForm(true);
  };

  const handleSubmit = (formData) => {
    if (editingEvento) {
      const updated = updateEvento(editingEvento.id, formData);
      if (updated) {
        setEventosList([...eventos]);
      }
    } else {
      addEvento(formData);
      setEventosList([...eventos]);
    }
    setShowForm(false);
    setEditingEvento(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvento(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de dar de baja este evento?')) {
      deleteEvento(id);
      setEventosList([...eventos]);
    }
  };

  const handleConfigMapa = (venueId) => {
    setSelectedVenueId(venueId);
    setShowMapa(true);
  };

  const handleConfigPrecios = (venueId) => {
    setSelectedVenueId(venueId);
    setShowPrecios(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gestión de Eventos</h1>
          <p className="mt-1 text-sm text-gray-600">
            Crear, editar y gestionar eventos deportivos y conciertos
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo evento
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <EventoForm evento={editingEvento} onSubmit={handleSubmit} onCancel={handleCancel} />
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Evento
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Recinto
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Fecha y Hora
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Estado
                </th>
                <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {eventosList.map((evento) => (
                <tr key={evento.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{evento.title}</p>
                      <p className="text-sm text-gray-500 line-clamp-1">{evento.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-700">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{evento.venue?.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>
                        {evento.event_date ? new Date(evento.event_date).toLocaleString('es-ES') : 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        evento.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {evento.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleConfigMapa(evento.venue_id)}
                        className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Configurar mapa de recinto"
                        aria-label="Configurar mapa de recinto"
                      >
                        <Map className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleConfigPrecios(evento.venue_id)}
                        className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Configurar precios por zona"
                        aria-label="Configurar precios por zona"
                      >
                        <DollarSign className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(evento)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar evento"
                        aria-label="Editar evento"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(evento.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Dar de baja evento"
                        aria-label="Dar de baja evento"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showMapa && selectedVenueId && (
        <MapaRecinto venueId={selectedVenueId} onClose={() => setShowMapa(false)} />
      )}
      {showPrecios && selectedVenueId && (
        <PreciosZona venueId={selectedVenueId} onClose={() => setShowPrecios(false)} />
      )}
    </div>
  );
}

export default GestionEventos;
