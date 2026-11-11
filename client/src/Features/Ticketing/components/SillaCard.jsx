import { Armchair } from "lucide-react";

function SillasCard({Data}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-amber-300 hover:shadow-md">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
        <Armchair className="size-6" />
      </div>

      <div className="flex flex-1 flex-col gap-1 text-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Zona:
          </span>
          <span className="font-semibold text-slate-800">{Data.zone}</span>
        </div>

        <div className="flex items-center justify-between pb-1">
          <div>
            <span className="font-medium text-slate-700">Fila: {Data.seat.row_label}</span>
            <span className="text-xs text-slate-400"> - </span>
            <span className="font-medium text-slate-700">Numero: {Data.seat.seat_number}</span>
          </div>
          <span className="font-semibold text-slate-800">{Data.price.toFixed(2)} $</span>
        </div>
      </div>
    </div>
  );
}

export default SillasCard;