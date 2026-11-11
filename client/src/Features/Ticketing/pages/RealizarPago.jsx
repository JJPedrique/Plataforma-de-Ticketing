import { useState, useEffect, useContext } from 'react';
import { CreditCard, ShieldCheck, Ticket, } from 'lucide-react';
import Steps from '../components/Steps';
import EventoCard from '../components/EventoCard';
import SillasCard from '../components/SillaCard';
import { TicketingContext } from '../Context/TicketingContext';
import PagoCard from '../components/PagoCard';
import { GetPagosAll } from '../services/Pagos';

function RealizarPago({ onReservar }) {
  const [payMedthods,setPayMethods] = useState(GetPagosAll());
  const {event,seats,pay} = useContext(TicketingContext);
 
  const subtotal = seats.reduce((acc, a) => acc + a.price, 0);
  const comision = subtotal*0.01;
  const total = subtotal + comision;

  return (
    <>
      <div className="mb-6">
        <Steps Number='3' Text='Realizar pago' />
        <p className="ml-16 -mt-4 text-sm text-gray-600">Selecciona tu método de pago y confirma tu compra</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className="lg:col-span-1 space-y-4">
          
          <EventoCard Data={event} isDisabled={true}/>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className='font-semibold text-gray-900 flex items-center gap-2'>
                <Ticket className="h-4 w-4 text-orange-500" /> Asientos seleccionados
              </h2>
            </div>
            <div className="p-4">
              <div className={`${seats.length > 3 ? 'max-h-65 overflow-y-auto pr-1' : ''} space-y-2 mb-4`}>
                {seats.map((i) => (<SillasCard key={i.seat.id} Data={i}/>))}
              </div>
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Comisión</span><span>${comision.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total a pagar</span><span className="text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className='font-semibold text-gray-900 flex items-center gap-2'>
                <CreditCard className="h-4 w-4 text-orange-500" />Método de pago
              </h2>
              <p className="text-sm text-gray-600 mt-1">Selecciona el método de pago de tu preferencia</p>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {payMedthods.map(method =><PagoCard key={method.id} Data={method}/>)}
              </div>

              {pay && 
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">Pago seguro</p>
                      <p className="text-xs text-orange-700 mt-1"> Los asientos se mantendrán reservados por 5 minutos una vez iniciado el pago </p>
                    </div>
                  </div>
                </div>
              }

              <button
                disabled={!pay}
                className={`w-full mt-6 py-3 px-4 rounded-xl font-semibold transition-all ${
                  pay ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}>
                Continuar con el pago
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RealizarPago;