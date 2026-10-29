import { Link } from 'react-router-dom';
import { TicketCheck, Calendar, MapPin, ArrowRight, Zap } from "lucide-react";
import './App.css'

function App() {

  return (
    <>
      <section className="min-h-[calc(100dvh-200px)] flex items-center justify-center px-4">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl"></div>
                <TicketCheck className="relative size-20 text-white bg-linear-to-br from-orange-500 to-orange-600 p-4 rounded-full shadow-lg shadow-orange-500/30"/>
              </div>
            </div>
            <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight text-gray-900 mb-4 leading-tight">
              Compra tus <span className="text-orange-600">boletos</span>
              <br />
              al instante
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Selecciona tu evento, elige tus asientos en el mapa interactivo y asegura tu lugar en segundos
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
              <Link 
                to='/Cliente/Ticketing' 
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                Ver Eventos
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to='/IniciarSesion' 
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-orange-200 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to='/Registro' 
                className="inline-flex items-center justify-center px-8 py-3.5 text-gray-700 font-semibold hover:text-orange-600 transition-colors"
              >
                Crear cuenta gratis
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="group p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-100 transition-all">
              <div className="inline-flex p-3 bg-orange-50 rounded-xl mb-4 group-hover:bg-orange-100 transition-colors">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Todos los eventos</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Deportes, conciertos, teatro y más en un solo lugar</p>
            </div>
            <div className="group p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-100 transition-all">
              <div className="inline-flex p-3 bg-orange-50 rounded-xl mb-4 group-hover:bg-orange-100 transition-colors">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Mapa interactivo</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Elige tu asiento exacto con vista en tiempo real</p>
            </div>
            <div className="group p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-100 transition-all">
              <div className="inline-flex p-3 bg-orange-50 rounded-xl mb-4 group-hover:bg-orange-100 transition-colors">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">Compra rápida</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Proceso simple, seguro y sin complicaciones</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default App
