import { useState } from 'react';
import { Map, Grid3x3, Plus, X } from 'lucide-react';
import { seedData } from '../../../Data/Mock';

export function MapaRecinto({ venueId, onClose }) {
  const [selectedSection, setSelectedSection] = useState(null);
  const venue = seedData.venues.find((v) => v.id === venueId);
  const sections = seedData.sections.filter((s) => s.venue_id === venueId);

  if (!venue) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Map className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Mapa del Recinto</h2>
              <p className="text-sm text-gray-600">{venue.name} - {venue.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <Map className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">Mapa Vectorial (SVG/Canvas)</p>
              <p className="text-xs text-gray-500 mb-4">
                {venue.svg_layout_url || 'Sin mapa configurado'}
              </p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Plus className="h-4 w-4" />
                Cargar mapa
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Grid3x3 className="h-5 w-5 text-gray-700" />
              <h3 className="font-semibold text-gray-900">Zonas y Sectores</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sections.length > 0 ? (
                sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedSection(section)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      selectedSection?.id === section.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">{section.name}</p>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {section.capacity} asientos
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">Sector configurado</p>
                  </button>
                ))
              ) : (
                <p className="col-span-2 text-sm text-gray-500 text-center py-4">
                  No hay secciones configuradas para este recinto
                </p>
              )}
            </div>
          </div>

          {selectedSection && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <p className="text-sm font-medium text-orange-900 mb-1">
                Sección seleccionada: {selectedSection.name}
              </p>
              <p className="text-xs text-orange-700">
                Capacidad: {selectedSection.capacity} asientos • ID: {selectedSection.id}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
