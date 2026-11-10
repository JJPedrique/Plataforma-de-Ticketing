import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CreditCard, ShieldCheck, Ticket, Timer, ArrowLeft, Lock } from 'lucide-react';
import Steps from '../components/Steps';
import {seedData} from '../../../Data/Mock';
import EventoCard from '../components/EventoCard';
import SillasCard from '../components/SillaCard';

function RealizarPago({event, seats = [], onReservar }) {

  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(300);
  
  const asientosSeleccionados = seats.length > 0 ? seats : [
    { fila: 'A', asiento: '12', precio: 85.00 },
    { fila: 'A', asiento: '13', precio: 85.00 },
  ];
  
  const subtotal = asientosSeleccionados.reduce((acc, a) => acc + a.precio, 0);
  const comision = 0;
  const total = subtotal + comision;

  useEffect(() => {
    if (mostrarFormulario && tiempoRestante > 0) {
      const timer = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mostrarFormulario, tiempoRestante]);

  const formatearTiempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  };

  const handleContinuarPago = () => {
    if (metodoSeleccionado) {
      setMostrarFormulario(true);
    }
  };

  const handleConfirmarPago = (e) => {
    e.preventDefault();
    setProcesando(true);
    setTimeout(() => {
      setProcesando(false);
      if (onReservar) onReservar();
    }, 1500);
  };

  if (mostrarFormulario) {
    return (
      <>
        <div className="mb-6">
          <Steps Number='3' Text='Completar pago' />
          <p className="ml-16 -mt-4 text-sm text-gray-600">Ingresa los datos para procesar tu pago</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className={`mb-4 p-4 rounded-xl flex items-center justify-between ${
            tiempoRestante <= 60 ? 'bg-red-50 border border-red-200' : 'bg-orange-50 border border-orange-200'
          }`}>
            <div className="flex items-center gap-2">
              <Timer className={`h-5 w-5 ${tiempoRestante <= 60 ? 'text-red-600' : 'text-orange-600'}`} />
              <span className={`font-medium ${tiempoRestante <= 60 ? 'text-red-900' : 'text-orange-900'}`}>
                Tiempo restante para completar el pago
              </span>
            </div>
            <span className={`text-xl font-bold font-mono ${tiempoRestante <= 60 ? 'text-red-600' : 'text-orange-600'}`}>
              {formatearTiempo(tiempoRestante)}
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <button
                onClick={() => setMostrarFormulario(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-gray-600" />
              </button>
              <div>
                <h2 className='font-semibold text-gray-900'>Formulario de pago</h2>
                <p className="text-sm text-gray-600">Método: {seedData.metodosPago.find(m => m.id === metodoSeleccionado)?.nombre}</p>
              </div>
            </div>
            <form onSubmit={handleConfirmarPago} className="p-6 space-y-4">
              {metodoSeleccionado === 'tarjeta' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Número de tarjeta</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de vencimiento</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre del titular</label>
                    <input
                      type="text"
                      placeholder="Como aparece en la tarjeta"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}
              {(metodoSeleccionado === 'zelle' || metodoSeleccionado === 'pagomovil' || metodoSeleccionado === 'binance' || metodoSeleccionado === 'paypal') && (
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-sm text-gray-700 mb-2">Instrucciones de pago</p>
                  <p className="text-xs text-gray-600">Se generará un código o enlace de pago al confirmar</p>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                <Lock className="h-4 w-4" />
                <span>Conexión segura y encriptada</span>
              </div>
              
              <button
                type="submit"
                disabled={procesando || tiempoRestante === 0}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                  procesando || tiempoRestante === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                }`}
              >
                {procesando ? 'Procesando pago...' : tiempoRestante === 0 ? 'Tiempo expirado' : `Confirmar y pagar $${total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

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
                <Ticket className="h-4 w-4 text-orange-500" />
                Asientos seleccionados
              </h2>
            </div>
            <div className="p-4">
              <div className={`${seats.length > 6 ? 'max-h-65 overflow-y-auto pr-1' : ''} space-y-2 mb-4`}>
                {seats.map(i => <SillasCard key={i} Data={i}/>)}
              </div>
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Comisión</span>
                  <span>${comision.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total a pagar</span>
                  <span className="text-orange-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className='font-semibold text-gray-900 flex items-center gap-2'>
                <CreditCard className="h-4 w-4 text-orange-500" />
                Método de pago
              </h2>
              <p className="text-sm text-gray-600 mt-1">Selecciona el método de pago de tu preferencia</p>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {seedData.metodosPago.map((metodo) => {
                  const Icon = metodo.icon;
                  const seleccionado = metodoSeleccionado === metodo.id;
                  return (
                    <button
                      key={metodo.id}
                      onClick={() => setMetodoSeleccionado(metodo.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                        seleccionado
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg ${
                        seleccionado ? 'bg-orange-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          seleccionado ? 'text-orange-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{metodo.nombre}</p>
                        <p className="text-sm text-gray-500">{metodo.descripcion}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        seleccionado ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                      }`}>
                        {seleccionado && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {metodoSeleccionado && (
                <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-orange-900">Pago seguro</p>
                      <p className="text-xs text-orange-700 mt-1">
                        Los asientos se mantendrán reservados por 5 minutos una vez iniciado el pago
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleContinuarPago}
                disabled={!metodoSeleccionado}
                className={`w-full mt-6 py-3 px-4 rounded-xl font-semibold transition-all ${
                  metodoSeleccionado
                    ? 'bg-linear-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
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