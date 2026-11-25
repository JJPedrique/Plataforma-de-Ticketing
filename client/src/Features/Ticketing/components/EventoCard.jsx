import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { TicketingContext } from '../Context/TicketingContext';
import { EVENT_STATUS_FINISHED, EVENT_STATUS_LABELS, getEventStatus } from '../../../shared/validation/rules';

function resolveImageUrl(url) {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    // Google Imágenes: "Copiar enlace" suele traer la imagen real en imgurl.
    if (/(^|\.)google\.[a-z.]+$/.test(host)) {
      const direct = parsed.searchParams.get('imgurl');
      if (direct && /^https?:\/\//i.test(direct)) return direct;
    }

    // Wikipedia / Commons: la página "Archivo:" no es la imagen.
    if (/(^|\.)(wikipedia|wikimedia)\.org$/.test(host)) {
      const match = parsed.pathname.match(/^\/wiki\/(?:Archivo|File):(.+)$/i);
      if (match) {
        const fileName = decodeURIComponent(match[1]);
        return `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}`;
      }
    }

    // Cualquier otra URL se usa tal cual: el navegador decide según Content-Type,
    // no según la extensión del archivo.
    return url;
  } catch {
    return url;
  }
}

function EventoCard({Data, isDisabled=false, onClick}) {
  const { event } = useContext(TicketingContext);
  const imageUrl = resolveImageUrl(Data.venue?.img_url);
  const [imgError, setImgError] = useState(false);
  const eventStatus = getEventStatus(Data.start_date, Data.end_date);
  const finished = eventStatus === EVENT_STATUS_FINISHED;
  const selectable = !isDisabled && !finished;
  // Solo el selector marca el histórico; en métodos de pago el card se muestra normal.
  const dimmed = finished && !isDisabled;

  useEffect(() => { setImgError(false); }, [imageUrl]);

  return (
    <button type="button" disabled={!selectable} onClick={() => selectable && onClick(Data)}
      className={`group relative w-full text-left rounded-2xl border bg-white overflow-hidden transition-all duration-300 ${
        selectable ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-orange-200' : 'cursor-default'
      } ${
        dimmed ? 'opacity-75' : 'opacity-100'
      } ${
        Data.id===event?.id 
          ? 'border-orange-500 shadow-lg shadow-orange-500/10 ring-2 ring-orange-500/20' 
          : 'border-gray-200 shadow-md'
      }`}
    >
      {finished && (
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-gray-800 text-white text-xs font-semibold rounded-full shadow-lg">
          {EVENT_STATUS_LABELS[eventStatus]}
        </div>
      )}

      { Data.id===event?.id  && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
          <Ticket className="h-3.5 w-3.5" />
          Seleccionado
        </div>
      )}
      
      <div className="relative flex h-48 w-full items-center justify-center bg-linear-to-br from-orange-100 via-orange-50 to-amber-50 overflow-hidden">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={`Imagen de ${Data.venue?.name || 'lugar del evento'}`}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Ticket className="relative h-16 w-16 text-orange-500/40" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent"></div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold tracking-tight text-gray-900 line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
          {Data.title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
          <span className="truncate">{Data.venue?.name} • {Data.venue?.address}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>{Data.start_date ? Data.start_date.slice(0,10).split('-').reverse().join('/') : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <span>{Data.start_date ? Data.start_date.slice(11,16) : 'N/A'}</span>-
            <span>{Data.end_date ? Data.end_date.slice(11,16) : 'N/A'}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {Data.description}
        </p>
      </div>
    </button>
  );
}

export default EventoCard;