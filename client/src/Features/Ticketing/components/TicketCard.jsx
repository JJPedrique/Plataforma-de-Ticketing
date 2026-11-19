import React, { useState, useMemo, useRef } from 'react';
import { Receipt, Calendar, Clock, MapPin, Ticket, CreditCard, CheckCircle2, Copy, Check, Printer, LayoutGrid, Hash, Eye, X,} from 'lucide-react';
import { useReactToPrint } from "react-to-print";

function TicketCard({ order }) {
  const [copied, setCopied] = useState(false);
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Formateadores de fecha/hora respetando la zona horaria del evento (-04:00)
  const formatDate = (isoString) =>
    new Intl.DateTimeFormat('es-VE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Caracas',
    }).format(new Date(isoString));

  const formatTime = (isoString) =>
    new Intl.DateTimeFormat('es-VE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Caracas',
    }).format(new Date(isoString));

  const formatDateTime = (isoString) =>
    new Intl.DateTimeFormat('es-VE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'America/Caracas',
    }).format(new Date(isoString));

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(amount));

  // Cálculos financieros y ordenamiento de tickets
  const { sortedTickets, subtotal, serviceFee, total, zoneSummary } = useMemo(() => {
    const sorted = [...order.tickets].sort((a, b) => {
      if (a.zone_name !== b.zone_name) return a.zone_name.localeCompare(b.zone_name);
      if (a.row_label !== b.row_label) return a.row_label.localeCompare(b.row_label);
      return Number(a.seat_number) - Number(b.seat_number);
    });

    const sub = order.tickets.reduce((acc, t) => acc + parseFloat(t.price), 0);
    const tot = parseFloat(order.total_amount);
    const fee = Math.max(0, +(tot - sub).toFixed(2));

    // Resumen agrupado por zona
    const zonesMap = order.tickets.reduce((acc, t) => {
      if (!acc[t.zone_name]) {
        acc[t.zone_name] = {
          zone_name: t.zone_name,
          zone_color: t.zone_color,
          count: 0,
          subtotal: 0,
        };
      }
      acc[t.zone_name].count += 1;
      acc[t.zone_name].subtotal += parseFloat(t.price);
      return acc;
    }, {});

    return {
      sortedTickets: sorted,
      subtotal: sub,
      serviceFee: fee,
      total: tot,
      zoneSummary: Object.values(zonesMap),
    };
  }, [order]);

  const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
      contentRef: componentRef,
      documentTitle: "Documento_Impreso",
    });


  const handleCopyReference = () => {
    navigator.clipboard.writeText(order.payment_reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={componentRef} className="w-full mx-auto bg-white rounded-2xl shadow-lg border border-slate-200/90 overflow-hidden text-slate-800 print:shadow-none print:border-slate-300">
      {/* 1. CABECERA DE FACTURA / COMPROBANTE */}
      <div className="bg-slate-900 text-white px-6 py-5 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 bg-orange-500/20 border border-orange-400/30 rounded-xl text-orange-300 shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-300">
                Comprobante de Orden
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Pagado
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
              Orden #{String(order.order_id).padStart(4, '0')}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Emitido el {formatDateTime(order.completed_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center print:hidden">
          <button
            type="button"
            onClick={() => handlePrint()}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir / PDF
          </button>
        </div>
      </div>

      {/* 2. DETALLES DEL EVENTO Y RECINTO */}
      <div className="p-6 sm:p-8 border-b border-slate-200 bg-linear-to-b from-slate-50/80 to-white">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2.5 flex-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
              <Hash className="w-3.5 h-3.5" />
              Evento ID: {order.event_id}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {order.event_title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {order.event_description}
            </p>
          </div>

          {/* Miniatura / Acceso al mapa de asientos (venue_img_url) */}
          {order.venue_img_url && (
            <div className="shrink-0 w-full md:w-44">
              <button
                type="button"
                onClick={() => setShowVenueModal(true)}
                className="group relative w-full h-28 rounded-xl border border-slate-200 bg-slate-100 overflow-hidden flex flex-col items-center justify-center text-slate-500 hover:border-orange-400 transition-all cursor-pointer"
              >
                {!imgError ? (
                  <img
                    src={order.venue_img_url}
                    alt={`Mapa de sala - ${order.venue_name}`}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 p-2 text-center">
                    <LayoutGrid className="w-6 h-6 text-orange-500" />
                    <span className="text-[11px] font-medium text-slate-600">
                      Layout de Sala
                    </span>
                  </div>
                )}
                <span className="absolute inset-x-0 bottom-0 bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-medium py-1 px-2 flex items-center justify-center gap-1">
                  <Eye className="w-3 h-3" />
                  Ver plano del recinto
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Grid de Fecha, Hora y Ubicación */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-200/80">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600 shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Fecha y Horario
              </p>
              <p className="text-sm font-semibold text-slate-800 capitalize mt-0.5">
                {formatDate(order.event_start_date)}
              </p>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {formatTime(order.event_start_date)} – {formatTime(order.event_end_date)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600 shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Recinto / Ubicación
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                {order.venue_name}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                {order.venue_address}, <span className="font-medium">{order.venue_city}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DETALLE DE ENTRADAS Y ASIENTOS RESERVADOS */}
      <div className="p-6 sm:p-8 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-orange-600" />
            <h3 className="text-base font-bold text-slate-900">
              Entradas y Asientos Reservados ({order.tickets.length})
            </h3>
          </div>

          {/* Resumen rápido de zonas */}
          <div className="flex flex-wrap gap-2">
            {zoneSummary.map((zone) => (
              <span
                key={zone.zone_name}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: zone.zone_color }}
                />
                {zone.count}× {zone.zone_name}
              </span>
            ))}
          </div>
        </div>

        {/* Tabla responsiva de tickets individuales */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Zona</th>
                <th className="py-3 px-4">Ubicación</th>
                <th className="py-3 px-4 text-right">Precio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {sortedTickets.map((ticket) => (
                <tr
                  key={ticket.ticket_id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-500">
                    #{ticket.ticket_id}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold"
                      style={{
                        backgroundColor: `${ticket.zone_color}14`,
                        color: ticket.zone_color,
                        border: `1px solid ${ticket.zone_color}30`,
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: ticket.zone_color }}
                      />
                      {ticket.zone_name}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-xs">
                        Fila {ticket.row_label}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-semibold text-xs">
                        Asiento {ticket.seat_number}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-slate-800">
                    {formatCurrency(ticket.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. INFORMACIÓN DE PAGO Y TOTALES */}
      <div className="p-6 sm:p-8 bg-slate-50/70 flex flex-col md:flex-row justify-between gap-6">
        {/* Método y Referencia */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <CreditCard className="w-4 h-4 text-slate-500" />
            Detalles de la Transacción
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200/90 space-y-2.5">
            <div>
              <span className="text-xs text-slate-500 block">Método de pago</span>
              <span className="text-sm font-semibold text-slate-800">
                {order.payment_method}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs text-slate-500 block">Referencia de pago</span>
                <code className="text-xs sm:text-sm font-mono font-bold text-orange-700">
                  {order.payment_reference}
                </code>
              </div>

              <button
                type="button"
                onClick={handleCopyReference}
                title="Copiar referencia"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer print:hidden"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desglose Económico */}
        <div className="w-full md:w-72 bg-white p-5 rounded-xl border border-slate-200/90 flex flex-col justify-between space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal ({order.tickets.length} entradas)</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>

            {serviceFee > 0 && (
              <div className="flex justify-between text-slate-600">
                <span>Cargos por servicio</span>
                <span className="font-medium">{formatCurrency(serviceFee)}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-dashed border-slate-300 flex items-baseline justify-between">
            <span className="text-sm font-bold text-slate-900">Total Pagado</span>
            <span className="text-2xl font-extrabold text-orange-600">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>

      {/* MODAL PARA VISUALIZAR EL LAYOUT DEL RECINTO (venue_img_url) */}
      {showVenueModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowVenueModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900">
                  Plano de Asientos — {order.venue_name}
                </h4>
                <p className="text-xs text-slate-500">{order.venue_address}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowVenueModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-50 flex flex-col items-center justify-center min-h-260px">
              {!imgError ? (
                <img
                  src={order.venue_img_url}
                  alt={`Plano de ${order.venue_name}`}
                  onError={() => setImgError(true)}
                  className="max-h-[60vh] rounded-lg object-contain"
                />
              ) : (
                <div className="text-center space-y-2 py-8">
                  <LayoutGrid className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-sm font-medium text-slate-700">
                    No se pudo cargar la imagen del mapa
                  </p>
                  <p className="text-xs text-slate-500 font-mono break-all">
                    {order.venue_img_url}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketCard;