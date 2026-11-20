import { TicketCheck, Home, LogOut, User, ChevronDown, Ticket, LayoutDashboard, CalendarDays, UsersRound, MapPin, CreditCard } from "lucide-react";
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from "../../Features/Auth/Context/AuthContext";

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

  const getRoleLabel = (role) => {
    const r = String(role || '').toUpperCase()
    if (r === 'ADMIN') return 'Administrador'
    if (r === 'CUSTOMER' || r === 'USER' || r === 'CLIENT') return 'Cliente'
    if (r === 'ORGANIZER') return 'Organizador'
    return role
  }

  const normalizedRole = String(user?.role || '').toUpperCase()
  const isCustomer = ['CUSTOMER', 'USER', 'CLIENT'].includes(normalizedRole)
  const isOrganizer = normalizedRole === 'ORGANIZER'
  const isAdmin = normalizedRole === 'ADMIN'

  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="mx-auto flex flex-wrap items-center gap-4 px-6 py-3 max-w-7xl">
        <Link to="/Inicio" className="flex items-center gap-3 group">
          <span className="grid size-10 place-items-center rounded-full bg-linear-to-br from-orange-500 to-orange-600 shadow-md shadow-orange-500/20 group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-shadow">
            <TicketCheck className="size-5 text-white" />
          </span>
          <span>
            <span className="block text-xl leading-tight font-bold tracking-tight text-gray-900">TIKETEKA</span>
            <span className="hidden sm:block text-xs text-gray-500">Ticketing & Asignación de Asientos</span>
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-2">
          <NavLink to="/Inicio" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Inicio</span>
          </NavLink>
      
          {user ? (
            <>
              <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                aria-expanded={showMenu} aria-haspopup="true">
                <div className="flex items-center justify-center size-9 rounded-full bg-linear-to-br from-orange-500 to-orange-600 text-white font-semibold text-sm shadow-md">
                  {getInitials(user?.first_name+" "+user?.last_name)}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900 leading-none">{user?.first_name+" "+user?.last_name}</p>
                  <p className="text-xs text-gray-500 leading-none mt-1">{getRoleLabel(user?.role)}</p>
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
                          <p className="text-sm font-semibold text-gray-900 truncate">{user?.first_name+" "+user?.last_name}</p>
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
                          <span className="hidden sm:inline">Comprar boletos</span>
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
                          <span className="hidden sm:inline">Panel</span>
                        </NavLink> 
                        <NavLink to="/GestorEventos" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <CalendarDays className="h-4 w-4" />
                          <span className="hidden sm:inline">Mis Eventos</span>
                        </NavLink>                                          
                      </>)}    

                      {isAdmin && (<>
                        <NavLink to="/PanelAdministrador" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <LayoutDashboard className="h-4 w-4" />
                          <span className="hidden sm:inline">Panel de Administración</span>
                        </NavLink>
                        <NavLink to="/GestorUsuarios" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <UsersRound className="h-4 w-4" />
                          <span className="hidden sm:inline">Gestor de Usuarios</span>
                        </NavLink>
                        <NavLink to="/GestorLugares" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <MapPin className="h-4 w-4" />
                          <span className="hidden sm:inline">Gestor de Lugares</span>
                        </NavLink>
                        <NavLink to="/GestorEventos" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <CalendarDays className="h-4 w-4" />
                          <span className="hidden sm:inline">Gestionar Eventos</span>
                        </NavLink>
                        <NavLink to="/GestorMetodosPago" onClick={() => setShowMenu(false)} className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive ? 'bg-orange-100 text-orange-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}>
                          <CreditCard className="h-4 w-4" />
                          <span className="hidden sm:inline">Gestor de Métodos de Pago</span>
                        </NavLink>                     
                      </>)}          

                        
                      <Link className="w-full px-4 py-2 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      to="/Perfil" onClick={() => setShowMenu(false)}>
                        <User className="h-4 w-4" />
                        <span>Ver perfil</span>
                      </Link>
                        
                       <div className="m-3 border-b border-gray-300"></div>

                      <button onClick={() => { setShowMenu(false); logout(); }}
                        className="w-full px-4 py-2 flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="h-4 w-4" />
                        <span>Cerrar sesión</span>
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
