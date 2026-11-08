import { useState } from 'react';
import { DollarSign, Plus, Edit2 } from 'lucide-react';
import { seedData } from '../../../Data/Mock';

export function PreciosZona({ venueId, onClose }) {
  const [precios, setPrecios] = useState(() => {
    const sections = seedData.sections.filter((s) => s.venue_id === venueId);
    return sections.map((section) => ({
      sectionId: section.id,
      sectionName: section.name,
      precio: Math.floor(Math.random() * 100) + 30,
    }));
  });

  const venue = seedData.venues.find((v) => v.id === venueId);

  const handlePrecioChange = (sectionId, value) => {
    setPrecios(
      precios.map((p) => (p.sectionId === sectionId ? { ...p, precio: parseFloat(value) || 0 } : p))
    );
  };

  if (!venue) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Configuración de Precios por Zona</h2>
              <p className="text-sm text-gray-600">{venue.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <Plus className="h-5 w-5 text-gray-500 rotate-45" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Asigna diferentes categorías de precios a las distintas zonas o secciones del recinto.
          </p>

          <div className="space-y-3">
            {precios.length > 0 ? (
              precios.map((item) => (
                <div
                  key={item.sectionId}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.sectionName}</p>
                    <p className="text-xs text-gray-500">Sección ID: {item.sectionId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={item.precio}
                        onChange={(e) => handlePrecioChange(item.sectionId, e.target.value)}
                        className="w-28 pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No hay secciones para configurar precios
              </p>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-colors"
            >
              Guardar precios
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-white text-gray-700 font-semibold py-2.5 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
