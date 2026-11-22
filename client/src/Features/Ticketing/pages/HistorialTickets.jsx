import { Ticket } from 'lucide-react';
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
        </div>
      )}
    </div>
  );
}

export default HistorialTickets;
