import { Calendar, Clock, MapPin, ImageOff } from 'lucide-react';
import { useState } from 'react';

function EventoCard({event, venue}) {
  const [selected, isSelected] = useState(false)
  
  return (
    <button onClick={()=>isSelected(!selected)}
    className={`${selected && 'ring-2 ring-amber-500'} w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl`}>
      {/* Contenedor de la Imagen / Placeholder */}
      <div className="flex h-48 w-full flex-col items-center justify-center rounded-xl bg-gray-100 text-gray-400">
        <ImageOff className="mb-2 h-10 w-10 stroke-[1.5]" />
        <span className="text-xs font-medium">Sin imagen disponible</span>
      </div>

      {/* Contenido principal */}
      <div className="mt-5">
        {/* Título del evento */}
        <h1 className="text-xl font-bold tracking-tight text-gray-900">
          {event.title}
        </h1>

        {/* Ubicación */}
        <div className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-amber-600">
          <MapPin className="h-4 w-4" />
          <h2>{venue.name} | {venue.location}</h2>
        </div>

        {/* Fecha y Hora */}
        <div className="mt-3 flex items-center gap-4 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <span>{`${event.event_date}`.slice(11,19)}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>{`${event.event_date}`.slice(0,10)}</span>
          </div>
        </div>

        {/* Descripción */}
        <p className="mt-4 text-sm leading-relaxed text-gray-600 line-clamp-3">
          {event.description}
        </p>

      </div>
    </button>
  );
}

export default EventoCard;