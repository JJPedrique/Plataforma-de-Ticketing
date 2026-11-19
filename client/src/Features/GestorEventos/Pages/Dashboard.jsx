import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  MapPin,
  Plus,
  TrendingUp,
  UserRound,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  eventsApi,
  payMethodsApi,
  usersApi,
  venuesApi,
} from '../../../shared/api/adminApi';
import { useAuth } from '../../Auth/Context/AuthContext';

function normalizeRole(role) {
  return String(role || '').toUpperCase();
}

function Dashboard() {
  const { user } = useAuth();
  const isAdmin = normalizeRole(user?.role) === 'ADMIN';

  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [users, setUsers] = useState([]);
  const [payMethods, setPayMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const [ev, vs, us, pm] = await Promise.all([
          eventsApi.list(),
          venuesApi.list(),
          usersApi.list(),
          payMethodsApi.list(),
        ]);
        if (mounted) {
          setEvents(ev);
          setVenues(vs);
          setUsers(us);
          setPayMethods(pm);
        }
      } catch (e) {
        if (mounted) setError(e.message || 'No se pudo cargar el panel.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  const visibleEvents = useMemo(() => {
    if (isAdmin || !user?.id) return events;
    return events.filter((event) => String(event.organizer_id) === String(user.id));
  }, [events, isAdmin, user?.id]);

  const venuesById = useMemo(
    () => Object.fromEntries(venues.map((venue) => [venue.id, venue])),
    [venues]
  );

  const stats = useMemo(() => {
    const activeEvents = visibleEvents.filter((event) => event.is_active !== false);
    const upcomingEvents = visibleEvents.filter(
      (event) => event.start_date && new Date(event.start_date) > new Date()
    );
    const usedVenueIds = new Set(visibleEvents.map((event) => event.venue_id).filter(Boolean));
    const organizers = users.filter(
      (u) => String(u.role || '').toLowerCase() === 'organizer'
    );

    return {
      activeEvents: activeEvents.length,
      upcomingEvents: upcomingEvents.length,
      venues: isAdmin ? venues.length : usedVenueIds.size,
      organizers: organizers.length,
      totalEvents: visibleEvents.length,
    };
  }, [isAdmin, users, venues, visibleEvents]);

  const recentEvents = useMemo(
    () => [...visibleEvents]
      .sort((a, b) => new Date(b.start_date || 0) - new Date(a.start_date || 0))
      .slice(0, 5),
    [visibleEvents]
  );

  const adminModules = useMemo(() => [
    {
      title: 'Usuarios',
      description: 'Cuentas, roles y estados de acceso',
      count: users.length,
      to: '/GestorUsuarios',
      icon: UsersRound,
    },
    {
      title: 'Lugares',
      description: 'Recintos disponibles para eventos',
      count: venues.length,
      to: '/GestorLugares',
      icon: MapPin,
    },
    {
      title: 'Eventos',
      description: 'Catálogo general de eventos',
      count: events.length,
      to: '/GestorEventos',
      icon: CalendarDays,
    },
    {
      title: 'Métodos de pago',
      description: 'Opciones habilitadas para compras',
      count: payMethods.length,
      to: '/GestorMetodosPago',
      icon: CreditCard,
    },
  ], [events.length, payMethods.length, users.length, venues.length]);

  const statCards = [
    {
      label: isAdmin ? 'Eventos activos' : 'Mis eventos activos',
      value: stats.activeEvents,
      icon: CalendarDays,
    },
    {
      label: isAdmin ? 'Recintos' : 'Recintos utilizados',
      value: stats.venues,
      icon: MapPin,
    },
    {
      label: isAdmin ? 'Organizadores' : 'Eventos registrados',
      value: isAdmin ? stats.organizers : stats.totalEvents,
      icon: isAdmin ? UsersRound : CalendarDays,
    },
    {
      label: 'Próximos eventos',
      value: stats.upcomingEvents,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 p-6 text-white shadow-lg shadow-orange-500/20 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 right-24 size-40 rounded-full bg-white/10" aria-hidden="true" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <LayoutDashboard className="size-4" aria-hidden="true" />
              {isAdmin ? 'Acceso administrativo' : 'Acceso de organizador'}
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {isAdmin ? 'Panel de Administración' : 'Panel del Organizador'}
            </h1>
            <p className="mt-2 text-sm text-orange-50">
              {isAdmin
                ? 'Centraliza la gestión de usuarios, lugares, eventos y métodos de pago.'
                : 'Administra tus eventos y revisa la información de tus recintos.'}
            </p>
          </div>

          <Link
            to="/GestorEventos"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-orange-600 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-600"
          >
            <Plus className="size-4" aria-hidden="true" />
            {isAdmin ? 'Gestionar eventos' : 'Crear evento'}
          </Link>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-600">
          Cargando panel...
        </div>
      ) : (
        <>
          <section aria-label="Resumen general" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map(({ label, value, icon: Icon }) => (
              <article
                key={label}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-orange-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                  </div>
                  <div className="rounded-xl bg-orange-50 p-3">
                    <Icon className="size-6 text-orange-600" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
                  <div className="h-1 w-1/3 rounded-full bg-orange-500" />
                </div>
              </article>
            ))}
          </section>

          {isAdmin && (
            <section aria-labelledby="admin-modules-title">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 id="admin-modules-title" className="text-lg font-semibold text-gray-900">
                    Módulos de administración
                  </h2>
                  <p className="text-sm text-gray-600">Acceso directo a los gestores del sistema.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {adminModules.map(({ title, description, count, to, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="rounded-xl bg-orange-50 p-3">
                        <Icon className="size-5 text-orange-600" aria-hidden="true" />
                      </div>
                      <ArrowUpRight className="size-5 text-gray-400 transition-colors group-hover:text-orange-600" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="text-xs font-medium text-gray-500">Registros</span>
                      <span className="text-sm font-bold text-orange-600">{count}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between border-b border-gray-100 p-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {isAdmin ? 'Eventos recientes' : 'Mis eventos recientes'}
                  </h2>
                  <p className="text-sm text-gray-600">Últimos eventos registrados en el sistema.</p>
                </div>
                <Link
                  to="/GestorEventos"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
                >
                  Ver todos
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {recentEvents.length > 0 ? (
                  recentEvents.map((event) => (
                    <article key={event.id} className="p-4 transition-colors hover:bg-gray-50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-medium text-gray-900">{event.title}</h3>
                          <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                            {event.description || 'Sin descripción'}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="size-3.5 text-orange-500" aria-hidden="true" />
                              {venuesById[event.venue_id]?.name || 'Lugar no disponible'}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <CalendarDays className="size-3.5 text-orange-500" aria-hidden="true" />
                              {event.start_date
                                ? new Date(event.start_date).toLocaleDateString('es-ES')
                                : 'Sin fecha'}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                            event.is_active
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {event.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <CalendarDays className="mx-auto mb-3 size-10 text-gray-400" aria-hidden="true" />
                    <p className="font-medium text-gray-900">Todavía no hay eventos</p>
                    <p className="mt-1 text-sm text-gray-600">
                      Crea un evento desde el gestor para verlo aquí.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900">Acciones rápidas</h2>
                <p className="text-sm text-gray-600">
                  {isAdmin ? 'Atajos de administración.' : 'Atajos para tu trabajo diario.'}
                </p>
              </div>

              <div className="space-y-2 p-4">
                <Link
                  to="/GestorEventos"
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <div className="rounded-xl bg-orange-100 p-2.5">
                    <Plus className="size-4 text-orange-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Crear evento</p>
                    <p className="text-xs text-gray-500">Nuevo evento</p>
                  </div>
                </Link>

                <Link
                  to="/GestorEventos"
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <div className="rounded-xl bg-orange-50 p-2.5">
                    <LayoutDashboard className="size-4 text-orange-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Administrar eventos</p>
                    <p className="text-xs text-gray-500">Buscar, editar y desactivar</p>
                  </div>
                </Link>

                {!isAdmin && (
                  <Link
                    to="/Perfil"
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    <div className="rounded-xl bg-orange-50 p-2.5">
                      <UserRound className="size-4 text-orange-600" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Ver perfil</p>
                      <p className="text-xs text-gray-500">Datos de la cuenta</p>
                    </div>
                  </Link>
                )}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
