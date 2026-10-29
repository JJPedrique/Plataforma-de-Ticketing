import { useState } from 'react';
import { Calendar, MapPin, Users, Ticket, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { eventos } from '../data/eventos';
import { seedData } from '../../../Data/Mock';

function Dashboard() {
  const [stats] = useState({
    totalEventos: eventos.filter((e) => e.is_active).length,
    totalRecintos: seedData.venues.length,
    totalUsuarios: seedData.users.length,
    eventosProximos: eventos.filter((e) => new Date(e.event_date) > new Date()).length,
  });

  const eventosRecientes = [...eventos]
    .sort((a, b) => new Date(b.event_date) - new Date(a.event_date))
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard - Gestor de Eventos</h1>
          <p className="mt-1 text-sm text-gray-600">Panel de administración y gestión de eventos</p>
        </div>
        <Link
          to="/Admin/Eventos"
          className="flex items-center gap-2 bg-amber-500 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Gestionar Eventos
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Eventos Activos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalEventos}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-lg">
              <Calendar className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recintos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalRecintos}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Usuarios</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalUsuarios}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Próximos Eventos</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.eventosProximos}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Eventos Recientes</h2>
            <Link
              to="/Admin/Eventos"
              className="flex items-center gap-1 text-sm font-medium text-amber-600 hover:text-amber-700"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {eventosRecientes.map((evento) => (
              <div key={evento.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{evento.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{evento.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{evento.venue?.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(evento.event_date).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      evento.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {evento.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
          </div>
          <div className="p-4 space-y-2">
            <Link
              to="/Admin/Eventos"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-amber-100 rounded-lg">
                <Plus className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Crear Evento</p>
                <p className="text-xs text-gray-500">Nuevo evento</p>
              </div>
            </Link>
            <Link
              to="/Admin/Eventos"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-lg">
                <Ticket className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Gestionar Asientos</p>
                <p className="text-xs text-gray-500">Configurar mapas y precios</p>
              </div>
            </Link>
            <Link
              to="/Cliente/Ticketing"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Ver como Cliente</p>
                <p className="text-xs text-gray-500">Simular compra</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
