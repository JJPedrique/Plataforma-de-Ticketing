import { TicketCheck, Home, LogOut, User, ChevronDown, Ticket, LayoutDashboard, CalendarDays, UsersRound, MapPin, CreditCard, Palette } from "lucide-react";
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from "../../Features/Auth/Context/AuthContext";
import { getRoleLabel, normalizeRole, ROLES } from '../../shared/constants/roles';

function Header() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    setShowMenu(false)
  }, [location.pathname])

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const normalizedRole = normalizeRole(user?.role)
  const isCustomer = normalizedRole === ROLES.USER
  const isOrganizer = normalizedRole === ROLES.ORGANIZER
  const isAdmin = normalizedRole === ROLES.ADMIN

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/85 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="mx-auto flex h-full flex-nowrap items-center gap-3 px-4 sm:gap-4 sm:px-6 max-w-7xl">
        <Link to="/Inicio" className="flex shrink-0 items-center gap-2 group sm:gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-linear-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-500/20 group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-shadow">
            <TicketCheck className="size-5 text-white" />
          </span>
          <span>
            <span className="block text-xl leading-tight font-bold tracking-tight text-gray-900">TIKETEKA</span>
            <span className="hidden sm:block text-xs text-gray-500">Ticketing & Asignación de Asientos</span>
          </span>
        </Link>

        <nav className="ml-auto flex min-w-0 items-center gap-2">
          <NavLink to="/Inicio" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Inicio</span>
          </NavLink>
      
          {user ? (
            <>
              <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)}
                className="flex min-w-0 max-w-56 items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors sm:max-w-[16rem]"
                aria-expanded={showMenu} aria-haspopup="true">
                <div className="flex shrink-0 items-center justify-center size-9 rounded-full bg-linear-to-br from-orange-500 to-orange-600 text-white font-semibold text-sm shadow-md">
                  {getInitials(user?.first_name+" "+user?.last_name)}
                </div>
                <div className="hidden min-w-0 max-w-40 lg:block text-left sm:max-w-48">
                  <p title={`${user?.first_name || ''} ${user?.last_name || ''}`.trim()} className="truncate text-sm font-medium text-gray-900 leading-none">{user?.first_name+" "+user?.last_name}</p>
                  <p className="truncate text-xs text-gray-500 leading-none mt-1">{getRoleLabel(user?.role)}</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-100" onClick={() => setShowMenu(false)} aria-hidden="true"/>
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-11 rounded-full bg-linear-to-br from-orange-500 to-orange-600 text-white font-semibold">
                          {getInitials(user?.first_name+" "+user?.last_name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p title={`${user?.first_name || ''} ${user?.last_name || ''}`.trim()} className="text-sm font-semibold text-gray-900 truncate">{user?.first_name+" "+user?.last_name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                          <p className="text-xs text-orange-600 font-medium mt-1">{getRoleLabel(user?.role)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      {isCustomer && (<>
                        <NavLink to="/Ticketing" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <TicketCheck className="h-4 w-4" />
                          Comprar boletos
                        </NavLink>

                        <NavLink to="/MisTickets" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <Ticket className="h-4 w-4" />
                          Mis tickets
                        </NavLink>
                      </>)}

                      {isOrganizer && (<>
                        <NavLink to="/Dashboard" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <LayoutDashboard className="h-4 w-4" />
                          Panel
                        </NavLink> 
                        <NavLink to="/GestorEventos" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <CalendarDays className="h-4 w-4" />
                          Mis Eventos
                        </NavLink>
                        <NavLink to="/GestorZonasPrecios" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <Palette className="h-4 w-4" />
                          Zonas y Precios
                        </NavLink>
                      </>)}    

                      {isAdmin && (<>
                        <NavLink to="/PanelAdministrador" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <LayoutDashboard className="h-4 w-4" />
                          Panel de Administración
                        </NavLink>
                        <NavLink to="/GestorUsuarios" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <UsersRound className="h-4 w-4" />
                          Gestor de Usuarios
                        </NavLink>
                        <NavLink to="/GestorLugares" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <MapPin className="h-4 w-4" />
                          Gestor de Lugares
                        </NavLink>
                        <NavLink to="/GestorEventos" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <CalendarDays className="h-4 w-4" />
                          Gestionar Eventos
                        </NavLink>
                        <NavLink to="/GestorZonasPrecios" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <Palette className="h-4 w-4" />
                          Zonas y Precios
                        </NavLink>
                        <NavLink to="/GestorMetodosPago" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <CreditCard className="h-4 w-4" />
                          Gestor de Métodos de Pago
                        </NavLink>                     
                      </>)}          

                        
                      <Link className="w-full px-4 py-2 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      to="/Perfil" onClick={() => setShowMenu(false)}>
                        <User className="h-4 w-4" />
                        Ver perfil
                      </Link>
                        
                       <div className="m-3 border-b border-gray-300"></div>

                      <button onClick={() => { setShowMenu(false); logout(); }}
                        className="w-full px-4 py-2 flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
            <NavLink to="/IniciarSesion" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
              Iniciar sesión
              </NavLink>
              <NavLink to="/Registro" className="px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm shadow-orange-500/20">
                Registrarse
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
    );
}

export default Header;
