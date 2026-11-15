import { Link } from 'react-router-dom';
import { 
  TicketCheck, Calendar, MapPin, ArrowRight, Zap, 
  Search, ShieldCheck, Smartphone, CheckCircle2, Users, Music
} from "lucide-react";

function App() {
  return (
    <div className="w-full max-w-5xl mx-auto pb-24">
      {/* SECCIÓN HERO (Existente) */}
      <div className="text-center mb-12 pt-12">
        <div className="inline-flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-2xl"></div>
            <TicketCheck className="relative size-20 text-white bg-linear-to-br from-orange-500 to-orange-600 p-4 rounded-full shadow-lg shadow-orange-500/30" />
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
            to='/Ticketing'
            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Ver Eventos
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* TARJETAS DE RESUMEN (Existente) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-32">
        <div className="group p-6 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl hover:border-orange-200 transition-all">
          <div className="inline-flex p-3 bg-orange-100 rounded-xl mb-4 group-hover:bg-orange-200 transition-colors">
            <Calendar className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">Todos los eventos</h3>
          <p className="text-sm text-gray-700 leading-relaxed">Deportes, conciertos, teatro y más en un solo lugar</p>
        </div>
        <div className="group p-6 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl hover:border-orange-200 transition-all">
          <div className="inline-flex p-3 bg-orange-100 rounded-xl mb-4 group-hover:bg-orange-200 transition-colors">
            <MapPin className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">Mapa interactivo</h3>
          <p className="text-sm text-gray-700 leading-relaxed">Elige tu asiento exacto con vista en tiempo real</p>
        </div>
        <div className="group p-6 bg-white/95 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg hover:shadow-xl hover:border-orange-200 transition-all">
          <div className="inline-flex p-3 bg-orange-100 rounded-xl mb-4 group-hover:bg-orange-200 transition-colors">
            <Zap className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">Compra rápida</h3>
          <p className="text-sm text-gray-700 leading-relaxed">Proceso simple, seguro y sin complicaciones</p>
        </div>
      </div>

      {/* SECCIONES DE PROFUNDIZACIÓN (Nuevas) */}
      <div className="space-y-32 px-4 md:px-0">
        
        {/* Sección 1: Todos los eventos */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 text-orange-600 font-semibold tracking-wide text-sm uppercase">
              <Calendar className="h-5 w-5" />
              Catálogo Completo
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              La cartelera más grande, <span className="text-orange-600">siempre actualizada</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              No te pierdas de nada. Trabajamos con los mejores promotores y recintos para traerte la mayor variedad de entretenimiento directamente a tu pantalla.
            </p>
            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-orange-500 shrink-0" />
                <span className="text-gray-700"><strong>Busca fácilmente:</strong> Filtros por fecha, categoría, ciudad o artista.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-orange-500 shrink-0" />
                <span className="text-gray-700"><strong>Recomendaciones personalizadas:</strong> Descubre eventos basados en tus gustos musicales y deportivos.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-orange-500 shrink-0" />
                <span className="text-gray-700"><strong>Alertas tempranas:</strong> Sé el primero en enterarte cuando salgan a la venta los boletos que esperabas.</span>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative aspect-square md:aspect-4/3 rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-inner flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=')] opacity-50"></div>
              <Music className="h-32 w-32 text-orange-200 relative z-10" />
            </div>
          </div>
        </div>

        {/* Sección 2: Mapa interactivo (Invertido) */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 text-orange-600 font-semibold tracking-wide text-sm uppercase">
              <MapPin className="h-5 w-5" />
              Selección Inteligente
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Visualiza tu experiencia <span className="text-orange-600">antes de comprar</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Olvídate de las sorpresas. Nuestro sistema de mapeo te permite conocer exactamente desde dónde disfrutarás el espectáculo.
            </p>
            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-orange-500 shrink-0" />
                <span className="text-gray-700"><strong>Disponibilidad en vivo:</strong> Los asientos cambian de color instantáneamente cuando alguien más los selecciona.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-orange-500 shrink-0" />
                <span className="text-gray-700"><strong>Agrupación para amigos:</strong> Encuentra fácilmente bloques de asientos contiguos para ir con tu grupo.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-orange-500 shrink-0" />
                <span className="text-gray-700"><strong>Desglose de precios:</strong> Visualiza zonas y tarifas de forma transparente sin cargos ocultos de última hora.</span>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative aspect-square md:aspect-4/3 rounded-2xl bg-linear-to-br from-orange-50 to-orange-100/50 border border-orange-100 shadow-inner flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmVkZDUiLz48L3N2Zz4=')] opacity-60"></div>
              <Search className="h-32 w-32 text-orange-300 relative z-10" />
            </div>
          </div>
        </div>

        {/* Sección 3: Compra rápida */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 text-orange-600 font-semibold tracking-wide text-sm uppercase">
              <Zap className="h-5 w-5" />
              Proceso Garantizado
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Tu tiempo y seguridad son <span className="text-orange-600">nuestra prioridad</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Diseñamos un flujo de pago optimizado para que pases menos tiempo en la pantalla y más tiempo disfrutando de tus eventos favoritos.
            </p>
            <ul className="space-y-4 pt-2">
              <li className="flex items-start gap-3">
                <ShieldCheck className="h-6 w-6 text-orange-500 shrink-0" />
                <span className="text-gray-700"><strong>Pagos 100% seguros:</strong> Encriptación bancaria de extremo a extremo para proteger toda tu información financiera.</span>
              </li>
              <li className="flex items-start gap-3">
                <Smartphone className="h-6 w-6 text-orange-500 shrink-0" />
                <span className="text-gray-700"><strong>Boleto digital al instante:</strong> Recibe tu código QR directamente en tu celular e email, sin necesidad de imprimir.</span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="h-6 w-6 text-orange-500 shrink-0" />
                <span className="text-gray-700"><strong>Atención al cliente 24/7:</strong> Un equipo humano listo para resolver cualquier inconveniente con tu compra.</span>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative aspect-square md:aspect-4/3 rounded-2xl bg-linear-to-br from-orange-100 to-orange-100 shadow-xl flex items-center justify-center overflow-hidden">
               {/* Simulación de un teléfono o pantalla segura */}
              <div className="absolute inset-x-8 inset-y-12 bg-gray-100 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-6">
                <ShieldCheck className="h-16 w-16 text-green-500 mb-4" />
                <div className="h-4 w-32 bg-gray-300 rounded-full mb-2"></div>
                <div className="h-3 w-24 bg-gray-200 rounded-full mb-8"></div>
                <div className="h-48 w-full bg-white rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
                  <span className="font-mono text-gray-400 font-bold tracking-widest">QR CODE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App