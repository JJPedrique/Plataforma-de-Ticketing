import { useState, useEffect } from 'react';
import { Calendar, MapPin, FileText, Type } from 'lucide-react';
import { seedData } from '../../../Data/Mock';

export function EventoForm({ evento, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    venue_id: '',
    is_active: true,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (evento) {
      setFormData({
        title: evento.title || '',
        description: evento.description || '',
        event_date: evento.event_date ? evento.event_date.slice(0, 16) : '',
        venue_id: evento.venue_id || '',
        is_active: evento.is_active !== false,
      });
    }
  }, [evento]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.event_date || !formData.venue_id) {
      setError('Todos los campos obligatorios deben ser completados');
      return;
    }

    onSubmit({
      ...formData,
      venue_id: parseInt(formData.venue_id),
    });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {evento ? 'Editar evento' : 'Crear nuevo evento'}
      </h2>
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
            Título del evento *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Type className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Final de Campeonato"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Descripción *
          </label>
          <div className="relative">
            <div className="absolute top-2.5 left-0 pl-3 pointer-events-none">
              <FileText className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe el evento..."
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="event_date" className="block text-sm font-medium text-gray-700 mb-1.5">
              Fecha y hora *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="datetime-local"
                id="event_date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="venue_id" className="block text-sm font-medium text-gray-700 mb-1.5">
              Recinto *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
              </div>
              <select
                id="venue_id"
                name="venue_id"
                value={formData.venue_id}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar recinto</option>
                {seedData.venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} - {venue.location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="w-4 h-4 text-amber-500 border-gray-300 rounded focus:ring-amber-500"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
            Evento activo
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
          >
            {evento ? 'Guardar cambios' : 'Crear evento'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-white text-gray-700 font-semibold py-2.5 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
