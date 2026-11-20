import { Calendar, MapPin, Ticket, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Auth/Context/AuthContext';
import { HistoryService } from '../services/Historial';
import { useEffect, useState } from 'react';
import TicketCard from '../components/TicketCard';

function HistorialTickets() {
  const {user} = useAuth();
  const [loading,setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
      const controller = new AbortController();
      const timer = setTimeout(async () => {
      try {
          setLoading(true);
          const data = await HistoryService.getAllById(user.id);
          setOrders(data);
      } catch (error) {
          if (error.name !== 'CanceledError') {console.error('Error cargando eventos:', error);}
      } finally {setLoading(false);}
      }, 400);

      return () => {clearTimeout(timer); controller.abort();};
  }, []); 

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <Ticket className="h-6 w-6 text-orange-500" />
          Historial de tickets comprados
        </h1>
        <p className="mt-1 text-sm text-gray-600">Revisa todas tus compras y el estado de tus boletos</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-12 text-center">
          <Ticket className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No tienes compras aún</h2>
          <p className="text-gray-600 mb-6">Cuando compres tus primeros boletos, aparecerán aquí</p>
          <Link
            to="/Ticketing"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            Comprar boletos
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order=><TicketCard order={order}/>)}


          {/*reservasUsuario.map((reserva) => {
            const estado = getEstadoInfo(reserva.status);
            const EstadoIcon = estado.icon;
            return (
              <div key={reserva.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className={`px-6 py-3 ${estado.bg} border-b ${estado.border} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <EstadoIcon className={`h-5 w-5 ${estado.color}`} />
                    <span className={`font-semibold ${estado.color}`}>{estado.label}</span>
                  </div>
                  <span className="text-sm text-gray-600">Reserva #{reserva.id}</span>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{reserva.evento?.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{reserva.evento?.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{reserva.venue?.name} • {reserva.venue?.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{reserva.evento?.event_date ? new Date(reserva.evento.event_date).toLocaleDateString('es-ES') : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{reserva.evento?.event_date ? reserva.evento.event_date.slice(11,16) : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Asientos</h4>
                      <div className="space-y-2 mb-4">
                        {reserva.asientos.map((asiento, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                            <span className="text-gray-700">Fila {asiento.fila} - Asiento {asiento.asiento}</span>
                            <span className="font-medium text-gray-900">${asiento.precio?.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Total</span>
                          <span className="text-lg font-semibold text-orange-600">${reserva.total_amount.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Compra realizada: {new Date(reserva.created_at).toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })*/}
        </div>
      )}
    </div>
  );
}

export default HistorialTickets;
