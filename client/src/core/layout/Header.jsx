import { TicketCheck, Home, LogOut, User, ChevronDown, Ticket } from "lucide-react";
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { authService } from '../../Features/InicioSesion/services/authService'

function Header() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [showMenu, setShowMenu] = useState(false)

  const cargarSesion = () => {
    const currentSession = authService.getSession()
    setSession(currentSession)
  }

  useEffect(() => {
    cargarSesion()
    window.addEventListener('storage', cargarSesion)
    const interval = setInterval(cargarSesion, 1000)
    return () => {
      window.removeEventListener('storage', cargarSesion)
      clearInterval(interval)
    }
  }, [])

  const handleLogout = () => {
    authService.logout()
    setSession(null)
    setShowMenu(false)
    navigate('/Inicio')
  }

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
    if (role === 'admin') return 'Administrador'
    if (role === 'client') return 'Cliente'
    return role
  }

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
          <NavLink
            to="/Inicio"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Inicio</span>
          </NavLink>
          {session && (
            <NavLink
              to="/Cliente/Ticketing"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <TicketCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Comprar boletos</span>
            </NavLink>
          )}

          {session ? (
            <>
              {session.role === 'client' && (
                <Link
                  to="/Cliente/Historial"
                  className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Ticket className="h-4 w-4" />
                  Mis tickets
                </Link>
              )}
              <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                aria-expanded={showMenu}
                aria-haspopup="true"
              >
                <div className="flex items-center justify-center size-9 rounded-full bg-linear-to-br from-orange-500 to-orange-600 text-white font-semibold text-sm shadow-md">
                  {getInitials(session.name)}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900 leading-none">{session.name}</p>
                  <p className="text-xs text-gray-500 leading-none mt-1">{getRoleLabel(session.role)}</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showMenu ? 'rotate-180' : ''}`} />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-11 rounded-full bg-linear-to-br from-orange-500 to-orange-600 text-white font-semibold">
                          {getInitials(session.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{session.name}</p>
                          <p className="text-xs text-gray-500 truncate">{session.email}</p>
                          <p className="text-xs text-orange-600 font-medium mt-1">{getRoleLabel(session.role)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/Perfil"
                        onClick={() => setShowMenu(false)}
                        className="w-full px-4 py-2 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>Ver perfil</span>
                      </Link>
                      {session.role === 'client' && (
                        <Link
                          to="/Cliente/Historial"
                          onClick={() => setShowMenu(false)}
                          className="w-full px-4 py-2 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors md:hidden"
                        >
                          <Ticket className="h-4 w-4" />
                          <span>Mis tickets</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
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
              <Link
                to="/IniciarSesion"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/Registro"
                className="px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-orange-500 to-orange-600 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm shadow-orange-500/20"
              >
                Registrarse
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
    );
}

export default Header;
