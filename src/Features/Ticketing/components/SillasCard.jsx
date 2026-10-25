import { Armchair } from "lucide-react";

function SillasCard() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-amber-300 hover:shadow-md">
      {/* Icono con contenedor estilizado */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
        <Armchair className="size-6" />
      </div>

      {/* Información del asiento */}
      <div className="flex flex-1 flex-col gap-1 text-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {sections.name}
          </span>
          <span className="font-semibold text-slate-800">{Seccion}</span>
        </div>

        <div className="flex justify-between pt-1 text-slate-600">
          <div>
            <span className="text-xs text-slate-400">Fila: </span>
            <span className="font-medium text-slate-700">{physical_seats.row_identifier}</span>
          </div>
          <div>
            <span className="text-xs text-slate-400">Número: </span>
            <span className="font-medium text-slate-700">{physical_seats.seat_number}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SillasCard;